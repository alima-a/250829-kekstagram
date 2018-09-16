'use strict';

var PHOTOS_QUANTITY = 25;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море', 'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
var MIN_LIKES = 15;
var MAX_LIKES = 200;

// Найдем элементы
var pictures = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

// Функция получения рандомного числа от min до max
var getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция получения рандомного элемента
var getRandomElement = function (array) {
  return array[getRandomNum(0, array.length - 1)];
};

// Функция получения рандомного комментария
var generateComment = function () {
  var comment = getRandomElement(COMMENTS);

  if (getRandomNum(0, COMMENTS.length) % 2) {
    comment += ' ' + getRandomElement(COMMENTS);
  }
  return comment;
};

// Получение рандомного массива комментариев
var generateComments = function () {
  var comments = [];

  for (var i = 0; i < getRandomNum(1, 10); i++) {
    comments[i] = generateComment();
  }

  return comments;
};

// Функция получения массива описаний фото
var photos = [];
var generateDescriptions = function (amount) {
  for (var i = 0; i < amount; i++) {
    photos[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNum(MIN_LIKES, MAX_LIKES),
      comments: generateComments(),
      description: getRandomElement(DESCRIPTIONS)
    };
  }
};

// Получаем массив описаний
generateDescriptions(PHOTOS_QUANTITY);

// DOM-элемент заполняем данными из массива
var renderPhoto = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

renderPhoto(photos);

// Отрисуем сгенерированные DOM-элементы в блок
var appendPhotos = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }
  pictures.appendChild(fragment);
};

appendPhotos(photos);

// Делаем видимым блок
var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

// Функция для отображения комментария
var getComments = function (сomments) {
  var fragmentOfComments = document.createDocumentFragment();

  var socialComments = document.querySelector('.social__comments');
  socialComments.innerHTML = '';

  for (var i = 0; i < сomments.length; i++) {
    var li = document.createElement('li');
    li.classList.add('social__comment');

    var img = document.createElement('img');
    img.classList.add('social__picture');
    img.setAttribute('src', 'img/avatar-' + getRandomNum(1, 6) + '.svg');
    img.setAttribute('alt', 'Аватар комментатора фотографии');
    img.setAttribute('width', '35');
    img.setAttribute('height', '35');

    var paragraph = document.createElement('p');
    paragraph.classList.add('social__text');
    paragraph.textContent = сomments[i];

    li.appendChild(img);
    li.appendChild(paragraph);

    fragmentOfComments.appendChild(li);

    socialComments.appendChild(fragmentOfComments);
  }
  return socialComments;
};

// DOM-элемент заполняем данными из массива
var renderBigPicture = function (array) {
  bigPicture.querySelector('.big-picture__img img').src = array.url;
  bigPicture.querySelector('.comments-count').textContent = array.comments.length;
  bigPicture.querySelector('.likes-count').textContent = array.likes;
  bigPicture.querySelector('.social__caption').textContent = array.description;
  getComments(array.comments);

  return bigPicture;
};

// Отрисовываем
renderBigPicture(photos[0]);

// Прячем блоки
var socialСommentСount = document.querySelector('.social__comment-count');
socialСommentСount.classList.add('visually-hidden');
var commentsloader = document.querySelector('.comments-loader');
commentsloader.classList.add('visually-hidden');
