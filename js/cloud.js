async function loadFromCloud(){
  try{
    const res = await fetch(API_URL);
    const cloudData = await res.json();

    if(Array.isArray(cloudData)){
      data = cloudData;
      console.log("Cloud betöltve");
    }
  }catch{
    console.log("Cloud nem elérhető → local backup");
    const saved = localStorage.getItem("ordersData");
    if(saved) data = JSON.parse(saved);
  }
}

async function saveToCloud(){
  try{
    await fetch(API_URL, {
      method:"POST",
      body: JSON.stringify(data),
      headers:{ "Content-Type":"application/json" }
    });
    console.log("Cloud mentve");
  }catch{
    console.log("Cloud mentés hiba");
  }
}

function autoSave(){
  localStorage.setItem("ordersData", JSON.stringify(data));

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveToCloud();
  }, 1000);
}
