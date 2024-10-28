const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const API_KEY = '232314a45f6974948199995d669db413'; // Ваш API ключ OpenWeatherMap
const cities = ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 
                'Zaporizhzhia', 'Kryvyi Rih', 'Mykolaiv', 'Sumy', 'Chernihiv'];

app.use(express.static('public'));

async function getWeatherData(city) {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const weatherResponse = await axios.get(weatherUrl);
    const forecastResponse = await axios.get(forecastUrl);

    return {
        current: weatherResponse.data,
        forecast: forecastResponse.data
    };
}

app.get('/weather', async (req, res) => {
    const weatherData = await Promise.all(cities.map(city => getWeatherData(city)));
    res.json(weatherData);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
