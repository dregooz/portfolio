const elements = {
  contentBegin: document.querySelector('.content-begin'),
  header: document.querySelector('.header'),

  menu: document.querySelector('.menu'),
  nav: document.querySelector('nav'),
  navClose: document.querySelector('nav .close'),

  scrollToTop: document.querySelector('.back-top a')
};

const state = {
  isShowingBackground: null,
  isShowingNav: false
};

computeBackground();


window.addEventListener('scroll', event => {
  computeBackground();
});

elements.menu && elements.menu.addEventListener('click', event => {
  toggleNav(true);
});

elements.navClose && elements.navClose.addEventListener('click', event => {
  toggleNav(false);
});

elements.scrollToTop && elements.scrollToTop.addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo(100, 0);
});


function showBackground() {
  elements.header.classList.add('highlighted');
}

function hideBackground() {
  elements.header.classList.remove('highlighted');
}

function computeBackground() {
  const computedStyle = window.getComputedStyle(elements.contentBegin);
  const marginTop = Number(computedStyle.marginTop.replace('px', ''));
  const top = elements.contentBegin.getBoundingClientRect().y - marginTop;

  if (top < 0) {
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
