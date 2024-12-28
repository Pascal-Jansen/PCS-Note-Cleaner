// content.js

console.log("[PrecisionConf Extension] Script loaded at top-level.");

// We'll define mainLogic() to retrieve date + run removal
function mainLogic() {
  console.log("[PrecisionConf Extension] mainLogic() => retrieving storage.");

  chrome.storage.local.get(['pretendTodayMode', 'pretendToday'], (res) => {
    let fakeToday = new Date(); // default to real system date
    const mode = res.pretendTodayMode || "realtime";
    const userDateStr = res.pretendToday || "";

    console.log("[PrecisionConf Extension] mode =", mode, ", stored date =", userDateStr);

    if (mode === "realtime") {
      console.log("[PrecisionConf Extension] Using real system date =>", fakeToday.toString());
    } else {
      // mode === "static"
      const parsedDate = new Date(userDateStr);
      if (!isNaN(parsedDate.getTime())) {
        fakeToday = parsedDate;
        console.log("[PrecisionConf Extension] Using user-chosen static date =>", fakeToday.toString());
      } else {
        console.warn("[PrecisionConf Extension] Could not parse stored date => defaulting to real now =>", fakeToday.toString());
      }
    }

    runRemovalLogic(fakeToday);
  });
}

// This function actually removes <li> if date < fakeToday
function runRemovalLogic(now) {
  console.log("[PrecisionConf Extension] runRemovalLogic() => scanning for 'Required by <date>:' in <li>.");

  const liElements = document.querySelectorAll("ul.incomplete li");
  console.log(`[PrecisionConf Extension] Found ${liElements.length} <li> in <ul class='incomplete'>`);

  const requiredByRegex = /Required by\s+([^:]+):/i;

  liElements.forEach((li, idx) => {
    const text = li.textContent.trim();
    console.log(`[PrecisionConf Extension] <li> #${idx}, text="${text}"`);

    const match = requiredByRegex.exec(text);
    if (match) {
      const dateStr = match[1].trim();
      console.log(`[PrecisionConf Extension] Found => "${match[0]}" => date="${dateStr}"`);

      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        console.log(`[PrecisionConf Extension] Parsed => ${parsedDate.toString()}`);

        if (parsedDate < now) {
          console.log(`[PrecisionConf Extension] => date in the past => removing <li> #${idx}`);
          li.remove();
        } else {
          console.log("[PrecisionConf Extension] => date not in the past => keep <li> #", idx);
        }
      } else {
        console.log("[PrecisionConf Extension] => couldn't parse date => skip <li> #", idx);
      }
    } else {
      console.log("[PrecisionConf Extension] => no 'Required by' pattern => skip <li> #", idx);
    }
  });

  console.log("[PrecisionConf Extension] Done scanning <li> elements.");
}

// ------------- WAITING FOR DOM + FALLBACK -----------------

console.log(`[PrecisionConf Extension] document.readyState => ${document.readyState}`);

if (document.readyState === "loading") {
  // The DOM is still parsing => wait for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[PrecisionConf Extension] DOMContentLoaded => calling mainLogic()");
    mainLogic();
  });
} else {
  // The DOM is already loaded or interactive => run immediately
  console.log("[PrecisionConf Extension] Document not 'loading' => calling mainLogic() now.");
  mainLogic();
}

// Fallback in 2 seconds => handle dynamic injections
setTimeout(() => {
  console.log("[PrecisionConf Extension] Fallback => re-checking after 2 seconds...");
  mainLogic();
}, 2000);