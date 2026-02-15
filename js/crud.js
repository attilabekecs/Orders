function addRow(){
  data.push({
    partner: currentPartner,
    status: currentStatus,
    fields: Array(15).fill("")
  });
  autoSave();
  render();
}

function deleteRow(index){
  data.splice(index,1);
  autoSave();
  render();
}

function updateField(row, col, value){
  data[row].fields[col] = value;
  autoSave();
}

function updateStatus(row, value){
  data[row].status = value;
  autoSave();
  render();
}

function updateRsk(rowIndex, qty, type){
  let current = data[rowIndex].fields[5] || "|Raklap";
  let parts = current.split("|");

  if(qty !== null) parts[0] = qty;
  if(type !== null) parts[1] = type;

  data[rowIndex].fields[5] = parts.join("|");
  autoSave();
}
