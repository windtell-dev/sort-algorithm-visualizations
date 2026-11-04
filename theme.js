// Applies the saved theme before the page paints. Dark is the default.
function savedTheme() {
  try { return localStorage.getItem('theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch {}
}
function initThemeSwitch() {
  const toggle = document.getElementById('themeToggle');
  const sync = () => toggle.setAttribute('aria-checked', document.documentElement.dataset.theme === 'light');
  toggle.onclick = () => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    sync();
  };
  sync();
}
document.documentElement.dataset.theme = savedTheme();
