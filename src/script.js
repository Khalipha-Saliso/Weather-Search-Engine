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

function getDayName(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function updateWeatherInfo(response) {
  let data = response.data;
  let cityName = data.city;
  let description = data.condition.description;
  let humidity = data.temperature.humidity;
  let windSpeed = data.wind.speed;
  let temperature = Math.round(data.temperature.current);
  let icon = data.condition.icon_url;

  document.querySelector("#city").innerHTML = cityName;
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#humidity").innerHTML = `${humidity}%`;
  document.querySelector("#wind-speed").innerHTML = `${windSpeed}km/h`;

  document.querySelector("#temperature").innerHTML = `
    <span class="t-icon"><img src="${icon}" alt="${description}" /></span>
    <span class="t-value">${temperature}&deg;C</span>
  `;

  let time = new Date(data.time * 1000);
  document.querySelector("#date-time").innerHTML = formatDate(time);
}

function displayForecast(response) {
  let forecastData = response.data.daily;
  let today = new Date().getDay();
  let forecastHTML = "";
  let daysShown = 0;

  for (let i = 0; i < forecastData.length && daysShown < 6; i++) {
    let forecastDay = forecastData[i];
    let dayIndex = new Date(forecastDay.time * 1000).getDay();
    if (dayIndex === today) {
      continue;
    }

    let dayName = getDayName(forecastDay.time);
    let icon = forecastDay.condition.icon_url;
    let description = forecastDay.condition.description;
    let max = Math.round(forecastDay.temperature.maximum);
    let min = Math.round(forecastDay.temperature.minimum);

    forecastHTML += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${dayName}</div>
        <div class="weather-forecast-icon">
          <img src="${icon}" alt="${description}" width="48" />
        </div>
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature"><strong>${max}º</strong></div>
          <div class="weather-forecast-temperature">${min}º</div>
        </div>
      </div>
    `;
    daysShown++;
  }

  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function searchCity(city) {
  let apiKey = "b2a5adcct04b33178913oc335f405433";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeatherInfo);
  getForecast(city);
}

function getForecast(city) {
  let apiKey = "64ff0080a418f8of319534c4b15a9b6t";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  searchCity(cityInput.value);
}

document
  .querySelector("#weather-search-form")
  .addEventListener("submit", handleSearch);
searchCity("Ohio");
