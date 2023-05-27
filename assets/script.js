const apiKey = '23135be0017efae611741be8622491e2'
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

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