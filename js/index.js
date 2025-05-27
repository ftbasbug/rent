// index.js

document.addEventListener("DOMContentLoaded", () => {
  const waitForElements = setInterval(() => {
    const darkModeBtn = document.getElementById("darkModeToggle");
    const bookingForm = document.getElementById("bookingForm");

    if (darkModeBtn && bookingForm) {
      clearInterval(waitForElements);

      // Dark/Light Toggle
      darkModeBtn.addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", newTheme);
      });

      // Form Submission
      bookingForm.addEventListener("submit", function () {
        this.action = CONFIG.FORM_ENDPOINT;
        setTimeout(() => {
          window.location.href = "vehicle-selection.html";
        }, 1000);
      });
    }
  }, 100); // Check every 100ms
});
