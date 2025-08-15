# JSL Portfolio Piece: Kanban App Deployment & Features Implementation
Kanban Board (HTML + Tailwind CDN + JavaScript)

veed link to presentation; https://www.veed.io/view/5b34aea5-60a9-4dbb-9fde-0d61d0481531?panel=share

https://app.netlify.com/projects/gorgeous-daifuku-05d5aa/deploys

A responsive, Figma-accurate Kanban board with To Do / Doing / Done columns, priority sorting, modals for editing, delete with confirmation, a synced dark mode toggle (desktop + mobile), and full localStorage persistence — all in two files: index.html and app.js.

✨ Features

Dynamic columns: Tasks render into To Do, Doing, and Done based on status.

LocalStorage persistence: Tasks & theme survive refreshes and browser restarts.

Create / Edit / Delete:

Add new tasks via Add Task modal.

Click any task to open Edit Task modal (title, description, status, priority).

Delete asks for confirmation; cancel preserves data.

Priority levels: High / Medium / Low show as badges on cards and drive auto-sorting (High → Medium → Low) within each column.

Responsive design: Desktop sidebar; mobile slide-in drawer opened via the logo.

Dark mode: Toggle in both desktop sidebar and mobile drawer — synced & saved.

Logo slots: Plug-and-play logo image + link for both desktop and mobile.

🧩 Tech Stack

HTML (semantic structure)

Tailwind CSS (CDN) – no build step required

JavaScript (Vanilla) – DOM manipulation, events, localStorage

📂 Project Structure
/ (repo root)
├─ index.html        # UI, layout, modals, and logo slots
├─ app.js            # Logic: render, CRUD, sorting, theme, storage
└─ images/           # (optional) your logo or assets

🚀 Getting Started
1) Clone & open locally
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

2) Run with VS Code Live Server (or any static server)

Open the folder in VS Code

Right-click index.html → Open with Live Server

Or use a quick server:

npx serve .
# or
python3 -m http.server 5173

3) Configure your logo (optional)

In index.html, replace the placeholders:

<!-- Desktop -->
<a id="brandLogoDesktopLink" href="YOUR_LOGO_LINK_HERE" class="block w-10 h-10">
  <img id="brandLogoDesktop" src="YOUR_LOGO_URL_HERE" alt="Kanban Logo" class="w-full h-full object-contain">
</a>

<!-- Mobile (acts as menu opener if href="#" ) -->
<a id="brandLogoMobileLink" href="#" class="flex items-center gap-2">
  <img id="brandLogoMobile" src="YOUR_LOGO_URL_HERE" alt="Kanban Logo" class="w-10 h-10 object-contain">
  <span class="text-lg font-bold">kanban</span>
</a>


If brandLogoMobileLink’s href="#", tapping the logo opens the mobile menu.

If you set a real URL, it will navigate there instead.

4) First run behavior

On first load, the board seeds with initial demo tasks (matching the design).

After that, your edits and new tasks are stored in localStorage.

🖱️ How to Use

Add a task:
Click + Add (mobile) or + Add New Task (desktop) → fill in title, description, status, priority → Create.

Edit a task:
Click a task card → update fields → Save.

Changing status moves it to the right column.

Changing priority re-sorts it within the column.

Delete a task:
In the Edit modal, click Delete → confirm prompt → task is removed from the board & storage.

Dark mode:
Toggle Dark Mode in the desktop sidebar or mobile drawer. It’s synced and remembered.

🧠 Design Decisions

Two-file simplicity: Everything works without bundlers or module loaders.

Priority sorting: Keeps urgent work visible at the top (High → Medium → Low).

Persistence by default: User changes always stick via localStorage.

Dark mode via class="dark": Tailwind’s darkMode: 'class' keeps styling controllable and explicit.

🌐 Deploy to Netlify
Option A — Drag & Drop

Zip or select your project folder containing index.html and app.js.

Go to app.netlify.com → Sites → Add new site → Deploy manually.

Drop the folder — done!

Option B — Import from Git

Push to GitHub/GitLab/Bitbucket.

Add new site → Import from Git on Netlify.

Settings:

Build command: (leave empty)

Publish directory: .

Deploy.

(Optional) netlify.toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/app.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

🐛 Troubleshooting

Nothing is clickable / no theme toggle / no tasks appear

Make sure app.js is loaded at the end of index.html:

<script src="./app.js"></script>


Open DevTools → Console for errors and Network for 404s.

Check filename case (app.js vs App.js) and path (./app.js).

Logo not showing

Ensure your image path exists or use an absolute URL (e.g., https://.../logo.svg).

Try opening https://<yoursite>.netlify.app/images/logo.png directly.

LocalStorage didn’t load

Clear site storage or use a private window to re-seed starter tasks.

Inspect Application → Local Storage to view/edit raw data.

🧪 Manual Test Checklist

 Add task → appears in correct column & persists.

 Edit title → card updates immediately & persists.

 Edit description → reopen modal shows saved text.

 Change status → task moves columns & persists.

 Change priority → card re-orders (High → Medium → Low) & persists.

 Delete → confirm removes; cancel does nothing.

 Dark mode → toggle in desktop & mobile; synced and persisted.

 Mobile drawer opens from logo (when href="#") and closes via ×, backdrop, or Esc.

📝 Scripts / Commands

None required for build. Use any static server:

npx serve .
# or:
python3 -m http.server 5173

📜 License

MIT — feel free to use, modify, and share.

🙌 Acknowledgements

Tailwind CSS (CDN) for rapid, responsive styling.

Figma-inspired layout for the Kanban look and feel.



