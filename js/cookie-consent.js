// Lightweight, honest cookie notice.
// This site does not use analytics or advertising cookies, so there is
// nothing to "accept" beyond acknowledging the notice. Strictly necessary
// items (contact form submission, admin login session) don't legally
// require consent, but we say so plainly anyway.
(function () {
  try {
    if (localStorage.getItem('wbsc_cookie_notice_seen')) return;
  } catch (e) { /* localStorage unavailable, still show the notice */ }

  var bar = document.createElement('div');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Cookie notice');
  bar.style.cssText = [
    'position:fixed', 'left:0', 'right:0', 'bottom:0', 'z-index:200',
    'background:#14110c', 'color:#f2eee0', 'padding:16px 20px',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
    'font-size:0.9rem', 'display:flex', 'flex-wrap:wrap', 'gap:14px',
    'align-items:center', 'justify-content:center',
    'box-shadow:0 -4px 20px rgba(0,0,0,0.15)'
  ].join(';');

  bar.innerHTML =
    '<span style="max-width:640px;">' +
      'We only use cookies and local storage that are essential to running this site (like keeping you signed in to the admin diary). No analytics or advertising cookies. See our ' +
      '<a href="/privacy-policy.html" style="color:#f2c869;">Privacy Policy</a>.' +
    '</span>' +
    '<button type="button" id="wbsc-cookie-ok" style="background:#b5811f;color:#fff;border:none;padding:9px 20px;border-radius:999px;font-size:0.85rem;font-weight:600;cursor:pointer;white-space:nowrap;">Got it</button>';

  document.body.appendChild(bar);

  document.getElementById('wbsc-cookie-ok').addEventListener('click', function () {
    try { localStorage.setItem('wbsc_cookie_notice_seen', '1'); } catch (e) {}
    bar.remove();
  });
})();
