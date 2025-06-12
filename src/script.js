function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function updateWeatherInfo(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.temperature.humidity}%`;
  document.querySelector(
    "#wind-speed"
  ).innerHTML = `${response.data.wind.speed}km/h`;
  document.querySelector("#temperature").innerHTML = `☀️${Math.round(
    response.data.temperature.current
  )}°C`;

  let time = new Date(response.data.time * 1000);
  document.querySelector("#date-time").innerHTML = formatDate(time);
}

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeatherInfo);
}

function handleSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  searchCity(cityInput.value);
}

let form = document.querySelector("#weather-search-form");
form.addEventListener("submit", handleSearch);

// Default city on load
searchCity("Cape Town");
