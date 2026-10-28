const menu = document.querySelector('.menu');
const navigation = document.querySelector('.nav');
const projects = document.querySelector('.project-menu');
const mobile = window.matchMedia('(max-width: 760px)');

function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  if (menu) menu.textContent = 'Menu +';
  navigation?.classList.remove('open');
}

// Collapse mobile navigation only when scripting is available.
document.documentElement.classList.add('js');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Close −' : 'Menu +';
  navigation.classList.toggle('open', open);
});

navigation?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
    if (projects) projects.open = false;
  });
});

document.addEventListener('click', event => {
  if (projects && !projects.contains(event.target)) projects.open = false;
  if (!event.target.closest('header')) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (projects?.open) {
    projects.open = false;
    projects.querySelector('summary').focus();
  } else if (navigation?.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});

navigation?.addEventListener('focusout', event => {
  if (!navigation.contains(event.relatedTarget) && event.relatedTarget !== menu) {
    if (projects) projects.open = false;
    closeMenu();
  }
});
mobile.addEventListener('change', () => {
  closeMenu();
  if (projects) projects.open = false;
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

document.getElementById('copy-email')?.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  const address = document.querySelector('.email').href.replace('mailto:', '');
  try {
    await navigator.clipboard.writeText(address);
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Select and copy the email address above.';
  }
});

document.getElementById('print-profile')?.addEventListener('click', () => window.print());
