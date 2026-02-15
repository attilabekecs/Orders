let expandedRows = {};


// ================= PARTNER =================
function selectPartner(p){
  currentPartner = p;

  document.querySelectorAll(".topmenu button")
    .forEach(b=>b.classList.remove("active"));

  const btn = document.getElementById(p === "Fonlak" ? "pFonlak" : "pSen");
  if(btn) btn.classList.add("active");

  render();
}


// ================= STATUS =================
function selectStatus(s){
  currentStatus = s;

  document.querySelectorAll(".statusmenu button")
    .forEach(b=>b.classList.remove("active"));

  const map = {
    "Proformán":"sPro",
    "Készleten":"sKes",
    "Érkezik":"sErk",
    "Elküldve":"sElk"
  };

  const btn = document.getElementById(map[s]);
  if(btn) btn.classList.add("active");

  render();
}


// ================= LENYITÁS =================
function toggleDetails(index){
  expandedRows[index] = !expandedRows[index];
  render();
}


// ================= RENDER =================
function render(){
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  data
  .filter(r => r.partner === currentPartner && r.status === currentStatus)
  .forEach((row) => {

    const rowIndex = data.indexOf(row);
    const expanded = expandedRows[rowIndex];

    let tr = document.createElement("tr");

    // ▼ lenyitó gomb
    tr.innerHTML += `
      <td>
        <button onclick="toggleDetails(${rowIndex})">
          ${expanded ? "▼" : "▶"}
        </button>
      </td>
    `;

    // státusz select
    tr.innerHTML += `
      <td>
        <select onchange="updateStatus(${rowIndex}, this.value)">
          <option ${row.status=="Proformán"?"selected":""}>Proformán</option>
          <option ${row.status=="Készleten"?"selected":""}>Készleten</option>
          <option ${row.status=="Érkezik"?"selected":""}>Érkezik</option>
          <option ${row.status=="Elküldve"?"selected":""}>Elküldve</option>
        </select>
      </td>
    `;

    // ================= FŐ OSZLOPOK =================
    row.fields.forEach((f, col)=>{

      // Raklap/Sor/Karton speciális mező
      if(col === 5){
        let qty = row.fields[5]?.split("|")[0] || "";
        let type = row.fields[5]?.split("|")[1] || "Raklap";

        tr.innerHTML += `
          <td style="display:flex; gap:5px;">
            <input type="number" value="${qty}" 
              oninput="updateRsk(${rowIndex}, this.value, null)">
            <select onchange="updateRsk(${rowIndex}, null, this.value)">
              <option ${type=="Raklap"?"selected":""}>Raklap</option>
              <option ${type=="Sor"?"selected":""}>Sor</option>
              <option ${type=="Karton"?"selected":""}>Karton</option>
            </select>
          </td>`;
      }

      // ⭐ CSAK AZ ELSŐ 11 mező MARAD a fő sorban
      else if(col < 11){
        tr.innerHTML += `
          <td>
            <input value="${f || ""}" 
              oninput="updateField(${rowIndex},${col},this.value)">
          </td>`;
      }
    });

    // törlés gomb
    tr.innerHTML += `
      <td>
        <button class="deleteBtn" onclick="deleteRow(${rowIndex})">X</button>
      </td>
    `;

    // ⭐ ELŐSZÖR fő sor
    tbody.appendChild(tr);


    // ================= LENYITHATÓ CSOMAGOLÁS =================
    if(expanded){
      let details = document.createElement("tr");
      details.innerHTML = `
        <td colspan="14" style="padding:20px;background:#020617;">
          <b>📊 Csomagolás adatok</b><br><br>

          db / Raklap:
          <input value="${row.fields[11] || ""}" 
            oninput="updateField(${rowIndex},11,this.value)">

          db / Sor:
          <input value="${row.fields[12] || ""}" 
            oninput="updateField(${rowIndex},12,this.value)">

          db / Karton:
          <input value="${row.fields[13] || ""}" 
            oninput="updateField(${rowIndex},13,this.value)">

          Karton / Raklap:
          <input value="${row.fields[14] || ""}" 
            oninput="updateField(${rowIndex},14,this.value)">
        </td>
      `;
      tbody.appendChild(details);
    }

  });
}
