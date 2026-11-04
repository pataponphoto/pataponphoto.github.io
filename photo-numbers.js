(() => {
  const button = document.querySelector('#number-toggle');
  if (!button || !document.querySelector('#grid, .photo-number')) return;
  const storageKey = 'patapon-photo-show-numbers';
  let enabled = false;
  try { enabled = sessionStorage.getItem(storageKey) === 'true'; } catch (_) {}

  function update() {
    document.body.classList.toggle('show-photo-numbers', enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.textContent = enabled ? '번호 숨기기' : '번호 보기';
  }
  button.hidden = false;
  update();
  button.addEventListener('click', () => {
    enabled = !enabled;
    update();
    try { sessionStorage.setItem(storageKey, String(enabled)); } catch (_) {}
  });
})();
