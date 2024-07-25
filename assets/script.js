let cityList = JSON.parse(localStorage.getItem("cities"));


const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search");
const searchHistContainer = document.querySelector(".reverse-container");
const todayForecastContainer = document.querySelector("#todays-forecast");
const futureForeCastContainer = document.querySelector("#ahead-forecast");


//API Key
const weatherApiKey = "cb99c2d46a5951373626c3a6c3bae944";

function renderHistoryButtons() {
    console.log(cityList.length);
    console.log(cityList[0].cityName);
    for (let i = 0; i < cityList.length; i++) {
        let newBtn = document.createElement("button");
        newBtn.classList.add("hist-btn", "btn");
        newBtn.textContent = cityList[i].cityName;
        searchHistContainer.appendChild(newBtn);
    }
    
}

const formSubmitHandler = function (event) {
    event.preventDefault(); // stop page from refreshing after submitting search;

    //store the current value of the input (city) inside a variable
    const cityName = searchInputEl.value.trim();
    //console.log(cityName);

    if (cityName) {
        getCitydata(cityName);
        searchFormEl.reset();
    } else {
        alert("Enter a City!");
    }
}

function getCitydata(cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}`;
    fetch(queryURL)
        .then(function (response) {
            if(response.ok) {
                return response.json();
            } else {
                alert(`Error:${response.statusText}`);
            }
        })
        .then(function (cityInfo) {
            
            //Create History button - createHistButton(cityInfo)
            createHistoryButton(cityInfo);
            //Create Todays City Card - createTodaysCard(cityInfo)
            
            //Create 5 day forcast - createForecast idrk how this one works yet
        })
        .catch(function (error) {
            alert("Unable to connect to WeatherAPI!")
        });
}

function createHistoryButton(cityInfo) {
    
    const city = {cityName: cityInfo.name};
    cityList.push(city);
    localStorage.setItem("cities", JSON.stringify(cityList));


    let newBtn = document.createElement("button");
    newBtn.classList.add("hist-btn", "btn");
    newBtn.textContent = cityInfo.name;
    searchHistContainer.appendChild(newBtn);
    //default temp = Math.round( (((cityInfo.main.temp - 273.15) * 1.8) + 32) * 100) / 100
    // console.log(Math.round((((cityInfo.main.temp - 273.15) * 1.8) + 32) * 10) / 10);
    // console.log(cityInfo.name);
    // console.log(cityInfo.name);
}


document.addEventListener("DOMContentLoaded", function () {
    //get city list or create a new list
    cityList = cityList || [];

    // Render the history
    renderHistoryButtons();

    //Clicking on search
    searchFormEl.addEventListener('submit', formSubmitHandler);

    //Clicking on "clear history"

    //Clicking on a history button

});