const apiKey = '23135be0017efae611741be8622491e2'
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
      } else {
        console.log('No location found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
function getWeatherForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
        const todayData = data.list[0];
      const { dt_txt } = todayData;
      const date = moment(dt_txt).format('DD/MM/YYYY');
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
      forecastData.forEach(item => {
        const { dt_txt, weather, main, wind, dt } = item;
        const forecastDate =  moment(dt_txt).format('DD/MM/YYYY');
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
      });
    })
      .catch(error => {
        console.error('Error:', error);
      });
      function kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15);
      }
  }
  