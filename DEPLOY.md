# Deploying the Garimella Family Tree (free)

Two pieces:

1. **The website** (`index.html`) → hosted free on **GitHub Pages**.
2. **The backend** (`Code.gs`) → a free **Google Apps Script** web app that holds the
   passwords and stores the data in your Google Drive.

- **master** copy = *yours*. Only the **owner password** can change it.
- **community** copy = the shared one. Anyone with the **family password** edits it.
  Your master is never touched by family edits.

---

## Part A — Set up the backend (Google Apps Script)

1. Go to <https://script.google.com> → **New project**.
2. Delete the sample code, then copy in the entire contents of **`Code.gs`**.
3. In the toolbar, choose the function **`setup`** and click **Run**.
   Approve the Google Drive permission prompt (it's your own account).
   - This creates two files in your Drive: `familytree_master.json` and
     `familytree_community.json`, and two default passwords.
4. Click the gear **⚙ Project Settings** → scroll to **Script Properties** → edit:
   - `OWNER_PASSWORD` → a strong password **only you** know.
   - `EDIT_PASSWORD` → the password you'll **share with family**.
5. Click **Deploy → New deployment**.
   - Type: **Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy**, approve, and **copy the Web app URL**
     (looks like `https://script.google.com/macros/s/AKfyc.../exec`).

> Whenever you change `Code.gs` later, you must **Deploy → Manage deployments →
> edit (pencil) → New version** for the change to go live. (Changing Script
> Properties/passwords does **not** need a redeploy.)

---

## Part B — Connect the website

1. Open **`index.html`** and find this line near the top of the `<script>`:

   ```js
   const API_URL = '';
   ```

2. Paste your Web app URL between the quotes:

   ```js
   const API_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
   ```

3. Save the file.

---

## Part C — Host the website on GitHub Pages

1. Create a free GitHub account and a new **public** repository
   (e.g. `garimella-family-tree`).
2. Upload `index.html` (the `Code.gs` and `.md` files can be there too; they're ignored by the site).
3. In the repo: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)** → **Save**.
4. After a minute your site is live at
   `https://<your-username>.github.io/garimella-family-tree/`.

Share that link with family.

---

## Day-to-day use

- **Anyone** who opens the link can **view** the tree.
- Click **🔒 Unlock to edit** and enter a password:
  - **Family password** → you're editing the **community** copy. Make changes, then
    click **☁ Save changes**.
  - **Owner password** (only you) → you're editing your **master** copy. You also get
    a **Publish → Community** button, which copies your master over the shared copy
    (use it to push your "official" version out).
- **Export** downloads a backup `.json` at any time. **Import** loads one back in
  (then Save to push it to the cloud).

### First time: seed the data
Open the site, click **🔒 Unlock**, log in with the **owner password**, **Import**
your existing `garimella_family_tree.json`, then click **☁ Save changes** (saves to
master) and **Publish → Community** so family members see it.

### Notes
- The community copy is **last-save-wins** — if two people edit at the exact same
  time, whoever saves last wins. Fine for occasional family edits; just avoid two
  people editing simultaneously.
- The password is checked on Google's servers, so it never appears in the page source.
- Viewing requires no password; only editing/saving does.
