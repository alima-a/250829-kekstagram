'use strict';

var DESCRIPTIONS_SUM = 25;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var DESCRIPTIONS = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
var PHOTOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
var MIN_LIKES_NUM = 15;
var MAX_LIKES_NUM = 200;

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

// Функция перебора массива c фото
var getRandomPhoto = function (array) {
  for (var i = 0; i < array.length; i++) {
    var photoNum = array[i];
  }
  return photoNum;
};

// Функция получения массива описаний фото
var photosDescriptions = [];
var generateDescriptions = function (amount) {
  for (var i = 0; i < amount; i++) {
    photosDescriptions[i] = {
      url: 'photos/' + getRandomPhoto(PHOTOS) + '.jpg',
      likes: getRandomNum(MIN_LIKES_NUM, MAX_LIKES_NUM),
      comments: getRandomElement(COMMENTS),
      description: getRandomElement(DESCRIPTIONS)
    };
  }
};

// Получаем массив описаний
generateDescriptions(DESCRIPTIONS_SUM);

// DOM-элемент заполняем данными из массива
var renderDescription = function (description) {
  var descriptionsElement = pictureTemplate.cloneNode(true);

  descriptionsElement.querySelector('.picture__img').src = description.url;
  descriptionsElement.querySelector('.picture__likes').textContent = description.likes;
  descriptionsElement.querySelector('.picture__stat--comments').textContent = description.comments.length;

  return descriptionsElement;
};

renderDescription(photosDescriptions);

// Отрисуем сгенерированные DOM-элементы в блок
var renderDescriptions = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photosDescriptions.length; i++) {
    fragment.appendChild(renderDescriptions(photosDescriptions[i]));
  }
  pictures.appendChild(fragment);
};

renderDescriptions(photosDescriptions);

// Делаем видимым блок
var bigPicture = document.querySelector('.big-picture');
bigPicture.remove('hidden');

// DOM-элемент заполняем данными из массива
var renderBigPicture = function (photo) {
  bigPicture.querySelector('.big-picture__img img').src = description.url;
  bigPicture.querySelector('.comments-count').textContent = description.comments.length;
  bigPicture.querySelector('.likes-count').textContent = description.likes;
  bigPicture.querySelector('.social__caption').textContent = description.description;

  return bigPicture;
};
