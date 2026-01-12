let date = new Date();
let view = "month";

const calendar = document.getElementById("cal");
const dayName = document.getElementById("dayname");
const dayPanel = document.getElementById("hours");
const monthTitle = document.getElementById("monthHeader").getElementsByTagName("h1")[0];
const weekdaysDiv = document.getElementById("weekdays");

const weekbtn = document.getElementById("weekbtn");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");

const MonthsToString = [
  "ינואר","פברואר","מרץ","אפריל","מאי","יוני",
  "יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"
];

const Days = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

const today = new Date();

const eventsByDate = JSON.parse(localStorage.getItem("calendarEvents")) || {};

function saveEvents() {
  localStorage.setItem("calendarEvents", JSON.stringify(eventsByDate));
}

function toDayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function startOfWeek(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}

function renderWeekdaysHeader() {
  weekdaysDiv.innerHTML = "";
  for (const day of Days) {
    const div = document.createElement("div");
    div.innerText = day;
    weekdaysDiv.appendChild(div);
  }
}

function updateNavTooltips() {
  if (view === "week") {
    prevBtn.dataset.tooltip = "שבוע קודם";
    nextBtn.dataset.tooltip = "שבוע הבא";
    prevBtn.title = "שבוע קודם";
    nextBtn.title = "שבוע הבא";
  } else {
    prevBtn.dataset.tooltip = "חודש קודם";
    nextBtn.dataset.tooltip = "חודש הבא";
    prevBtn.title = "חודש קודם";
    nextBtn.title = "חודש הבא";
  }
}

function render() {
  updateNavTooltips();
  renderCalendar(date);
  renderDayView(date);
}

function renderCalendar(d) {
  if (view === "week") renderWeek(d);
  else renderMonth(d);
}

function renderMonth(d) {
  calendar.innerHTML = "";

  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.innerText = `${MonthsToString[month]} ${year}`;

  for (let i = 0; i < startDay; i++) {
    const pad = document.createElement("div");
    pad.classList.add("pad");
    calendar.appendChild(pad);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(year, month, day);
    const btn = document.createElement("button");
    btn.innerText = day;

    if (isSameDay(dayDate, today)) btn.classList.add("today");
    if (isSameDay(dayDate, date)) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      date = dayDate;
      render();
    });

    calendar.appendChild(btn);
  }
}

function renderWeek(d) {
  calendar.innerHTML = "";

  const start = startOfWeek(d);
  monthTitle.innerText = `${MonthsToString[d.getMonth()]} ${d.getFullYear()}`;

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + i);

    const btn = document.createElement("button");
    btn.innerText = dayDate.getDate();

    if (isSameDay(dayDate, today)) btn.classList.add("today");
    if (isSameDay(dayDate, date)) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      date = dayDate;
      render();
    });

    calendar.appendChild(btn);
  }
}

function renderDayView(d) {
  const key = toDayKey(d);
  const events = eventsByDate[key] || [];

  dayName.innerText = `${Days[d.getDay()]} ${d.getDate()} ${MonthsToString[d.getMonth()]} ${d.getFullYear()}`;

  dayPanel.innerHTML = "";

  const addBtn = document.createElement("button");
  addBtn.innerText = "➕ הוסף אירוע ליום הזה";
  addBtn.classList.add("addEventBtn");

  addBtn.addEventListener("click", () => {
    const title = prompt("שם האירוע:");
    if (!title) return;

    const time = prompt("שעה (אופציונלי, למשל 14:30):", "") || "";
    const notes = prompt("הערות (אופציונלי):", "") || "";

    const newEvent = { title, time, notes, createdAt: Date.now() };

    eventsByDate[key] = (eventsByDate[key] || []).concat(newEvent);

    eventsByDate[key].sort((a, b) => {
      const ta = (a.time || "").trim();
      const tb = (b.time || "").trim();
      if (!ta && tb) return 1;
      if (ta && !tb) return -1;
      return ta.localeCompare(tb) || (a.createdAt - b.createdAt);
    });

    saveEvents();
    renderDayView(d);
  });

  dayPanel.appendChild(addBtn);

  if (events.length === 0) {
    const empty = document.createElement("div");
    empty.classList.add("emptyEvents");
    empty.innerText = "אין אירועים ליום הזה עדיין.";
    dayPanel.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.classList.add("eventsList");

  events.forEach((ev, idx) => {
    const row = document.createElement("div");
    row.classList.add("eventRow");

    const main = document.createElement("div");
    main.classList.add("eventMain");
    main.innerText = `${ev.time ? ev.time + " • " : ""}${ev.title}`;

    row.appendChild(main);

    if (ev.notes) {
      const notes = document.createElement("div");
      notes.classList.add("eventNotes");
      notes.innerText = ev.notes;
      row.appendChild(notes);
    }

    const del = document.createElement("button");
    del.classList.add("delEventBtn");
    del.innerText = "מחק";
    del.addEventListener("click", () => {
      const arr = eventsByDate[key] || [];
      arr.splice(idx, 1);
      if (arr.length === 0) delete eventsByDate[key];
      saveEvents();
      renderDayView(d);
    });

    row.appendChild(del);
    list.appendChild(row);
  });

  dayPanel.appendChild(list);
}

weekbtn.addEventListener("change", (e) => {
  view = e.target.checked ? "week" : "month";
  render();
});

prevBtn.addEventListener("click", () => {
  if (view === "month") {
    date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  } else {
    const x = new Date(date);
    x.setDate(x.getDate() - 7);
    date = x;
  }
  render();
});

nextBtn.addEventListener("click", () => {
  if (view === "month") {
    date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  } else {
    const x = new Date(date);
    x.setDate(x.getDate() + 7);
    date = x;
  }
  render();
});

renderWeekdaysHeader();
render();
