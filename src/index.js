import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputTextEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputTextEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    cleanListHTML();
    cleanInfoHTML();

    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      console.log(data);

      if (data.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );

        return;
      }

      if (data.length > 1 && data.length < 11) {
        createListHTML(data);
        cleanInfoHTML();

        return;
      }

      if (data.length === 1) {
        createListHTML(data);
        createInfoHTML(data);

        const countryTitleEl = document.querySelector('.country-title');
        countryTitleEl.style.fontSize = '38px';

        return;
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
      cleanListHTML();
      cleanInfoHTML();

      return;
    });
}

function createListHTML(data) {
  countryListEl.innerHTML = createMarkupList(data);
}

function createInfoHTML(data) {
  countryInfoEl.innerHTML = createMarkupInfo(data);
}

function cleanListHTML() {
  countryListEl.innerHTML = '';
}

function cleanInfoHTML() {
  countryInfoEl.innerHTML = '';
}

function createMarkupList(arr) {
  return arr
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="country-item">
          <img class="country-flags" src="${svg}" alt="Flag image ${official}" />
          <h2 class="country-title">${official}</h2>
      </li>`;
    })
    .join('');
}

function createMarkupInfo(arr) {
  return arr
    .map(({ capital, population, languages }) => {
      const languageNames = Object.values(languages).join(', ');

      return `<li class="country-info-item">
          <p class="country-capital"><span class="country-span">Capital:</span> ${capital}</p>
          <p class="country-population"><span class="country-span">Population:</span> ${population}</p>
          <p class="country-languages"><span class="country-span">Languages:</span> ${languageNames}</p>
      </li>`;
    })
    .join('');
}
