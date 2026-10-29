/**
 * Google Apps Script backend — Inventori Perabot Kelas SK Sungai Tiram
 * Spreadsheet ID: 19Rrh88OigPhzpgU_Smohj_xqq1dMvzm7Y73IQYTChLI
 * Deploy as Web app; Execute as: Me. Access: according to school policy.
 * Save requests use an HTML form (to avoid browser CORS restrictions), then
 * the browser checks the result through a JSONP status endpoint.
 */
const SPREADSHEET_ID = '19Rrh88OigPhzpgU_Smohj_xqq1dMvzm7Y73IQYTChLI';
const SHEET_NAME = 'helaian pertama (gid=0)';
const HEADERS = ['id', 'name', 'year', 'pupils', 'mk', 'mp', 'kk', 'kp', 'damage', 'order'];
const STATUS_PREFIX = 'skst_save_status_';

function doGet(e) {
  const params = (e && e.parameter) || {};
  const action = params.action || 'load';
  let result;
  try {
    if (action === 'ping') {
      result = { ok: true, message: 'SKST Inventori API aktif', sheet: SHEET_NAME };
    } else if (action === 'status') {
      const token = String(params.token || '');
      if (!/^[a-zA-Z0-9_-]{1,100}$/.test(token)) throw new Error('Token status tidak sah.');
      const cached = CacheService.getScriptCache().get(STATUS_PREFIX + token);
      result = cached ? JSON.parse(cached) : { ok: true, pending: true };
    } else if (action === 'load') {
      const sheet = getSheet_();
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) {
        result = { ok: true, data: [], updatedAt: new Date().toISOString() };
      } else {
        const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
        const data = rows.filter(row => row.some(value => value !== '' && value !== null)).map(row => {
          const item = {};
          HEADERS.forEach((header, index) => item[header] = row[index]);
          ['pupils', 'mk', 'mp', 'kk', 'kp', 'order'].forEach(key => item[key] = toNumber_(item[key]));
          item.id = String(item.id || '');
          item.name = String(item.name || 'Kelas Baharu');
          item.year = String(item.year || 'Lain-lain');
          item.damage = String(item.damage || '');
          return item;
        });
        result = { ok: true, data: data, updatedAt: new Date().toISOString() };
      }
    } else {
      throw new Error('Tindakan GET tidak disokong.');
    }
  } catch (error) {
    result = { ok: false, error: String(error && error.message ? error.message : error) };
  }
  if (params.callback) return jsonp_(params.callback, result);
  return json_(result);
}

function doPost(e) {
  const params = (e && e.parameter) || {};
  const token = String(params.token || '');
  let lock;
  try {
    // Browser form POSTs provide e.parameter.payload; JSON POST remains supported too.
    let body;
    if (params.payload) {
      body = JSON.parse(params.payload);
    } else {
      const raw = e && e.postData && e.postData.contents;
      if (!raw) throw new Error('Data POST kosong.');
      body = JSON.parse(raw);
    }
    if (body.action !== 'save' || !Array.isArray(body.data)) {
      throw new Error('Format tidak sah. Data perlu mengandungi action=save dan data berbentuk senarai.');
    }
    if (body.data.length > 500) throw new Error('Maksimum 500 rekod dibenarkan.');

    lock = LockService.getScriptLock();
    lock.waitLock(15000);
    const sheet = getSheet_();
    const rows = body.data.map((item, index) => {
      const name = String(item.name == null ? '' : item.name).trim();
      if (!name) throw new Error('Nama kelas kosong pada rekod ' + (index + 1) + '.');
      return [
        String(item.id || Utilities.getUuid()), name,
        String(item.year || inferYear_(name)),
        toNumber_(item.pupils), toNumber_(item.mk), toNumber_(item.mp),
        toNumber_(item.kk), toNumber_(item.kp),
        String(item.damage == null ? '' : item.damage), toNumber_(item.order)
      ];
    });

    // Only the first sheet (gid=0, matching the user's published CSV) is replaced; other tabs remain untouched.
    sheet.clearContents();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    if (rows.length) sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
    SpreadsheetApp.flush();

    const result = { ok: true, saved: rows.length, updatedAt: new Date().toISOString() };
    saveStatus_(token, result);
    return ContentService.createTextOutput('Simpanan diproses. Anda boleh menutup tab ini.');
  } catch (error) {
    const result = { ok: false, error: String(error && error.message ? error.message : error) };
    saveStatus_(token, result);
    return ContentService.createTextOutput('Simpanan gagal. Semak Apps Script dan cuba semula.');
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function saveStatus_(token, result) {
  if (!token || !/^[a-zA-Z0-9_-]{1,100}$/.test(token)) return;
  CacheService.getScriptCache().put(STATUS_PREFIX + token, JSON.stringify(result), 600);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  // The user's published CSV URL points to gid=0; write to that same first tab
  // so saved data is visible in the sheet the user is already checking.
  const sheets = spreadsheet.getSheets();
  let sheet = sheets.find(s => s.getSheetId() === 0) || sheets[0];
  if (!sheet) throw new Error('Spreadsheet tidak mempunyai helaian untuk menyimpan data.');
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function toNumber_(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function inferYear_(name) {
  const match = String(name).match(/^Tahun\s*[1-6]/i);
  return match ? match[0].replace(/\s+/, ' ') : 'Lain-lain';
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(callback, value) {
  const safeCallback = String(callback);
  if (!/^skst_cb_[a-zA-Z0-9_]+$/.test(safeCallback)) return json_({ ok: false, error: 'Callback tidak sah.' });
  return ContentService.createTextOutput(safeCallback + '(' + JSON.stringify(value) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
