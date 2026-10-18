// Qamar Stories. No cookies, no storage, no tracking.
// Home page: filters the story cards already in the page (works without JS too: all cards stay visible).
(function () {
  var grid = document.getElementById('grid');
  if (!grid) return;
  var q = document.getElementById('q');
  var age = document.getElementById('age');
  var status = document.getElementById('results-status');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFKD')
      .replace(/[̀-ًͯ-ٰٟـ]/g, '')
      .replace(/[آأإ]/g, 'ا');
  }
  function render() {
    var words = norm(q ? q.value : '').split(/\s+/).filter(Boolean);
    var a = age ? age.value : '';
    var shown = 0;
    cards.forEach(function (c) {
      var hay = norm(c.getAttribute('data-search'));
      var ok = (!a || c.getAttribute('data-age') === a) &&
        words.every(function (w) { return hay.indexOf(w) !== -1; });
      c.hidden = !ok;
      if (ok) shown++;
    });
    if (status) {
      status.textContent = !cards.length ? 'New stories are coming every night. 🌙'
        : shown ? shown + (shown === 1 ? ' story' : ' stories')
        : 'No story matches. Try another word or another age.';
    }
  }
  if (q) q.addEventListener('input', render);
  if (age) age.addEventListener('change', render);
  render();
})();

// Story page: English / Arabic / Both. The choice is kept in the address (#ar, #both), so it can be shared.
(function () {
  var btns = Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]'));
  if (!btns.length) return;
  function setLang(lang, update) {
    btns.forEach(function (b) {
      var on = b.getAttribute('data-lang-btn') === lang;
      b.type = 'button';
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.hidden = lang !== 'both' && el.getAttribute('data-lang') !== lang;
    });
    if (update && window.history && history.replaceState) {
      history.replaceState(null, '', location.pathname + (lang === 'en' ? '' : '#' + lang));
    }
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang-btn'), true); });
  });
  var h = location.hash.replace('#', '');
  setLang(h === 'ar' || h === 'both' ? h : 'en', false);
})();
