// Подключение модулей
import './styles.css';
const debounce = require('lodash.debounce');
import { alert, error, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';
defaultModules.set(PNotifyMobile, {});
import itemsCountry from './country.hbs';
import itemsMenu from './menu.hbs';

// Сcылки на элементы DOM
const refs = {
  inputText: document.querySelector('.js-input'),
  listCountres: document.querySelector('.js-menu'),
  cardContainer: document.querySelector('.js-country'),
};

// Обработчик события input на элементе input с использованием функции debounce
refs.inputText.addEventListener(
  'input',
  debounce(() => onInputChange(refs.inputText.value), 500),
);
// Функция обработки события input
function onInputChange(value) {
  refs.listCountres.innerHTML = '';
  if (value) {
    fetch(`https://restcountries.eu/rest/v2/name/${value}`)
      .then(responce => {
        return responce.json();
      })
      .then(country => {
        if (country.length === 1) {
          const markup = itemsCountry(country[0]);
          refs.cardContainer.innerHTML = markup;
        } else if (country.length > 1 && country.length <= 10) {
          const markup = itemsMenu(country);
          refs.listCountres.innerHTML = markup;
        } else if (country.length > 10) {
          error({
            text: `Кол-во результатов поиска по строке "${value}" больше 10! Уточните параметры поиска`,
          });
        } else if (country.length === undefined) {
          alert({
            text: `"${value}" - Такой страны нет!`,
          });
        }
        console.log(country.length);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

// Обработчик события click на элементе меню
refs.listCountres.addEventListener('click', ulClickTarget);
// Функция обработки события click
function ulClickTarget(event) {
  event.preventDefault();
  refs.inputText.value = event.target.textContent;
  onInputChange(refs.inputText.value);
}
