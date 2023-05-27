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
      temperatureElement.textContent = `Current Temp: ${kelvinToCelsius(temperature)} °C`;
      windElement.textContent = `Wind: ${windSpeed} KPH`;
      humidityElement.textContent = `Humidity: ${humidity}%`;
      const city = searchInput.value;
      temperatureElement.textContent = `Current Temp: ${kelvinToCelsius(temperature)} °C`;
      cityNameElement.textContent = city;
      dateElement.textContent = date;
      weatherIconElement.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;
      
      
      })
      .catch(error => {
        console.error('Error:', error);
      });
      function kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15);
      }
  }
  