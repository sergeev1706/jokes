


let enterBtn = document.querySelector('#enterBtn');
let inp = document.querySelector('input');
let adminBtn = document.querySelector('#admin-btn');
let textarea = document.querySelector('#textarea');

enterBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (inp.value === 'admin') {
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

if (adminBtn) {
  adminBtn.addEventListener('click', () => {
    // textarea.classList.remove('disable');
    // adminBtn.classList.add('disable');

    // обработать запрос post 
    // для добавления анекдота

  })
}

// ---------------- pagination -------------

let pages = document.querySelectorAll('.pagination')

for (const page of pages) {
  page.addEventListener('click', () => {
    // console.log(page.textContent);
    window.location.href = `/list/page/${page.textContent}`
  })
}





