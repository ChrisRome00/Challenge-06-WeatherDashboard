let cityList = JSON.parse(localStorage.getItem("cities"));


const searchFormEl = document.querySelector("#search-form");
const searchInputEl = document.querySelector("#search");
const deleteHistButton = document.querySelector("#clear-history");
const searchHistContainer = document.querySelector(".reverse-container");
const buttons = document.querySelectorAll(".hist-btn");
const todaysForecastContainer = document.querySelector("#todays-forecast");
const futureForecastContainer = document.querySelector("#ahead-forecast");


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
    //API call, include units query param to imperial
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApiKey}`;
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
            //Acting as both getting data then creating 5 day forecast
            //create5DayForecast(cityInfo.name);
        })
        .catch(function (error) {
            alert("Unable to connect to WeatherAPI!")
        });
}

function getCitydataFromHist(cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherApiKey}`;
    fetch(queryURL)
        .then(function (response) {
            if(response.ok) {
                return response.json();
            } else {
                alert(`Error:${response.statusText}`);
            }
        })
        .then(function (cityInfo) {
            
            // DONT WANT TO CREATE HISTORY BUTTON OR STORE IN LOCAL
            // BUT, we still want to get that days info and forecast
            //Create Todays City Card - createTodaysCard(cityInfo)
            createTodaysCityCard(cityInfo);
            //Create 5 day forcast - createForecast idrk how this one works yet
            //ACting as both getting data then creating 5 day forecast
            //console.log(cityInfo.name); // passes string name of city
            get5DayForecast(cityInfo.name);
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
    newBtn.setAttribute('id', cityInfo.name)
    newBtn.textContent = cityInfo.name;
    searchHistContainer.appendChild(newBtn);
    
    //Once button is created, lets add a event listener attatched to it!
    newBtn.addEventListener('click', () => {
        //console.log(newBtn.textContent);
        todaysForecastContainer.innerHTML = ""; // Clear forecast container
        getCitydataFromHist(cityInfo.name); 
    });

}

function createTodaysCityCard(cityInfo) {
    todaysForecastContainer.innerHTML = "";
    //const todaysForecastContainer = document.querySelector("#todays-forecast"); <- Append here
    //console.log(cityInfo);
    const name = cityInfo.name;
    const date = new Date(cityInfo.dt * 1000).toDateString();
    
    const weatherIcon = cityInfo.weather[0].icon;
    const temperature = cityInfo.main.temp;
    const wind = cityInfo.wind.speed;
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

function get5DayForecast(cityName) {
    //may need to call another api for 5 days
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${weatherApiKey}`;
    fetch(forecastUrl)
        .then(function (response) {
            if(response.ok) {
                return response.json();
            } else {
                alert(`Error:${response.statusText}`);
            }
        })
        .then(function (cityInfo) {
            console.log(cityInfo);

            for(let i = 7; i < 40; i += 8) {
                const card = document.createElement("div");
                card.classList.add("newCard", "card");

                const unixtime = cityInfo.list[i].dt; 
                const date = new Date(unixtime * 1000).toDateString();
                const icon = cityInfo.list[i].weather[0].icon;
                const temp = cityInfo.list[i].main.temp;
                const wind = cityInfo.list[i].wind.speed;
                const humidity = cityInfo.list[i].main.humidity;

                card.innerHTML = 
                               `<p class="date">${date}</p>
                                <img class="icons" src="http://openweathermap.org/img/wn/${icon}.png">
                                <p class="temp">Temp: ${temp}°F</p>
                                <p class="wind">Wind: ${wind}MPH</p>
                                <p class="humidity">Humidity: ${humidity}%</p>`;
                                
                futureForecastContainer.appendChild(card);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to WeatherAPI!")
        });
}


document.addEventListener("DOMContentLoaded", function () {
    //get city list or create a new list
    cityList = cityList || [];
    console.log(cityList.length)

    // Render the history
    renderHistoryButtons();

    //Clicking on search
    searchFormEl.addEventListener('submit', formSubmitHandler);

    //Clicking on "clear history"
    deleteHistButton.addEventListener('click', function () {
        //clear local storage
        localStorage.clear();
        //force reload of page to completely clear local storage
        location.reload();
    })

    // Now if page refreshes, upon reload, our prev created buttons are clickable
    if (cityList.length > 0) {
        let buttons = document.querySelectorAll(".hist-btn");
    
        // Iterate over each button and add an event listener
        buttons.forEach(button => {
            button.addEventListener('click', function () {
                //console.log(this.textContent);
                //take in the text content of the button and pass as a city name
                cityName = this.textContent;
                getCitydataFromHist(cityName);
            });
        });
    }
    

});