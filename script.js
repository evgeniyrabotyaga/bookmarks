const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnSave = document.querySelector('.btn-save');
const btnClose = document.querySelector('.btn-close');
const btnAdd = document.querySelector('.show-modal');
const websiteName = document.getElementById('name');
const websiteUrl = document.getElementById('url');
const bookmarkForm = document.querySelector('.bookmark-form');

let bookmarks = [];

const toggleModal = function () {
  overlay.classList.toggle('hidden');
  modal.classList.toggle('hidden');
  bookmarkForm.reset();
  websiteName.focus();
};

const fetchBookmarks = function () {
  if (localStorage.getItem('bookmarks'))
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  buildBookmarks();
};

const buildBookmarks = function () {
  document.querySelector('.container').textContent = '';
  bookmarks.forEach(b => {
    const { name, url } = b;
    const markup = `
    <div class="item">
      <div class="name">
        <img src="https://s2.googleusercontent.com/s2/favicons?domain=${url}" alt="Favicon" />
        <a href="${url}" target="_blank">${name}</a>
      </div>
      <button class="close delete" onclick="deleteBookmark('${url}')" title="Delete Bookmark">×</button>
    </div>
    `;
    document
      .querySelector('.container')
      .insertAdjacentHTML('beforeend', markup);
  });
};

const deleteBookmark = function (url) {
  bookmarks.forEach((b, i) => {
    if (b.url === url) bookmarks.splice(i, 1);
  });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
};

const storeBookmark = function (e) {
  const nameValue = websiteName.value;
  let urlValue = websiteUrl.value;
  if (!urlValue.includes('http://', 'https://')) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) return false;
  const bookmark = {
    name: nameValue.charAt(0).toUpperCase() + nameValue.slice(1),
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  bookmarkForm.reset();
  websiteName.focus();
};

const validate = function (nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regexp = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  }
  if (!urlValue.match(regexp)) {
    alert('Please provide a valid web address');
    return false;
  }
  return true;
};

fetchBookmarks();
btnAdd.addEventListener('click', toggleModal);
btnClose.addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);
bookmarkForm.addEventListener('submit', storeBookmark);
