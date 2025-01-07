const apiKey = "767241bd8b129d152c89825025409f2f";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

const searchButton = document.getElementById("search-button");
const geolocationButton = document.getElementById("geolocation-button");
const cityInput = document.getElementById("city-input");
const forecastContainer = document.getElementById("forecast-container");

// Fetch current weather for the city
const getWeather = async (city) => {
  const url = `${baseUrl}weather?q=${city}&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  displayCurrentWeather(data);
  getForecast(city);
};

// Fetch forecast for the next 7 days
const getForecast = async (city) => {
  const url = `${baseUrl}forecast?q=${city}&units=metric&cnt=7&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  displayForecast(data);
};

// Display current weather data
const displayCurrentWeather = (data) => {
  const cityName = document.getElementById("city-name");
  const weatherDescription = document.getElementById("weather-description");
  const temperature = document.getElementById("temperature");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const weatherIcon = document.getElementById("weather-icon");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherDescription.textContent = data.weather[0].description;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
};

// Display the 7-day weather forecast
const displayForecast = (data) => {
  forecastContainer.innerHTML = "";
  data.list.forEach((forecast) => {
    const day = new Date(forecast.dt * 1000);
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("forecast-day");

    const date = document.createElement("p");
    date.textContent = day.toLocaleDateString();

    const temp = document.createElement("p");
    temp.textContent = `${forecast.main.temp}°C`;

    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    dayDiv.appendChild(date);
    dayDiv.appendChild(temp);
    dayDiv.appendChild(icon);
    forecastContainer.appendChild(dayDiv);
  });
};

// Get weather for the user's current location
const getLocationWeather = (position) => {
  const { latitude, longitude } = position.coords;
  const url = `${baseUrl}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
      getForecast(data.name);
    });
};

// Handle geolocation button click
const handleGeolocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocationWeather);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

// Event listener for city search
searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

// Event listener for geolocation button
geolocationButton.addEventListener("click", handleGeolocation);
