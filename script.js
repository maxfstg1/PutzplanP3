// --- Aufgabendefinitionen ---
const tasks = [
  { id: 1, task: "Mülleimer leeren", freq: "bei Bedarf", desc: "Restmüll, Bio; Gelber Sack nach Bedarf", boxes: 0 },
  { id: 2, task: "Pflanzen gießen", freq: "bei Bedarf", desc: "Alle Zimmerpflanzen checken", boxes: 0 },
  { id: 3, task: "Duschkopf & Wasserhahn entkalken", freq: "bei Bedarf", desc: "Essig/Entkalker verwenden", boxes: 0 },
  { id: 4, task: "Arbeitsflächen Küche reinigen", freq: "nach Benutzung", desc: "Arbeitsplatten & Fliesenübergänge", boxes: 0 },

  { id: 5, task: "Staubsaugen", freq: "2× wöchentlich", desc: "Wohnzimmer, Flur, Küche, Bad", boxes: 4 },
  { id: 6, task: "Toilette putzen", freq: "wöchentlich", desc: "Sitz, Rand, Schüssel, außen", boxes: 4 },
  { id: 7, task: "Waschbecken Bad reinigen", freq: "wöchentlich", desc: "Armaturen, Ablage, Schränke", boxes: 4 },
  { id: 8, task: "Küche: Herd & Backblech", freq: "wöchentlich", desc: "Kochfeld reinigen, Backblech falls nötig", boxes: 4 },
  { id: 9, task: "Spüle reinigen", freq: "wöchentlich", desc: "Kurz auswischen, trocknen", boxes: 4 },
  { id: 10, task: "Regale & Oberflächen entstauben", freq: "wöchentlich", desc: "Auch Sockelleisten", boxes: 4 },
  { id: 11, task: "Spiegel & Glasflächen", freq: "wöchentlich", desc: "Badezimmer- & Flurspiegel", boxes: 4 },
  { id: 13, task: "Böden wischen", freq: "alle 2 Wochen", desc: "Feuchtes Wischen Stein/Fliese", boxes: 2 },
  { id: 14, task: "Duschwand entkalken", freq: "alle 2 Wochen", desc: "Mit Entkalker behandeln", boxes: 2 },

  { id: 15, task: "Duschablauf reinigen", freq: "alle 2–4 Wochen", desc: "Haare etc. entfernen", boxes: 2 },
  { id: 16, task: "Fensterrähmen abwischen", freq: "alle 2–4 Wochen", desc: "Rahmen & Fensterbank", boxes: 2 },

  { id: 17, task: "Kaffeemaschine entkalken", freq: "alle 4 Wochen", desc: "Entkalker unter der Spüle", boxes: 1 },
  { id: 18, task: "Kühlschrank sortieren", freq: "alle 4 Wochen", desc: "Abgelaufene Lebensmittel raus", boxes: 1 },
  { id: 19, task: "Backofen reinigen", freq: "alle 4 Wochen", desc: "Innenraum wischen", boxes: 1 },

  { id: 21, task: "Kühlschrank komplett reinigen", freq: "alle 3 Monate", desc: "Fächer & Dichtungen", boxes: 1 },
  { id: 22, task: "Fugen reinigen", freq: "1× pro Jahr", desc: "Schimmelvorsorge abcde", boxes: 1 }
];

// DOM Elemente
const container = document.getElementById("tasks");
const monthDisplay = document.getElementById("monthDisplay");

// Monats-Key (z. B. "2025-02")
const monthKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

// Monatsanzeige
monthDisplay.textContent = `📅 ${new Date().toLocaleDateString("de-DE", {
  month: "long",
  year: "numeric"
})}`;

// Firebase: live Daten holen
db.ref("months/" + monthKey()).on("value", (snapshot) => {
  const saved = snapshot.val() || {};
  render(saved);
});

// --- Rendering aller Karten ---
function render(savedState) {
  container.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";

    // Checkboxen generieren
    let checksHtml = "";
    for (let i = 0; i < task.boxes; i++) {
      const checked = savedState[task.id]?.[i] ? "checked" : "";
      checksHtml += `<input type="checkbox" data-task="${task.id}" data-box="${i}" ${checked}> `;
    }

    // HTML der Karte
    card.innerHTML = `
      <h2>${task.task}</h2>
      <div class="freq">${task.freq}</div>
      <div class="desc">${task.desc}</div>
      <div class="checkboxes">${checksHtml}</div>
    `;

    container.appendChild(card);
  });

  // Firebase Updates bei Klick speichern
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", e => {
      const taskId = e.target.dataset.task;
      const boxIndex = e.target.dataset.box;
      const value = e.target.checked;

      db.ref(`months/${monthKey()}/${taskId}/${boxIndex}`).set(value);
    });
  });
}
