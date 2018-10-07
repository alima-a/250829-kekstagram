'use strict';

var PHOTOS_QUANTITY = 25;
var AVATAR_VARIANTS = 6;
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
var Like = {
  MIN: 15,
  MAX: 200
};
var Scale = {
  STEP: 25,
  MIN: 25,
  MAX: 100,
  DEFAULT: 100
};
var KeyCode = {
  ESC: 27,
  ENTER: 13
};

// Найдем элементы
var picturesSection = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
var bigPicture = document.querySelector('.big-picture');
var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

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
var generatePhotos = function (amount) {
  for (var i = 0; i < amount; i++) {
    photos[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNum(Like.MIN, Like.MAX),
      comments: generateComments(),
      description: getRandomElement(DESCRIPTIONS)
    };
  }
};

// Получаем массив описаний
generatePhotos(PHOTOS_QUANTITY);

// DOM-элемент заполняем данными из массива
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

// Функция для отображения комментария
var appendComments = function (comments) {
  var socialComments = document.querySelector('.social__comments');
  var socialCommentsTemplate = socialComments.querySelector('.social__comment').cloneNode(true);
  socialComments.innerHTML = '';

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < comments.length; i++) {
    var comment = socialCommentsTemplate.cloneNode(true);
    comment.querySelector('.social__picture').src = 'img/avatar-' + getRandomNum(1, AVATAR_VARIANTS) + '.svg';
    comment.querySelector('.social__text').textContent = comments[i];
    fragment.appendChild(comment);
  }
  socialComments.appendChild(fragment);
};

// DOM-элемент заполняем данными из массива
var renderBigPicture = function (photo) {
  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  appendComments(photo.comments);
};

// Прячем блоки
var socialCommentCount = document.querySelector('.social__comment-count');
socialCommentCount.classList.add('visually-hidden');
var commentsLoader = document.querySelector('.comments-loader');
commentsLoader.classList.add('visually-hidden');

// ОТКРЫТИЕ И ЗАКРЫТИЕ БОЛЬШОГО ФОТО

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

// ЗАГРУЗКА ИЗОБРАЖЕНИЯ И ПОКАЗ ФОРМЫ РЕДАКТИРОВАНИЯ
// Поле редактирования изображения
var uploadOverlay = document.querySelector('.img-upload__overlay');
var fileUploadControl = document.querySelector('#upload-file');
// Кнопка закрытия окна редактирования изображения
var uploadCancel = document.querySelector('.img-upload__cancel');
var uploadImgPreview = document.querySelector('.img-upload__preview');

// Функция закрытия формы загрузки изображения по нажатию на esc
var onUploadEscPress = function (evt) {
  if (evt.keyCode === KeyCode.ESC) {
    evt.preventDefault();
    closeImgUpload();
  }
};

// Функция, закрывающая форму
var closeImgUpload = function () {
  uploadOverlay.classList.add('hidden');
  uploadCancel.removeEventListener('click', closeImgUpload);
  uploadOverlay.removeEventListener('keydown', onUploadEscPress);
  fileUploadControl.addEventListener('change', openImgUploadOverlay);
};

// Функция открытия формы
var openImgUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  uploadCancel.addEventListener('click', closeImgUpload);
  uploadOverlay.addEventListener('keydown', onUploadEscPress);
  fileUploadControl.removeEventListener('change', openImgUploadOverlay);
  effectScale.classList.add('visually-hidden');
  uploadCancel.focus();
};

// Открытие формы изображения по изменению #upload__file
fileUploadControl.addEventListener('change', openImgUploadOverlay);

// РЕДАКТИРОВАНИЕ РАЗМЕРА ИЗОБРАЖЕНИЯ
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');

// Добавляем значение масштаба
var setScale = function (value) {
  var currentValue = +scaleControlValue.value.slice(0, -1);
  var newValue = currentValue + value * Scale.STEP;
  if (newValue <= Scale.MAX && newValue >= Scale.MIN) {
    scaleControlValue.value = newValue + '%';
    uploadImgPreview.style.transform = 'scale(' + newValue / 100 + ')';
  }
};

// Обработчик для уменьшения масштаба
scaleControlSmaller.addEventListener('click', function () {
  setScale(-1);
});

// Обработчик увеличения масштаба
scaleControlBigger.addEventListener('click', function () {
  setScale(1);
});

// НАЛОЖЕНИЕ ЭФФЕКТА ИЗОБРАЖЕНИЯ
// var Effects = [
//  {
//    name: 'chrome',
//    value: 'grayscale',
//    min: 0,
//    max: 1,
//    unit: ''
//  },
//  {
//    name: 'sepia',
//    value: 'sepia',
//    min: 0,
//    max: 1,
//    unit: ''
//  },
//  {
//    name: 'marvin',
//    value: 'invert',
//    min: 1,
//    max: 100,
//    unit: '%'
//  },
//  {
//    name: 'phobos',
//    value: 'blur',
//    min: 0,
//    max: 3,
//    unit: 'px'
//  },
//  {
//    name: 'heat',
//    value: 'brightness',
//    min: 1,
//    max: 3,
//    unit: ''
//  }
// ];

var effectScale = uploadOverlay.querySelector('.effect-level');
var effectList = uploadOverlay.querySelector('.effects__list');
var effectValue = effectScale.querySelector('.effect-level__value');
var effectLine = effectScale.querySelector('.effect-level__line');
var effectPin = effectScale.querySelector('.effect-level__pin');
var effectDepth = effectScale.querySelector('.effect-level__depth');
var currentEffect = 'effects__preview--' + effectList.querySelector('.effects__radio:checked').value;

var DEFAULT_EFFECT_VALUE = 100;

// Функция сброса эффектов с картинки и возвращения пина слайдеров в позицию 100%
var resetEffects = function () {
  effectScale.classList.remove('visually-hidden');
  uploadImgPreview.style = '';
  effectPin.style.left = effectLine.offsetWidth + 'px';
  effectDepth.style.width = DEFAULT_EFFECT_VALUE + '%';
  effectValue.value = DEFAULT_EFFECT_VALUE;
};

uploadImgPreview.classList.add(currentEffect);

// Функция, которая определяет, какой эффект выбран:
var onImageEffectClick = function (evt) {
  var target = evt.target;
  if (target.tagName !== 'INPUT') {
    return;
  }

  uploadImgPreview.classList.remove(currentEffect);
  var effectName = target.value;

  currentEffect = 'effects__preview--' + effectName;

  if (currentEffect !== 'effects__preview--none') {
    effectScale.classList.remove('hidden');
    uploadImgPreview.classList.add(currentEffect);
  } else {
    effectScale.classList.add('hidden');
    uploadImgPreview.classList.add(currentEffect);
  }

  resetEffects();
};

// Обработчик нажатия эффект
effectList.addEventListener('click', onImageEffectClick);

// Функция вычисляющая пропорцию глубины эффекта, переводя пиксели в проценты
// var getProportion = function (currentValue, minValue, maxValue) {
//  return Math.round(currentValue * 100 / maxValue);
// };

// Функция возвращающая пропорцию интенсивности эффекта в зависимости от установленной величины
// var getEffectProportion = function (levelValue, minValue, maxValue) {
//  return (levelValue * maxValue / 100) + minValue;
// };

// Функция возвращающая значение фильтра
// var getFilterValue = function (mapName, effectValue) {
//  var filterValue = '';
//  switch (mapName) {
//    case 'effects__preview--chrome':
//      filterValue = Effects[0].value + '(' + getEffectProportion(effectValue, Effects[0].min, Effects[0].max) + ')';
//      break;
//    case 'effects__preview--sepia':
//      filterValue = Effects[1].value + '(' + getEffectProportion(effectValue, Effects[1].min, Effects[1].max) + ')';
//      break;
//    case 'effects__preview--marvin':
//      filterValue = Effects[2].value + '(' + getEffectProportion(effectValue, Effects[2].min, Effects[2].max) + Effects[2].unit + ')';
//      break;
//    case 'effects__preview--phobos':
//      filterValue = Effects[3].value + '(' + getEffectProportion(effectValue, Effects[3].min, Effects[3].max) + Effects[3].unit + ')';
//      break;
//    case 'effects__preview--heat':
//      filterValue = Effects[4].value + '(' + getEffectProportion(effectValue, Effects[4].min, Effects[4].max) + Effects[4].unit + ')';
//      break;
//    default:
//      break;
//  }

//  return filterValue;
// };

// ВАЛИДАЦИЯ ХЭШ-ТЭГОВ

var HASH_TAGS_MAX_LENGTH = 20;
var HASH_TAGS_MAX_COUNT = 5;

var imgUploadForm = document.querySelector('.img-upload__form');
var imgUploadSubmit = imgUploadForm.querySelector('.img-upload__submit');
var textHashtags = imgUploadForm.querySelector('.text__hashtags');
// var textDescription = imgUploadForm.querySelector('.text__description');

var Error = {
  NO_SHARP: 'Хэш-тег должен начинается с символа # (решётка)',
  EMPTY: 'Вы ввели пустой хэш-тег',
  ONE_SHARP: 'хэш-тег не может состоять только из одной решётки',
  SPACES: 'хэш-теги разделяются пробелами',
  DUBLICATE: 'хэш-теги не должны повторяться',
  MORE_FIVE: 'нельзя указать больше пяти хэштегов',
  LESS_TWENTY: 'максимальная длина одного хэш-тега 20 символов, включая решётку'
};


// Функция, проверяющая, что один хэш-тег не используется дважды
var isHashTagNotDuplicate = function (array, index) {
  for (var i = 0; i < array.length; i++) {
    if (array[index] === array[i] && index !== i) {
      return true;
    }
  }
  return false;
};

// Функция валидации
var validateHashtags = function (hashtags) {
  hashtags = textHashtags.value.trim();
  hashtags = hashtags.toLowerCase();
  hashtags = hashtags.split(' ');

  var errorText = '';
  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags[i][0] !== '#') {
      errorText += Error.NO_SHARP;
    }
    if (hashtags[i].charAt(0) === '#' && hashtags[i].length === 1) {
      errorText += Error.EMPTY;
    }
    if ((hashtags[i].match(/#/g) || []).length > 1) {
      errorText += Error.SPACES;
    }
    if (hashtags[i].length > HASH_TAGS_MAX_LENGTH) {
      errorText += Error.LESS_TWENTY;
    }
    if (hashtags.length > HASH_TAGS_MAX_COUNT) {
      errorText += Error.MORE_FIVE;
    }
    if (isHashTagNotDuplicate(hashtags, i)) {
      errorText += Error.DUBLICATE;
    }
  }
  textHashtags.setCustomValidity(errorText);
};

// Валидация по клику на imgUploadSubmit
imgUploadSubmit.addEventListener('click', validateHashtags);

// если фокус находится в поле ввода хэш-тега,
// нажатие на Esc не должно приводить к закрытию
// формы редактирования изображения
textHashtags.addEventListener('focisin', function () {
  uploadOverlay.removeEventListener('keydown', onUploadEscPress);
});

textHashtags.addEventListener('focusout', function () {
  uploadOverlay.addEventListener('keydown', onUploadEscPress);
});
