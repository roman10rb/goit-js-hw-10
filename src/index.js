import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const DEBOUNCE_DELAY = 300;

const refs = {
    searchCountry: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};
refs.searchCountry.addEventListener('input', debounce(handleInputSearch, DEBOUNCE_DELAY));

const renderItemsOfCountry = (flags, name) => {
    return `<li class="item">
            <div class="container">
                <img class="img-small" src=${flags.svg} alt="flag" />
            </div>
            <span class="text-small">${name.official}</span>
          </li>`;
};

const renderCountry = (flags, name, capital, population, languages) => {
    return `
        <div class="container">
            <img class="img-big" src=${flags.svg} alt="flag" />
        </div>
        <span class="country-name">${name.official}</span>
        <p class="big-text"><span class="text-big">Population:</span> ${population}</p>
        <p class="big-text"><span class="text-big">Capital:</span> ${capital}</p>
        <p class="big-text"><span class="text-big">Languages:</span> ${Object.values(languages)}</p>
      `;
};

const resetInfo = () => {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    
};

const getItemsForRender = countries => {
  const items = countries
    .map(({ flags, name }) => renderItemsOfCountry(flags, name))
    .join('');
  refs.countryList.insertAdjacentHTML('afterbegin', items);
};

const getCountryForRender = countries => {
  const countryItem = countries
    .map(({ flags, name, capital, population, languages }) =>
      renderCountry(flags, name, capital, population, languages)
    )
    .join('');
  refs.countryInfo.insertAdjacentHTML('afterbegin', countryItem);
};

function handleInputSearch(e) {
   const inputValue = e.target.value.trim();
    resetInfo();
    if (inputValue === '') return;
    fetchCountries(inputValue)
        .then(countries => {
            if (countries.length === 1) {
                getCountryForRender(countries);
            } else if (countries.length > 1 && countries.length <= 10) {
                getItemsForRender(countries);
            } else if (countries.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.');
            };
        }).catch((error) => { Notify.failure('Oops, there is no country with that name') });
    };


