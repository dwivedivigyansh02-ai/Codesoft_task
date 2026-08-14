const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navItems.forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }

  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const downloadButtons = document.querySelectorAll('#downloadResumeBtn, #resumeDownloadLink');
downloadButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const resumeContent = `Aarav Dev
Frontend Engineer
Email: hello@aaravdev.com
Phone: +1 234 567 890

Summary
A frontend engineer focused on modern, responsive, and accessible user interfaces.

Skills
HTML, CSS, JavaScript, React, UI/UX, Responsive Design

Projects
- Personal Portfolio Website
- To-Do List Application
- Expense Tracker
- Music Player
- Blog Website`;

    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Aarav-Dev-Resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  });
});

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = contactForm.querySelector('button');
  button.textContent = 'Message Sent';
  button.disabled = true;
  setTimeout(() => {
    contactForm.reset();
    button.textContent = 'Send Message';
    button.disabled = false;
  }, 1800);
});
