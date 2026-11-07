// FOODIE reservation form — Google Apps Script endpoint
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxMeRhIROAC4FXzlAWbkT8BqC_iCP4Swfd4YLnO2TRqFi9kf4Nz9qJ8PlNNo5zcfXldUQ/exec";
const form = document.getElementById("reservationForm");
const statusBox = document.getElementById("formStatus");
const dateField = form.querySelector('[name="date"]');
const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0,10);
dateField.min = today;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  const oldLabel = button.textContent;
  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => body.append(key, String(value).trim()));
  button.disabled = true;
  button.textContent = "Sending…";
  statusBox.className = "";
  statusBox.textContent = "Sending your reservation request…";
  try {
    // no-cors is required because Apps Script does not expose browser CORS headers.
    // The response cannot be inspected; verify a test row in the Reservations sheet.
    await fetch(GOOGLE_SCRIPT_URL, {method:"POST", mode:"no-cors", body});
    statusBox.className = "success";
    statusBox.textContent = "Your request has been sent. Thank you! Our team will contact you to confirm your reservation.";
    form.reset();
    dateField.min = today;
  } catch (err) {
    console.error(err);
    statusBox.className = "error";
    statusBox.textContent = "We couldn't send your request. Please check your connection and try again.";
  } finally {
    button.disabled = false;
    button.textContent = oldLabel;
  }
});

const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
document.getElementById("year").textContent = new Date().getFullYear();