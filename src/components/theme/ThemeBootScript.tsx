const themeBootScript = `
(function () {
  try {
    var root = document.documentElement;
    var accent = localStorage.getItem('devbite-accent');
    var font = localStorage.getItem('devbite-font');
    root.dataset.accent = ['violet', 'emerald', 'slate'].includes(accent) ? accent : 'violet';
    root.dataset.font = ['sans', 'serif'].includes(font) ? font : 'sans';
  } catch (_) {}
})();
`

export function ThemeBootScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
}
