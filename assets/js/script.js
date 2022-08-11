
var searchButtonEl = document.querySelector(".btn");
var inputValueEl = document.querySelector("#input-location");
var currentDateEl = document.querySelector(".curr-date-container");
var forecastDateEl = document.querySelector(".forecast-date-container");
var historySearchEl = document.querySelector("#search-history");
var contentHeaderInfoEl = document.querySelector(".headerInfo")

var storeDataEl = [];


var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = inputValueEl.value.trim();
    cityInfo(cityName);
    inputValueEl.value = "";
    currentDateEl.textContent = "";
    forecastDateEl.textContent = "";
    contentHeaderInfoEl.textContent= "";
    currentDateEl.setAttribute("style", "border:none")
}

var quickSearch = function (event) {
    var quickSearchBtn = event.target.textContent
    console.log(quickSearchBtn)
    cityInfo(quickSearchBtn);
    currentDateEl.textContent = "";
    forecastDateEl.textContent = "";
    contentHeaderInfoEl.textContent= "";
    currentDateEl.setAttribute("style", "border:none")
}

var cityInfo = function (city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=9f3f33ce2b83be7d45fd76569bc1fbd2"
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                console.log("response not okay")
                currentDateEl.textContent="API not found. Please troubleshoot."
            }
            return response.json()
        })
        .then(function (data) {
            currentDateEl.textContent=""
            cityConversion(data);
            reverseCityInfo(data[0].lat, data[0].lon);
            historyLocation(city);
            
        })
        .catch(function (error) {
            console.log(error)
            currentDateEl.textContent="Location not found. Try again."

        });
};

var historyLocation = function (city) {
    var location = city.toUpperCase();
    var searchCheck = storeDataEl.findIndex(item => location.trim() === item.trim());
    console.log(searchCheck)
            if (searchCheck ==-1) {
                // historyLocation(cityName);
                storeDataEl.push(location);
                var historyBtnEl = document.createElement("button");
                historyBtnEl.classList = "search-button button mb-1"
                historyBtnEl.textContent = city.toUpperCase()
                historySearchEl.appendChild(historyBtnEl);
                saveLocation();
                    
            } else {
                console.log("nothing needs to be added")
            }
}

var saveLocation = function (city) {
    localStorage.setItem("City", JSON.stringify(storeDataEl));
}

var loadLocation = function () {
    var loadCity = JSON.parse(localStorage.getItem("City"));

    if (loadCity) {
        for (var i = 0; i < loadCity.length; i++) {
            var historyBtnEl = document.createElement("button");
            historyBtnEl.classList = "search-button button mb-1"
            historyBtnEl.textContent = loadCity[i]
            historySearchEl.appendChild(historyBtnEl);
            storeDataEl.push(loadCity[i])
        }
    } else {
        loadCity = ""
    }
}

var cityConversion = function (city) {

    var lat = city[0].lat;
    var lon = city[0].lon;
    getWeatherInfo(lat, lon);


}

var getWeatherInfo = function (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=9f3f33ce2b83be7d45fd76569bc1fbd2"
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                console.log("response not okay")
                currentDateEl.textContent="API not found. Please troubleshoot."
            }
            return response.json()
        })
        .then(function (data) {
            console.log(data);

            displayWeather(data);
            displayForecastWeather(data);
        })  
};
var locationName = "";
var reverseCityInfo = function (lat, lon) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + lon + "&limit=1&appid=9f3f33ce2b83be7d45fd76569bc1fbd2"
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                console.log("response not okay")
                currentDateEl.textContent="API not found. Please troubleshoot."
            }
            return response.json()
        })
        .then(function (data) {
            locationName = "";
            locationName = data[0].name
        })
};



var displayWeather = function (data) {

    currentDateEl.setAttribute("style", "border: 1px solid black")
    var dateContainerEl = document.createElement("h3");
    dateContainerEl.classList = "currDate";
    var iconUrl = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png"
    var currIconEl = document.createElement("img");
    currIconEl.setAttribute("id", "curr-weather-icon");
    currIconEl.setAttribute("src", iconUrl)

    dateContainerEl.textContent = locationName + " (" + moment.unix(data.current.dt).format('MM/DD/YYYY') + ") ";

    contentHeaderInfoEl.appendChild(dateContainerEl)
    contentHeaderInfoEl.appendChild(currIconEl);
    currentDateEl.appendChild(contentHeaderInfoEl);

    var currTempEl = document.createElement("p");
    currTempEl.classList = "currDateInfo";
    currTempEl.textContent = "Temp: " + data.current.temp;
    currentDateEl.appendChild(currTempEl);

    var currWindEl = document.createElement("p");
    currWindEl.classList = "currDateInfo";
    currWindEl.textContent = "Wind: " + data.current.wind_speed + "km/h";
    currentDateEl.appendChild(currWindEl);

    var currHumidityEl = document.createElement("p");
    currHumidityEl.classList = "currDateInfo";
    currHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    currentDateEl.appendChild(currHumidityEl);

    var currUviEl = document.createElement("p");
    currUviEl.classList = "currDateInfo";
    var indexEl = document.createElement("span");
    if (data.current.uvi <= 2) {
        indexEl.classList.add("good");
        indexEl.classList.remove("normal");
        indexEl.classList.remove("bad");
    }     if (data.current.uvi <=5 && data.current.uvi >2){
        indexEl.classList.remove("good");
        indexEl.classList.add("normal");
        indexEl.classList.remove("bad");
    }
    if (data.current.uvi >5) {
        indexEl.classList.remove("good");
        indexEl.classList.remove("normal");
        indexEl.classList.add("bad");
    }
    indexEl.textContent = data.current.uvi
    currUviEl.textContent = "UV Index: "
    currUviEl.appendChild(indexEl);
    currentDateEl.appendChild(currUviEl);

}

displayForecastWeather = function (data) {

    var foretitleEl = document.createElement("h3");
    foretitleEl.classList = "forecast-title column is-full"
    foretitleEl.textContent = "5-Day Forecast:";
    forecastDateEl.appendChild(foretitleEl);
    for (var i = 1; i < 6; i++) {
        var columnContainerEl = document.createElement("div")
        columnContainerEl.classList = "forcontain has-background-primary p-5"
        var dateContainerEl = document.createElement("h3");
        dateContainerEl.classList = "forecastDate";
        var iconUrl = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"
        var currIconEl = document.createElement("img");
        currIconEl.setAttribute("id", "curr-weather-icon");
        currIconEl.setAttribute("src", iconUrl)

        dateContainerEl.textContent = moment.unix(data.daily[i].dt).format('MM/DD/YYYY');

        columnContainerEl.appendChild(dateContainerEl);
        columnContainerEl.appendChild(currIconEl);

        var currTempEl = document.createElement("p");
        currTempEl.classList = "currDateInfo";
        currTempEl.textContent = "Temp: " + data.daily[i].temp.day + "°C";
        columnContainerEl.appendChild(currTempEl);

        var currWindEl = document.createElement("p");
        currWindEl.classList = "currDateInfo";
        currWindEl.textContent = "Wind: " + data.daily[i].wind_speed + "km/h";
        columnContainerEl.appendChild(currWindEl);

        var currHumidityEl = document.createElement("p");
        currHumidityEl.classList = "currDateInfo";
        currHumidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        columnContainerEl.appendChild(currHumidityEl);

        forecastDateEl.appendChild(columnContainerEl);
    }

}


loadLocation();
searchButtonEl.addEventListener("click", formSubmitHandler)
historySearchEl.addEventListener("click", quickSearch)