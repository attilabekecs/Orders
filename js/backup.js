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

function loadJSON(event){
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    data = JSON.parse(e.target.result);
    autoSave();
    render();
  };
  reader.readAsText(file);
}
