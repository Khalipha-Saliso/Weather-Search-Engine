function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = dayNames[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function updateWeatherInfo(response) {
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind-speed");
  let tempElement = document.querySelector("#temperature");
  let dateTimeElement = document.querySelector("#date-time");

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${Math.round(response.data.wind.speed)}km/h`;
  tempElement.innerHTML = `☀️${Math.round(
    response.data.temperature.current
  )}°C`;

  let time = new Date(response.data.time * 1000);
  dateTimeElement.innerHTML = formatDate(time);

  getForecast(response.data.coordinates);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  let today = new Date(response.data.daily[0].time * 1000).getDay();

  let forecastDays = [];

  for (let i = 1; i <= 6; i++) {
    let dayIndex = (today + i) % 7;
    forecastDays.push(response.data.daily[i]);
  }

  forecastDays.forEach(function (day) {
    forecastHTML += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>
        <div class="weather-forecast-icon">
          <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" width="48"/>
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature"><strong>${Math.round(
            day.temperature.maximum
          )}º</strong></div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}º</div>
        </div>
      </div>
    `;
  });

  forecastElement.innerHTML = forecastHTML;
}

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeatherInfo);
}

function getForecast(coordinates) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  searchCity(cityInput.value);
}

searchCity("Ohio");

let form = document.querySelector("#weather-search-form");
form.addEventListener("submit", handleSearch);
