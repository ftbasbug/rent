/* details-payment.js */
document.getElementById("detailsForm").addEventListener("submit", function () {
  this.action = CONFIG.FORM_ENDPOINT;
  setTimeout(() => {
    window.location.href = "thankyou.html";
  }, 1000);
});
