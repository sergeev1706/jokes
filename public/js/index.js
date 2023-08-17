

let enterBtn = document.querySelector('#enterBtn');
let inp = document.querySelector('input');
let adminBtn = document.querySelector('#admin-btn');
let textarea = document.querySelector('#textarea');

enterBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (inp.value === 'ne_admin') {
    inp.value = '';
    window.location.href = '/admin';
  } else {
    inp.classList.add('danger');
    inp.value = 'не верно';
  }
})

inp.onfocus = () => {
  inp.classList.remove('danger');
  inp.value = '';
};

// ---------------- pagination -------------

let pages = document.querySelectorAll('.pagination');

for (const page of pages) {
  page.addEventListener('click', () => {
    window.location.href = `/list/page/${page.textContent}`;
  })
}





