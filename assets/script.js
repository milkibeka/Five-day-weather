const apiKey = '23135be0017efae611741be8622491e2'

function displayCurrentLocation() {
  // Use Geolocation API to get the current location coordinates
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;

    const reverseGeoCodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

    fetch(reverseGeoCodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const city = data[0].name;
          searchInput.value = city;
          getWeatherForecast(latitude, longitude);
        } else {
          console.log('No location found.');
          getWeatherForecastDefault();

        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, error => {
    console.error('Error getting current location:', error);
    getWeatherForecastDefault();
  });
}
// Function to get the weather forecast for the default location
function getWeatherForecastDefault() {
  const defaultCity = 'Birmingham'; 
  const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${defaultCity}&appid=${apiKey}`;

  fetch(geoCodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const city = data[0].name;
        searchInput.value = city;
        getWeatherForecast(lat, lon);
      } else {
        console.log('No location found for the default city.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
window.addEventListener('load', displayCurrentLocation() );

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const cityNameElement = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const weatherIconElement = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const forecastSection = document.getElementById('forecast-section');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  
  const city = searchInput.value;
 
  const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&appid=${apiKey}`;

  fetch(geoCodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        getWeatherForecast(lat, lon);
        addCityToLocalStorage(city);
        displayRecentlySearchedCities();
      } else {
        console.log('No location found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
function addCityToLocalStorage(city) {
  // Retrieve existing cities from local storage
  let cities = localStorage.getItem('recentlySearchedCities');
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }

  // Add the new city to the array
  cities.push(city);

  // Store the updated array in local storage
  localStorage.setItem('recentlySearchedCities', JSON.stringify(cities));
}

function displayRecentlySearchedCities() {
  // Retrieve recently searched cities from local storage
  let cities = localStorage.getItem('recentlySearchedCities');
  if (cities) {
    cities = JSON.parse(cities);

    // Clear the history element
    historyElement.innerHTML = '';

    // Display each city in the history element
    cities.forEach(city => {
      const listItem = document.createElement('a');
      listItem.classList.add('list-group-item');
      listItem.innerText = city;
      listItem.addEventListener('click', () => {
        getWeatherForecastByCity(city);
      });
      historyElement.appendChild(listItem);
    });
  }
}
function getWeatherForecastByCity(city) {
  searchInput.value = city;
  const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&appid=${apiKey}`;

  fetch(geoCodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        getWeatherForecast(lat, lon);
        
      } else {
        console.log('No location found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
const historyElement = document.getElementById('history');

// Call the displayRecentlySearchedCities function on page load
displayRecentlySearchedCities();

function getWeatherForecast(lat, lon) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const todayData = data.list[0];
      const today = moment(todayData.dt_txt).format('DD/MM/YYYY');
      const forecastDays = [];

      for (let i = 1; i <= 5; i++) {
        forecastDays[i] = moment(todayData.dt_txt).add(i, 'days').format('DD/MM/YYYY');
      }

      const date = today;
      const weatherIcon = todayData.weather[0].icon;
      const temperature = todayData.main.temp;
      const windSpeed = todayData.wind.speed;
      const humidity = todayData.main.humidity;
      temperatureElement.textContent = `Temp: ${kelvinToCelsius(temperature)} °C`;
      windElement.textContent = `Wind: ${windSpeed} KPH`;
      humidityElement.textContent = `Humidity: ${humidity}%`;
      const city = searchInput.value;
      cityNameElement.textContent = city;
      dateElement.textContent = date;
      weatherIconElement.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;

      const forecastData = data.list.slice(1, 6);
      forecastSection.innerHTML = '';
      forecastData.forEach((item, i) => {
        const { weather, main, wind } = item;
        const forecastDate = forecastDays[i + 1];
        const forecastWeatherIcon = weather[0].icon;
        const forecastTemperature = main.temp;
        const forecastWindSpeed = wind.speed;
        const forecastHumidity = main.humidity;

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('col', 'mb-4');
        forecastCard.innerHTML = `
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${forecastDate}</h5>
              <img class="card-img-top" src="http://openweathermap.org/img/w/${forecastWeatherIcon}.png" alt="Weather Icon">
              <p class="card-text">Temp: ${kelvinToCelsius(forecastTemperature)} °C</p>
              <p class="card-text">Wind: ${forecastWindSpeed} KPH</p>
              <p class="card-text">Humidity: ${forecastHumidity}%</p>
            </div>
          </div>
        `;

        forecastSection.appendChild(forecastCard);
        searchInput.value = '';
        localStorage.setItem('lastSearchedCity', city);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

  function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
  }
}
document.getElementById("search-button").addEventListener("click", capitalizeInput);

function capitalizeInput() {
  var input = document.getElementById("search-input");
  var capitalized = input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase();
  input.value = capitalized;
}

