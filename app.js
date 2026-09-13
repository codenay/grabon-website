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
    setTimeout(() => link.remove(), 1000);
  });
});
const dialog = document.querySelector('#download-dialog');
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
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
    const entering = entries.filter((entry) => entry.isIntersecting);
    entering.forEach((entry, index) => {
      const element = entry.target;
      revealObserver.unobserve(element);
      if (element.dataset.revealed) return;
      element.dataset.revealed = 'true';
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 650,
        delay: Math.min(index * 75, 150),
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'backwards'
      });
      activeReveals.add(animation);
      animation.onfinish = animation.oncancel = () => activeReveals.delete(animation);
    });
  }, { threshold: 0.06 });
  targets.forEach((target) => {
    if (!target.dataset.revealed) revealObserver.observe(target);
  });
}
setupReveals();
motionPreference.addEventListener('change', setupReveals);
document.addEventListener('focusin', () => {
  activeReveals.forEach((animation) => animation.finish());
});
