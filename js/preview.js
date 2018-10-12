'use strict';

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
