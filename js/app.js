window.onload = async () => {
  await loadFromCloud();
  selectPartner("Fonlak");
  selectStatus("Proformán");
  render();
};
