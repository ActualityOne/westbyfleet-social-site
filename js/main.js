document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  var form = document.querySelector('form.enquiry[data-enquiry-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Honeypot spam trap — bots fill hidden fields, humans never see them.
      var honeypot = form.querySelector('.hp-field input');
      if (honeypot && honeypot.value) {
        e.preventDefault();
      }
    });
  }
});
