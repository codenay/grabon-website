const installerUrl = 'GrabOn-macOS.zip?v=fb1adb62fff9';
const installerName = 'GrabOn-Beta.zip';


document.querySelectorAll('[data-download]').forEach((button) => {
  button.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = installerUrl;
    link.download = installerName;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
  });
});


const dialog = document.querySelector('#download-dialog');


dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});


// Keep content visible by default; animation is a progressive enhancement.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeReveals = new Set();
let revealObserver;


function setupReveals() {
  revealObserver?.disconnect();
  activeReveals.forEach((animation) => animation.cancel());
  activeReveals.clear();
  if (motionPreference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;


  const targets = document.querySelectorAll('.hero h1, .hero-description, .product-stage, .feature-statement, .feature-stories article, .compact-copy, .compact-visual, .closing');
  revealObserver = new IntersectionObserver((entries) => {
