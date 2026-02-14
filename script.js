let currentPartner = "Fonlak";
let currentStatus = "Proformán";

let data = [];

function selectPartner(p){
  currentPartner = p;
  document.querySelectorAll(".topmenu button").forEach(b=>b.classList.remove("active"));
  event.target.classList.add("active");
  render();
}

function selectStatus(s){
  currentStatus = s;
  document.querySelectorAll(".statusmenu button").forEach(b=>b.classList.remove("active"));
  event.target.classList.add("active");
  render();
}

function addRow(){
  data.push({
    partner: currentPartner,
    status: currentStatus,
    fields: Array(15).fill("")
  });
  render();
}

function deleteRow(index){
  data.splice(index,1);
  render();
}

function updateField(row, col, value){
  data[row].fields[col] = value;
}

function updateStatus(row, value){
  data[row].status = value;
  render();
}

function render(){
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  data
  .filter(r => r.partner === currentPartner && r.status === currentStatus)
  .forEach((row) => {

    const rowIndex = data.indexOf(row);   // ⭐ EZ AZ ÚJ

    let tr = document.createElement("tr");

    let statusSelect = `
      <select onchange="updateStatus(${rowIndex}, this.value)">
        <option ${row.status=="Proformán"?"selected":""}>Proformán</option>
        <option ${row.status=="Készleten"?"selected":""}>Készleten</option>
        <option ${row.status=="Érkezik"?"selected":""}>Érkezik</option>
        <option ${row.status=="Elküldve"?"selected":""}>Elküldve</option>
      </select>`;
    tr.innerHTML += `<td>${statusSelect}</td>`;

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
      else{
        tr.innerHTML += `<td>
          <input value="${f || ""}" 
          oninput="updateField(${rowIndex},${col},this.value)">
        </td>`;
      }
    });

    tr.innerHTML += `<td><button class="deleteBtn" onclick="deleteRow(${rowIndex})">X</button></td>`;
    tbody.appendChild(tr);
  });
}


selectPartner("Fonlak");
selectStatus("Proformán");

// JSON MENTÉS
function saveJSON(){
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], {type:"application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "orders_backup.json";
  a.click();

  URL.revokeObjectURL(url);
}

// JSON BETÖLTÉS
function loadJSON(event){
  const file = event.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(e){
    data = JSON.parse(e.target.result);
    render();
  };
  reader.readAsText(file);
}
function updateRsk(rowIndex, qty, type){
  let current = data[rowIndex].fields[5] || "|Raklap";
  let parts = current.split("|");

  if(qty !== null) parts[0] = qty;
  if(type !== null) parts[1] = type;

  data[rowIndex].fields[5] = parts.join("|");
}


