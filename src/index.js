import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputField.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
  const nameSearch = event.target.value.trim();
  if (!nameSearch) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(nameSearch)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (countries.length >= 2) {
        createMarkupCountryList(countries);
        return;
      }
      createMarkupCountryInfo(countries);
      return;
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
}

function createMarkupCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class="country-item">
      <img src="${flags.svg}" alt="flag" width=50 height=50/>
      <p>${name.official}</p>
    </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function createMarkupCountryInfo(countries) {
  const infoMarkup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<img src="${flags.svg}" alt="flag" width="50" height="50" />
  <p>${name.official}</p>
  <p>Capital: ${capital}</p>
  <p>Population: ${population}</p>
  <p>Languages: ${Object.values(languages).join(', ')}</p>`;
    })
    .join('');

  countryInfo.innerHTML = infoMarkup;
  countryList.innerHTML = '';
}
