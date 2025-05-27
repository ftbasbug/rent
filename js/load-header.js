/* load-header.js */

document.addEventListener("DOMContentLoaded", function () {
  fetch("components/header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-container").innerHTML = data;

      // Reattach event listeners after injection
      const toggle = document.getElementById("darkModeToggle");
      if (toggle) {
        toggle.addEventListener("click", () => {
          const currentTheme = document.body.getAttribute("data-theme");
          const newTheme = currentTheme === "dark" ? "light" : "dark";
          document.body.setAttribute("data-theme", newTheme);
        });
      }
    });
});
