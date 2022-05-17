const BASE_URL = 'https://restcountries.com/v2';
const searchParams = 'fields=name,capital,population,flags,languages'

function fetchCountries(name) {
    return fetch(`${BASE_URL}/name/${name}?${searchParams}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
};

export { fetchCountries };