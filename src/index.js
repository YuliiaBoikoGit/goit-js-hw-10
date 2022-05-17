import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';
import getRefs from './js/refs.js';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;

refs.searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    const countryName = event.target.value.trim();

    if (countryName === '') {
        resetCountryList();
        return;
    };

    fetchCountries(countryName)
        .then(renderCountryList)
        .catch(onFetchError);
};

function renderCountryList(countries) {
    if (countries.length > 10) {
        resetCountryList();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    };

    if (countries.length === 1) {
        resetCountryList();
        refs.countryInfo.insertAdjacentHTML('beforeend', makeCountryInfoMarkup(countries));
    };

    if (countries.length >= 2 && countries.length <= 10) {
        resetCountryList();
        refs.countryList.insertAdjacentHTML('beforeend', makeCountryListMarkup(countries));
    };
};

function onFetchError(error) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
};

function resetCountryList() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
};

function makeCountryListMarkup(countries) {
    const countryListMarkup = countries
        .map(({ name, flags }) => {
            return `<li>
        <img src='${flags.svg}' alt='flag image' width='30' height='20'/>
        ${name}</li>`;
        }).join('');

    return countryListMarkup;
};

function makeCountryInfoMarkup(countries) {
    const countryInfoMarkup = countries.map(({ name, flags, capital, population, languages }) => {
        return `
        <p class='country-title'> <img src='${flags.svg}' alt='flag image' width='40' height='30'/>
        ${name}</p>
        <ul>
          <li class='country-list-info'><span class='country-list-info-title'>Capital:</span> ${capital}</li>
          <li class='country-list-info'><span class='country-list-info-title'>Population:</span> ${population}</li>
          <li class='country-list-info'><span class='country-list-info-title'>Languages:</span> ${languages.map(language => language.name)}</li>
        </ul>
        `}).join('');

    return countryInfoMarkup;
};