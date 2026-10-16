// Home page: loads data/stories.json (updated daily by n8n) and lists the stories.
(async function () {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const q = document.getElementById('q');
  const age = document.getElementById('age');
  let stories = [];
  try {
    const res = await fetch('data/stories.json', { cache: 'no-store' });
    stories = await res.json();
  } catch (e) { stories = []; }
  stories.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  function esc(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function render() {
    const text = (q.value || '').toLowerCase();
    const a = age.value;
    const list = stories.filter(s =>
      (!a || s.age === a) &&
      (!text || (s.title_en + ' ' + s.title_ar + ' ' + (s.theme || '')).toLowerCase().includes(text)));
    grid.innerHTML = list.length ? list.map(s => `
      <a class="card" href="stories/${esc(s.slug)}.html">
        <div class="emoji">${esc(s.emoji || '🌙')}</div>
        <h3>${esc(s.title_en)}</h3>
        <div class="ar">${esc(s.title_ar)}</div>
        <span class="tag">Ages ${esc(s.age)}</span>
      </a>`).join('') : '<p>New stories are coming every night. 🌙</p>';
  }
  q.addEventListener('input', render);
  age.addEventListener('change', render);
  render();
})();

// Story page: English / Arabic switch.
document.querySelectorAll('[data-lang-btn]').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang-btn');
    document.querySelectorAll('[data-lang-btn]').forEach(b => b.classList.toggle('on', b === btn));
    document.querySelectorAll('[data-lang]').forEach(el => { el.hidden = el.getAttribute('data-lang') !== lang && lang !== 'both'; });
  });
});
