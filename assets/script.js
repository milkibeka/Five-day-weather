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
      const date = new Date(dt_txt);
      const formattedDate = formatDate(date);
    
      
      })
      .catch(error => {
        console.error('Error:', error);
      });
      function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
  }
  