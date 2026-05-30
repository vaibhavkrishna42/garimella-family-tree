/**
 * Garimella Family Tree — backend (Google Apps Script web app)
 * -----------------------------------------------------------------
 * Stores two JSON files in your Google Drive:
 *   • master    — YOUR pristine copy (only the owner password can write it)
 *   • community — the shared copy that family members edit
 *
 * SETUP (one time):
 *   1. Go to https://script.google.com  →  New project.
 *   2. Delete the sample code and paste this whole file in (Code.gs).
 *   3. Run the `setup` function once (pick it in the toolbar, click Run).
 *      Approve the Drive permissions when prompted.
 *   4. Open  Project Settings (gear icon)  →  Script Properties  and change:
 *         OWNER_PASSWORD  → a strong password ONLY you know
 *         EDIT_PASSWORD   → the password you share with family
 *   5. Deploy  →  New deployment  →  type "Web app".
 *         Execute as: Me
 *         Who has access: Anyone
 *      Copy the Web app URL it gives you.
 *   6. Paste that URL into API_URL near the top of index.html.
 */

const PROPS = PropertiesService.getScriptProperties();

/* Run this ONCE from the editor to create the files + default passwords. */
function setup() {
  if (!PROPS.getProperty('OWNER_PASSWORD')) PROPS.setProperty('OWNER_PASSWORD', 'change-me-owner');
  if (!PROPS.getProperty('EDIT_PASSWORD'))  PROPS.setProperty('EDIT_PASSWORD',  'change-me-family');
  getFile_('master');
  getFile_('community');
  Logger.log('Setup complete. Now set OWNER_PASSWORD and EDIT_PASSWORD in Script Properties.');
}

/* ── Storage helpers ─────────────────────────────────────────────── */
function getFile_(which) {
  const key = 'FILE_' + which;
  const id = PROPS.getProperty(key);
  if (id) {
    try { return DriveApp.getFileById(id); } catch (e) { /* fall through, recreate */ }
  }
  const f = DriveApp.createFile('familytree_' + which + '.json', '{}', 'application/json');
  PROPS.setProperty(key, f.getId());
  return f;
}
function readData_(which)      { const c = getFile_(which).getBlob().getDataAsString(); return (c && c.trim()) ? c : '{}'; }
function writeData_(which, str){ getFile_(which).setContent(str); }

function role_(pw) {
  if (!pw) return null;
  if (pw === PROPS.getProperty('OWNER_PASSWORD')) return 'owner';
  if (pw === PROPS.getProperty('EDIT_PASSWORD'))  return 'editor';
  return null;
}
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ── Public read: anyone can view the community tree ─────────────── */
function doGet() {
  return ContentService.createTextOutput(readData_('community')).setMimeType(ContentService.MimeType.JSON);
}

/* ── Authenticated actions ──────────────────────────────────────── */
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'Bad request' }); }

  const role = role_(body.password);
  const which = body.which === 'master' ? 'master' : 'community';

  switch (body.action) {
    case 'check':
      return out_({ ok: !!role, role: role });

    case 'load':
      if (which === 'master' && role !== 'owner') return out_({ ok: false, error: 'Not authorized' });
      return out_({ ok: true, data: JSON.parse(readData_(which)) });

    case 'save':
      if (!role) return out_({ ok: false, error: 'Wrong password' });
      if (which === 'master' && role !== 'owner') return out_({ ok: false, error: 'Only the owner can edit the master copy' });
      writeData_(which, JSON.stringify(body.data));
      return out_({ ok: true });

    case 'publish':                       // owner copies master → community
      if (role !== 'owner') return out_({ ok: false, error: 'Owner only' });
      writeData_('community', readData_('master'));
      return out_({ ok: true });

    default:
      return out_({ ok: false, error: 'Unknown action' });
  }
}
