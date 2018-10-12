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
var Effect = {
  chrome: {
    NAME: 'chrome',
    PROPERTY: 'grayscale',
    MIN: 0,
    MAX: 1,
    UNIT: ''
  },
  sepia: {
    NAME: 'sepia',
    PROPERTY: 'sepia',
    MIN: 0,
    MAX: 1,
    UNIT: ''
  },
  marvin: {
    NAME: 'marvin',
    PROPERTY: 'invert',
    MIN: 1,
    MAX: 100,
    UNIT: '%'
  },
  phobos: {
    NAME: 'phobos',
    PROPERTY: 'blur',
    MIN: 0,
    MAX: 3,
    unit: 'px'
  },
  heat: {
    NAME: 'heat',
    PROPERTY: 'brightness',
    MIN: 1,
    MAX: 3,
    UNIT: ''
  }
};

var effectValue = {
  MAX: 100,
  DEFAULT: 100,
};

var DEFAULT_EFFECT = 'none';
var DEFAULT_EFFECT_CLASS = 100;

var PinValue = {
  MIN: 0,
  MAX: 100
};

var HASH_TAGS_MAX_LENGTH = 20;
var HASH_TAGS_MAX_COUNT = 5;

var Error = {
  NO_SHARP: 'Хэш-тег должен начинается с символа # (решётка)',
  EMPTY: 'Вы ввели пустой хэш-тег',
  ONE_SHARP: 'хэш-тег не может состоять только из одной решётки',
  SPACES: 'хэш-теги разделяются пробелами',
  DUBLICATE: 'хэш-теги не должны повторяться',
  MORE_FIVE: 'нельзя указать больше пяти хэштегов',
  LESS_TWENTY: 'максимальная длина одного хэш-тега 20 символов, включая решётку'
};
