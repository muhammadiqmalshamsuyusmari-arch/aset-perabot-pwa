/**
 * Backend Google Apps Script — Inventori Perabot Kelas SK Sungai Tiram
 * Spreadsheet ID: 19Rrh88OigPhzpgU_Smohj_xqq1dMvzm7Y73IQYTChLI
 * Deploy as Web app, execute as the deploying account.
 * NOTE: This endpoint replaces all rows in the dedicated "Inventori" tab on save.
 */
const SPREADSHEET_ID = '19Rrh88OigPhzpgU_Smohj_xqq1dMvzm7Y73IQYTChLI';
const SHEET_NAME = 'Inventori';
const HEADERS = ['id', 'name', 'year', 'pupils', 'mk', 'mp', 'kk', 'kp', 'damage', 'order'];

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'load';
  try {
    if (action === 'ping') {
      return json_({ ok: true, message: 'SKST Inventori API aktif', sheet: SHEET_NAME });
    }
    if (action !== 'load') return json_({ ok: false, error: 'Tindakan GET tidak disokong.' });

    const sheet = getSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return json_({ ok: true, data: [], updatedAt: new Date().toISOString() });

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
    return json_({ ok: true, data: data, updatedAt: new Date().toISOString() });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doPost(e) {
  let lock;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw) throw new Error('Data POST kosong.');
    const body = JSON.parse(raw);
    if (body.action !== 'save' || !Array.isArray(body.data)) {
      throw new Error('Format tidak sah. Hantar { action: "save", data: [...] }.');
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

    sheet.clearContents();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    if (rows.length) sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
    SpreadsheetApp.flush();
    return json_({ ok: true, saved: rows.length, updatedAt: new Date().toISOString() });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
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
