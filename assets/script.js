
const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search");
const todayForecastContainer = document.querySelector("#todays-forecast");
const futureForeCastContainer = document.querySelector("#ahead-forecast");

const formSubmitHandler = function (event) {
    event.preventDefault(); // stop page from refreshing after submitting search;

    //store the current value of the input (city) inside a variable
    const city = searchInputEl.value.trim();

    if (city) {
        getCitydata(city);

    }
}

searchFormEl.addEventListener('submit', formSubmitHandler)
