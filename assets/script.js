let cityList = JSON.parse(localStorage.getItem("cities"));


const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search");
const searchHistContainer = document.querySelector(".reverse-container");
//const histButton = document.querySelectorAll(".hist-btn");
const todaysForecastContainer = document.querySelector("#todays-forecast");
const futureForeCastContainer = document.querySelector("#ahead-forecast");


//API Key
const weatherApiKey = "cb99c2d46a5951373626c3a6c3bae944";

function renderHistoryButtons() {
    //console.log(cityList.length);
    //console.log(cityList[0].cityName);
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
            createTodaysCityCard(cityInfo);
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
    newBtn.classList.add("btn", "hist-btn");
    newBtn.textContent = cityInfo.name;
    searchHistContainer.appendChild(newBtn);
}

function createTodaysCityCard(cityInfo) {
    todaysForecastContainer.innerHTML = "";
    //const todaysForecastContainer = document.querySelector("#todays-forecast"); <- Append here
    //console.log(cityInfo);
    const name = cityInfo.name;
    const date = new Date(cityInfo.dt * 1000).toDateString();
    
    const weatherIcon = cityInfo.weather[0].icon;
    const temperature = Math.round((((cityInfo.main.temp - 273.15) * 1.8) + 32) * 10) / 10;
    const wind = Math.round((cityInfo.wind.speed * 2.23694) * 10) / 10;
    const humidity = cityInfo.main.humidity;
    

    const newCard = document.createElement("div");
    newCard.classList.add("card-header");
    newCard.innerHTML = 
                        `<h2 class="city">${name}</h2>` + `&nbsp;` +
                        `<p class="today-date">(${date})</p>` + `  ` +
                        `<img class="icon" src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" style="margin-top: -25px;">`;

    todaysForecastContainer.appendChild(newCard);

    const newCardPt2 = document.createElement("div");
    newCardPt2.classList.add("card-body");
    newCardPt2.innerHTML = 
                            `<p class="temp">Temp:&nbsp;${temperature}°F</p>` +
                            `<p class="wind">Wind:&nbsp;${wind} MPH</p>` +
                            `<p class="humidity">Humidity:&nbsp;${humidity}%</p>`;
    todaysForecastContainer.appendChild(newCardPt2);

        
};


document.addEventListener("DOMContentLoaded", function () {
    //get city list or create a new list
    cityList = cityList || [];

    // Render the history
    renderHistoryButtons();

    //Clicking on search
    searchFormEl.addEventListener('submit', formSubmitHandler);

    //Clicking on "clear history"

    //Clicking on a history button
    //histButton.addEventListener("click", function(event) {event.this;});
});