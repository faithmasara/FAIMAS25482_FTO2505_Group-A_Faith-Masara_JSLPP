/* ===========================================================
   Single-file app (no modules). Everything wired + persistent.
   Includes logo link slots that double as mobile menu trigger
   when href is "#".
=========================================================== */

(() => {
  const LS_TASKS = "kanban.tasks";
  const LS_THEME = "kanban.theme";

  /* ---------- ELEMENTS ---------- */
  const els = {
    // Columns & counts
    todoCol: document.getElementById("todoCol"),
    doingCol: document.getElementById("doingCol"),
    doneCol: document.getElementById("doneCol"),
    todoCount: document.getElementById("todoCount"),
    doingCount: document.getElementById("doingCount"),
    doneCount: document.getElementById("doneCount"),

    // Add task buttons
    addBtnDesktop: document.getElementById("addTaskBtn"),
    addBtnMobile: document.getElementById("addTaskBtnMobile"),

    // Add modal
    addModal: document.getElementById("addModal"),
    closeAddModal: document.getElementById("closeAddModal"),
    resetAddForm: document.getElementById("resetAddForm"),
    addForm: document.getElementById("addForm"),
    newTitle: document.getElementById("newTitle"),
    newDesc: document.getElementById("newDesc"),
    newStatus: document.getElementById("newStatus"),
    newPriority: document.getElementById("newPriority"),

    // Edit modal
    taskModal: document.getElementById("taskModal"),
    closeTaskModal: document.getElementById("closeTaskModal"),
    taskForm: document.getElementById("taskForm"),
    taskId: document.getElementById("taskId"),
    taskTitle: document.getElementById("taskTitle"),
    taskDesc: document.getElementById("taskDesc"),
    taskStatus: document.getElementById("taskStatus"),
    taskPriority: document.getElementById("taskPriority"),
    deleteTaskBtn: document.getElementById("deleteTaskBtn"),

    // Mobile drawer & theme toggles
    mobileDrawer: document.getElementById("mobileDrawer"),
    mobileBackdrop: document.getElementById("mobileBackdrop"),
    closeMobileMenu: document.getElementById("closeMobileMenu"),
    themeDesktop: document.getElementById("themeDesktop"),
    themeMobile: document.getElementById("themeMobile"),

    // Logo links (for you to set link + image in HTML)
    brandLogoDesktopLink: document.getElementById("brandLogoDesktopLink"),
    brandLogoMobileLink: document.getElementById("brandLogoMobileLink"),

    // Template
    cardTemplate: document.getElementById("cardTemplate"),
  };

  /* ---------- STARTER DATA (includes priority) ---------- */
  const STARTER = [
    { id: 1, title: "Launch Epic Career 🚀", description: "", status: "todo",  priority: "high"   },
    { id: 2, title: "Conquer React 🧠",      description: "", status: "todo",  priority: "medium" },
    { id: 3, title: "Understand Databases 🕷️", description: "", status: "todo", priority: "low"   },
    { id: 4, title: "Crush Frameworks 🖼️",   description: "", status: "todo",  priority: "low"   },
    { id: 5, title: "Master JavaScript 💛",  description: "", status: "doing", priority: "high"   },
    { id: 6, title: "Never Give Up 🏆",      description: "", status: "doing", priority: "medium" },
    { id: 7, title: "Explore ES6 Features 🚀", description: "", status: "done", priority: "medium"},
    { id: 8, title: "Have fun 🥳",           description: "", status: "done",  priority: "low"    },
  ];

  /* ---------- UTILITIES ---------- */
  const VALID_STATUS = new Set(["todo","doing","done"]);
  const VALID_PRIORITY = new Set(["high","medium","low"]);
  const normStatus = s => (VALID_STATUS.has((s||"").toLowerCase()) ? (s||"").toLowerCase() : "todo");
  const normPriority = p => (VALID_PRIORITY.has((p||"").toLowerCase()) ? (p||"").toLowerCase() : "medium");

  function migrate(list) {
    return (list || []).map(t => ({
      id: Number(t.id) || 0,
      title: String(t.title || "Untitled"),
      description: String(t.description || ""),
      status: normStatus(t.status),
      priority: normPriority(t.priority),
    }));
  }

  function loadTasks() {
    const raw = localStorage.getItem(LS_TASKS);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const migrated = migrate(parsed);
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
          localStorage.setItem(LS_TASKS, JSON.stringify(migrated));
        }
        return migrated;
      } catch {
        localStorage.setItem(LS_TASKS, JSON.stringify(STARTER));
        return structuredClone(STARTER);
      }
    }
    localStorage.setItem(LS_TASKS, JSON.stringify(STARTER));
    return structuredClone(STARTER);
  }
  function saveTasks(tasks) {
    localStorage.setItem(LS_TASKS, JSON.stringify(migrate(tasks)));
  }

  function loadTheme() {
    return localStorage.getItem(LS_THEME) === "dark" ? "dark" : "light";
  }
  function saveTheme(mode) {
    localStorage.setItem(LS_THEME, mode === "dark" ? "dark" : "light");
  }
  function applyTheme(mode) {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (els.themeDesktop) els.themeDesktop.checked = mode === "dark";
    if (els.themeMobile)  els.themeMobile.checked  = mode === "dark";
  }

  function nextId(tasks) {
    return tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }

  /* ---------- RENDERING ---------- */
  const PWT = { high: 3, medium: 2, low: 1 };
  function sortCol(arr) { // High → Medium → Low, then id asc
    return arr.slice().sort((a, b) => (PWT[b.priority]-PWT[a.priority]) || (a.id - b.id));
  }

  function createCard(task, onOpen) {
    const btn = /** @type {HTMLButtonElement} */(els.cardTemplate.content.firstElementChild.cloneNode(true));
    const titleDiv = btn.querySelector(".font-medium");
    if (titleDiv) titleDiv.textContent = task.title;

    // Priority badge
    const badge = btn.querySelector(".priority.badge");
    const map = {
      high:   "bg-rose-600/10 text-rose-600 border border-rose-600/30",
      medium: "bg-amber-500/10 text-amber-600 border border-amber-500/30",
      low:    "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30",
    };
    const level = task.priority || "medium";
    badge.className = `priority badge text-xs px-2 py-1 rounded-full ${map[level] || map.medium}`;
    badge.textContent = level[0].toUpperCase() + level.slice(1);

    if (task.description) {
      const desc = document.createElement("div");
      desc.className = "text-xs mt-1 text-slate-500 dark:text-slate-400 line-clamp-2";
      desc.textContent = task.description;
      btn.appendChild(desc);
    }

    btn.addEventListener("click", () => onOpen(task.id));
    return btn;
  }

  function render(tasks) {
    // Clear columns
    els.todoCol.innerHTML = "";
    els.doingCol.innerHTML = "";
    els.doneCol.innerHTML = "";

    // Group & sort
    const groups = {
      todo:  sortCol(tasks.filter(t => t.status === "todo")),
      doing: sortCol(tasks.filter(t => t.status === "doing")),
      done:  sortCol(tasks.filter(t => t.status === "done")),
    };

    // Append
    groups.todo.forEach(t => els.todoCol.appendChild(createCard(t, openEdit)));
    groups.doing.forEach(t => els.doingCol.appendChild(createCard(t, openEdit)));
    groups.done.forEach(t => els.doneCol.appendChild(createCard(t, openEdit)));

    // Counts
    els.todoCount.textContent = groups.todo.length;
    els.doingCount.textContent = groups.doing.length;
    els.doneCount.textContent = groups.done.length;

    // Console snapshot
    console.clear();
    console.log("All tasks:", tasks);
    const done = tasks.filter(t => t.status === "done");
    if (done.length) console.log("Completed Tasks:", done.map(t => t.title));
    else console.log("No tasks completed, let's get to work!");
  }

  /* ---------- STATE ---------- */
  let tasks = loadTasks();

  /* ---------- MODALS ---------- */
  function openAdd() {
    els.addModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    els.newTitle.focus();
  }
  function closeAdd() {
    els.addModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    els.addForm.reset();
  }

  function openEdit(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;

    els.taskId.value = String(t.id);
    els.taskTitle.value = t.title;
    els.taskDesc.value = t.description || "";
    els.taskStatus.value = t.status;
    els.taskPriority.value = t.priority || "medium";

    els.taskModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }
  function closeEdit() {
    els.taskModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    els.taskForm.reset();
  }

  /* ---------- EVENT WIRING ---------- */

  // Add Task buttons
  els.addBtnDesktop?.addEventListener("click", openAdd);
  els.addBtnMobile?.addEventListener("click", openAdd);

  // Add form submit
  els.addForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = {
      id: nextId(tasks),
      title: (els.newTitle.value || "").trim() || "Untitled",
      description: (els.newDesc.value || "").trim(),
      status: normStatus(els.newStatus.value),
      priority: normPriority(els.newPriority.value || "medium"),
    };
    tasks.push(t);
    saveTasks(tasks);
    render(tasks);
    closeAdd();
  });

  // Add modal controls
  els.closeAddModal?.addEventListener("click", closeAdd);
  els.resetAddForm?.addEventListener("click", () => els.addForm.reset());

  // Edit modal save
  els.taskForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = Number(els.taskId.value);
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;

    tasks[idx].title = (els.taskTitle.value || "").trim() || "Untitled";
    tasks[idx].description = (els.taskDesc.value || "").trim();
    tasks[idx].status = normStatus(els.taskStatus.value);
    tasks[idx].priority = normPriority(els.taskPriority.value || "medium");

    saveTasks(tasks);
    render(tasks);
    closeEdit();
  });

  // Edit modal delete with confirmation
  els.deleteTaskBtn?.addEventListener("click", () => {
    const id = Number(els.taskId.value);
    if (confirm("Delete this task? This cannot be undone.")) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks(tasks);
      render(tasks);
      closeEdit();
    }
  });

  // Close edit modal
  els.closeTaskModal?.addEventListener("click", closeEdit);

  // Click outside modals closes them
  [els.taskModal, els.addModal].forEach(modal => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.id === "taskModal" ? closeEdit() : closeAdd();
      }
    });
  });

  // ESC key closes modals and drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEdit();
      closeAdd();
      closeDrawer();
    }
  });

  /* ---------- MOBILE DRAWER + LOGO LINK BEHAVIOR ---------- */
  function openDrawer() {
    els.mobileDrawer?.classList.remove("hidden");
    document.body.classList.add("modal-open");
  }
  function closeDrawer() {
    els.mobileDrawer?.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }
  document.getElementById("mobileBackdrop")?.addEventListener("click", closeDrawer);
  els.closeMobileMenu?.addEventListener("click", closeDrawer);

  // Mobile logo link: if href is '#', treat as menu opener; else navigate
  els.brandLogoMobileLink?.addEventListener("click", (e) => {
    const href = (e.currentTarget.getAttribute("href") || "").trim();
    if (!href || href === "#") {
      e.preventDefault();
      openDrawer();
    }
  });

  /* ---------- THEME TOGGLES ---------- */
  function setTheme(mode) {
    applyTheme(mode);
    saveTheme(mode);
  }
  els.themeDesktop?.addEventListener("change", (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  });
  els.themeMobile?.addEventListener("change", (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  });

  /* ---------- BOOTSTRAP ---------- */
  applyTheme(loadTheme());
  render(tasks);
})();
