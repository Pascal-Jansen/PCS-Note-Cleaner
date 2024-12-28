document.addEventListener('DOMContentLoaded', () => {
  const modeRealtimeRadio = document.getElementById('modeRealtime');
  const modeStaticRadio = document.getElementById('modeStatic');
  const staticDateInput = document.getElementById('staticDate');
  const saveBtn = document.getElementById('saveBtn');
  const statusEl = document.getElementById('status');

  // Load previously saved settings
  chrome.storage.local.get(['pretendTodayMode', 'pretendToday'], (res) => {
    const mode = res.pretendTodayMode || "realtime";
    const storedDate = res.pretendToday || "";

    if (mode === "realtime") {
      modeRealtimeRadio.checked = true;
      modeStaticRadio.checked = false;
    } else {
      modeRealtimeRadio.checked = false;
      modeStaticRadio.checked = true;
    }

    staticDateInput.value = storedDate; 
  });

  saveBtn.addEventListener('click', () => {
    const mode = modeRealtimeRadio.checked ? "realtime" : "static";
    const chosenDate = staticDateInput.value; // e.g. "2024-10-05"

    // If user picks static mode, we store the date. If real-time, store blank date
    chrome.storage.local.set({
      pretendTodayMode: mode,
      pretendToday: (mode === "static") ? chosenDate : ""
    }, () => {
      statusEl.textContent = `Saved. Mode=${mode}, date=${chosenDate}`;
      console.log("[PrecisionConf] Saved => mode:", mode, ", date:", chosenDate);

      setTimeout(() => {
        statusEl.textContent = "";
      }, 1500);
    });
  });
});