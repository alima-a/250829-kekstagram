'use strict';

// Функция закрытия большого фото
var hideBigPhoto = function () {
  bigPicture.classList.add('hidden');
  bigPicture.removeEventListener('keydown', onBigPhotoEscPress);
  bigPictureClose.removeEventListener('click', hideBigPhoto);
};

// Функция закрытия большого фото нажатием esc
var onBigPhotoEscPress = function (evt) {
  if (evt.keyCode === KeyCode.ESC) {
    evt.preventDefault();
    hideBigPhoto();
  }
};

// Функция открытия большого фото
var showBigPhoto = function (photo) {
  renderBigPicture(photo);
  bigPicture.classList.remove('hidden');
  bigPictureClose.addEventListener('click', hideBigPhoto);
  bigPicture.addEventListener('keydown', onBigPhotoEscPress);
  bigPictureClose.focus();
};

// Функция, вызывающая большое изображение по клику на маленькое
var onPhotoClick = function (evt) {
  var target = evt.target;
  if (target.className === 'picture__img') {
    target = target.parentNode;
  }
  if (target.className === 'picture') {
    evt.preventDefault();
    showBigPhoto(photos[target.id]);
  }
};

picturesSection.addEventListener('click', onPhotoClick);
