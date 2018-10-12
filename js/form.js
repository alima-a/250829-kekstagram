'use strict';

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
var effectScale = uploadOverlay.querySelector('.effect-level');
var effectsList = uploadOverlay.querySelector('.effects__list');
var effectLevelValue = effectScale.querySelector('.effect-level__value');
var effectLine = effectScale.querySelector('.effect-level__line');
var effectPin = effectScale.querySelector('.effect-level__pin');
var effectDepth = effectScale.querySelector('.effect-level__depth');
var currentEffectName = effectsList.querySelector('.effects__radio:checked').value;
var currentEffectClass = 'effects__preview--' + currentEffectName;

// Функция сброса эффектов с картинки
var setDefaultEffect = function () {
  effectScale.classList.add('visually-hidden');
  effectsList.querySelector('#effect-' + DEFAULT_EFFECT).checked = true;
  uploadImgPreview.classList.remove(currentEffectClass);
  uploadImgPreview.classList.add(DEFAULT_EFFECT_CLASS);
  uploadImgPreview.style.filter = '';
};

// Функция устанавливает значение пина
var setPinPosition = function (value) {
  effectLevelValue.value = Math.round(value);
  effectPin.style.left = value + '%';
  effectDepth.style.width = effectPin.style.left;
};

// Рассчитываем значение фильтра (вместе с еденицами измерения)
var getFilterValue = function (effect, value) {
  return value * (Effect[effect].MAX - Effect[effect].MIN) / effectValue.MAX + Effect[effect].MIN + Effect[effect].UNIT;
};

// Применяет эффект к фото в зависимости от положения пина
var applyEffect = function (value) {
  setPinPosition(value);
  uploadImgPreview.style.filter = Effect[currentEffectName].PROPERTY + '(' + getFilterValue(currentEffectName, value) + ')';
};

// Функция, которая определяет, какой эффект выбран:
var onImageEffectClick = function (evt) {
  var target = evt.target;
  if (target.tagName !== 'INPUT') {
    return;
  }

  uploadImgPreview.classList.remove(currentEffectClass);
  currentEffectName = target.value;

  currentEffectClass = 'effects__preview--' + currentEffectName;
  uploadImgPreview.classList.add(currentEffectClass);

  if (currentEffectClass === DEFAULT_EFFECT_CLASS) {
    setDefaultEffect();
  } else {
    effectScale.classList.remove('visually-hidden');
    applyEffect(effectValue.DEFAULT);
  }
};

// Обработчик нажатия на эффект
effectsList.addEventListener('click', onImageEffectClick);

// Функция нажатия на пин
var onSliderPinMouseDown = function (downEvt) {
  downEvt.preventDefault();
  var scaleLineRect = effectLine.getBoundingClientRect();
  var startCoord = downEvt.clientX;

  // Изменение координат
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = startCoord - moveEvt.clientX;

    startCoord = moveEvt.clientX;

    var newValue = (effectPin.offsetLeft - shift) / scaleLineRect.width * 100;

    if (newValue > PinValue.MAX) {
      newValue = PinValue.MAX;
    }

    if (newValue < PinValue.MIN) {
      newValue = PinValue.MIN;
    }

    applyEffect(newValue);
  };

  // Отпускание пина
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// Слушаем действия с пином
effectPin.addEventListener('mousedown', onSliderPinMouseDown);

// ВАЛИДАЦИЯ ХЭШ-ТЭГОВ
var imgUploadForm = document.querySelector('.img-upload__form');
var imgUploadSubmit = imgUploadForm.querySelector('.img-upload__submit');
var textHashtags = imgUploadForm.querySelector('.text__hashtags');
var textDescription = imgUploadForm.querySelector('.text__description');

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
    break;
  }
  return false;
};

// Функция валидации
var validateHashtags = function (hashtags) {
  hashtags = textHashtags.value.trim();
  hashtags = hashtags.toLowerCase();
  hashtags = hashtags.split(' ');

  if (hashtags.length === 0) {
    return;
  }

  var errorText = '';
  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags[i][0] !== '#') {
      errorText += Error.NO_SHARP;
      break;
    }
    if (hashtags[i].charAt(0) === '#' && hashtags[i].length === 1) {
      errorText += Error.EMPTY;
      break;
    }
    if ((hashtags[i].match(/#/g) || []).length > 1) {
      errorText += Error.SPACES;
      break;
    }
    if (hashtags[i].length > HASH_TAGS_MAX_LENGTH) {
      errorText += Error.LESS_TWENTY;
      break;
    }
    if (hashtags.length > HASH_TAGS_MAX_COUNT) {
      errorText += Error.MORE_FIVE;
      break;
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
textHashtags.addEventListener('focusin', function () {
  uploadOverlay.removeEventListener('keydown', onUploadEscPress);
});

textHashtags.addEventListener('focusout', function () {
  uploadOverlay.addEventListener('keydown', onUploadEscPress);
});

// Когда поле описания в фокусе - форма по Esc не закрывается
textDescription.addEventListener('focusin', function () {
  uploadOverlay.removeEventListener('keydown', onUploadEscPress);
});

textDescription.addEventListener('focusin', function () {
  uploadOverlay.addEventListener('focusout', onUploadEscPress);
});
