const elements = {
  html: document.querySelector('html'),
  contentBegin: document.querySelector('.content-begin'),
  header: document.querySelector('.header'),

  menus: Array.from(document.querySelectorAll('.menu')),
  nav: document.querySelector('nav'),
  navClose: document.querySelector('nav .close'),

  scrollToTop: document.querySelector('.back-top a')
};

const state = {
  isShowingBackground: null,
  isShowingNav: false
};

computeHeaderBackgroundVisibility();


window.addEventListener('scroll', event => {
  computeHeaderBackgroundVisibility();
});

elements.menus.forEach(menu => {
  menu.addEventListener('click', event => {
    event.stopPropagation();
    toggleNav(true);
  });
});

elements.navClose && elements.navClose.addEventListener('click', event => {
  toggleNav(false);
});

elements.scrollToTop && elements.scrollToTop.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo(100, 0);
});

elements.html.addEventListener('click', event => {
  toggleNav(false);
});

elements.nav.addEventListener('click', event => {
  event.stopPropagation();
});


function showBackground() {
  elements.header.classList.add('highlighted');
}

function hideBackground() {
  elements.header.classList.remove('highlighted');
}

function computeHeaderBackgroundVisibility() {
  const computedStyle = window.getComputedStyle(elements.contentBegin);
  const marginTop = Number(computedStyle.marginTop.replace('px', ''));
  const top = elements.contentBegin.getBoundingClientRect().y - marginTop;

  const start = Number(window.getComputedStyle(elements.header).height.replace('px', ''));

  if (top < start) {
    if (state.isShowingBackground === true) return;
    showBackground();
    state.isShowingBackground = true;
  }
  else {
    if (state.isShowingBackground === false) return;
    hideBackground();
    state.isShowingBackground = false;
  }
}

function toggleNav(value) {
  state.isShowingNav = value !== undefined ? value : !state.isShowingNav;
  if (state.isShowingNav) elements.nav.classList.add('visible');
  else elements.nav.classList.remove('visible');
}
