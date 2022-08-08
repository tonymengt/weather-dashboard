
var searchButtonEl = document.querySelector(".btn");
var inputValueEl = document.querySelector("#input-location")

var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = inputValueEl.value.trim()
    cityInfo(cityName)
    inputValueEl.textContent=""

}

var cityInfo = function (city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=9f3f33ce2b83be7d45fd76569bc1fbd2"
    fetch(apiUrl)
        .then(function(response){
            if (response.ok) {
                response.json().then(function(data){
                    console.log(data);
                    cityConversion(data);
                });
            }
        });
};

var cityConversion = function(city) {
    var lati = city[0].lat;
    var lon = city[0].lon;
    console.log("Toronto:", lati, lon)
    getWeatherInfo(lati, lon)
}

var getWeatherInfo = function (lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=9f3f33ce2b83be7d45fd76569bc1fbd2"
    fetch (apiUrl)
        .then(function(response){
            if (response.ok) {
                return response.json().then(function(data){
                    console.log(data)
                    console.log(moment.unix(data.current.dt).format('MM/DD/YYYY'));
                });
            };
        });
}



searchButtonEl.addEventListener("click", formSubmitHandler )