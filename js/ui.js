function selectPartner(p){
  currentPartner = p;

  document.querySelectorAll(".topmenu button")
    .forEach(b=>b.classList.remove("active"));

  const btn = document.getElementById(p === "Fonlak" ? "pFonlak" : "pSen");
  if(btn) btn.classList.add("active");

  render();
}

function selectStatus(s){
  currentStatus = s;
  document.querySelectorAll(".statusmenu button").forEach(b=>b.classList.remove("active"));
  event.target.classList.add("active");
  render();
}

function render(){
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  data
  .filter(r => r.partner === currentPartner && r.status === currentStatus)
  .forEach((row) => {

    const rowIndex = data.indexOf(row);
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
