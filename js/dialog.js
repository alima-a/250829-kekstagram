'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// Чет пока не могу догадаться, как сделать, чтобы по нажатию на все элементы picture это работало
// Сначала находим элементы
var bigPicture = document.querySelector('.big-picture');
var pictureOpen = document.querySelector('.picture'); // Я пробовала тут querySelectorAll, но чет не заработало.
var pictureClose = bigPicture.querySelector('.big-picture__cancel');

// Открытие и закрытие оверлея
// Обработчик закрытия оверлея нажатем esc
var onOverlayEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeOverlay();
  }
};

// Функция открытия оверлея
var openOverlay = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onOverlayEscPress);
};

// Функция закрытия оверлея
var closeOverlay = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onOverlayEscPress);
};

// Открытие оверлея по клику
pictureOpen.addEventListener('click', function () {
  openOverlay();
});

// Открытие по Enter
pictureOpen.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openOverlay();
  }
});

// Закрытие по клику
pictureClose.addEventListener('click', function () {
  closeOverlay();
});

// Закрытие по esc
pictureClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeOverlay();
  }
});

// Загрузка изображения и показ формы редактирования
var uplodeLabel = document.querySelector('.img-upload__label');
var imgUploadStart = document.querySelector('.img-upload__start');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadFile = document.getElementById('#upload__file');

// Открытие формы редактирования изображения
var openImgUploadOverlay = function () {
  imgUploadOverlay.classList.remove('hidden');
};

// Открытие формы изображения по изменению #upload__file
uploadFile.addEventListener('change', function () {
  openImgUploadOverlay();
});
// Я тут ваще в правильном направлении или или ниоч? :'(
