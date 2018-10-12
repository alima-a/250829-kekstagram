'use strict';

// DOM-элемент заполняем данными из массива (генерируем маленькое фото)
var renderPhoto = function (photo, index) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.id = index;
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

// Отрисуем сгенерированные DOM-элементы в блок
var appendPhotos = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i], i));
  }
  picturesSection.appendChild(fragment);
};

appendPhotos(photos);
