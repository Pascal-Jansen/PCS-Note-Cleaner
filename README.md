# PCS-Note-Cleaner

A Chrome extension that scans the *PrecisionConference* ([PCS](https://new.precisionconference.com/submissions)) submission page and removes any table cells containing a *Required by* note if that date is already in the past.
You can choose whether to use your real system date or a static date (e.g., a year in the past), which is useful for testing or simulating conditions.

## Installation
1. Clone or download this repository to your local machine.
2. Open Chrome and visit chrome://extensions.
	- Ensure Developer mode is turned ON (toggle in the top right corner).
3. Click “Load unpacked.”
	- Browse to the folder you just cloned (the folder containing manifest.json, popup.html, popup.js, content.js, etc.).
	- Select it.
4. Confirm the extension is now visible in your list of installed extensions.
	- You can also pin the extension icon to Chrome’s toolbar if desired.

## Usage
1. Open the extension popup (click its icon in the top-right of Chrome). You’ll see a small UI:
	- "Use Real System Date” (default)
	- "Use a Specific Date” (and a date-picker)
2.	Choose your option:
	- If you pick “Use Real System Date,” the script always uses your actual system date/time.
	- If “Use a Specific Date,” enter a date via the date-picker (e.g., “2024-10-05”). This is a fixed day, so it does not advance automatically each day.
3.	Hit “Save.”
	- The extension stores your choice in chrome.storage.local.
4.	Visit or refresh <https://new.precisionconference.com/submissions*>.
	- Open Chrome DevTools (F12) -> Console to see logs from the content script. 
	- If any `<li>` has Required by <date>: and <date> < your chosen “today,” that `<li>` is removed.

## Notes
- Date Parsing:
	- The extension looks for the pattern "Required by `<date>`:" using a simple regex. If the text or format changes, or the date can’t be parsed by JavaScript, the extension may skip it.
- Non-Permanent:
	- We only remove the `<li>` client-side. This is purely a visual removal on your local machine, not on the server.
- Dynamic Injection:
	- The script runs on DOMContentLoaded plus a 2-second fallback. If the site still loads data later than that, you might need additional code (e.g., a MutationObserver) to catch newly inserted `<li>` elements.

## File Overview
- `manifest.json`
Describes the extension (name, version, permissions, content_scripts).
- `popup.html + popup.js`
The user interface for setting the mode (“realtime” or “static”) and saving the chosen date to storage.
- `content.js`
Injected on <https://new.precisionconference.com/submissions*>. Reads the saved date from storage, scans for *Required by* and removes any `<li>` with a past date.
