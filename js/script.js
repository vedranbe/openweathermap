/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = ""; // won't work without it
const list = document.querySelector(".weather-section ul.cities");
const msg = document.querySelector(".msg");
const units = 'metric'; // metric or imperial
const lang = 'en'; // en is default. other values: sq, af, ar, az, eu, be, bg, ca, zh, hr, cz, da, nl, fi, fr, gl, de, el, he, hi, hu, is, id, it, ja, kr, ku, la, lt, mk, no, fa, pl, pt, ro, ru, sr, sk, sl, sp, es, sv, se, th, tr, ua, uk, vi, zu
const cities = ["Vancouver", "New York", "Sao Paulo", "London", "Berlin", "Istanbul", "Moscow", "Dubai", "Mumbai", "Beijing", "Tokyo", "Sydney"]; // Array of cities

if (apiKey == "") {
    document.addEventListener("DOMContentLoaded", function () {
        msg.innerHTML = `<div>You need an API key in order to make it work.</div><a href="https://home.openweathermap.org/users/sign_up" target="_blank">GET IT HERE !!!</a>`;
    });
    throw new Error("Your API key is missing. Stopping execution.");
}

// Function that fetches weather data and uses translations
async function fetchWeatherData(cityName, lang) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            msg.innerHTML = `<div>Your API key is invalid.</div><a href="https://home.openweathermap.org/api_keys" target="_blank">CHECK IT HERE !!!</a>`;
            throw new Error("Your API key is invalid. Stopping execution.");
        } else {
            msg.classList.add('hidden');
        }

        const data = await response.json();
        const {
            main,
            name,
            sys,
            weather,
            timezone
        } = data;
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

        const li = document.createElement("li");
        li.classList.add("city");

        // Convert temperatures based on units
        const tempDisplay = units === 'metric' ?
            `${Math.round(main.temp)}<sup>°C</sup>` :
            `${Math.round(main.temp)}<sup>°F</sup>`;

        const feelsLikeDisplay = units === 'metric' ?
            `${Math.round(main.feels_like)}<sup>°C</sup>` :
            `${Math.round(main.feels_like)}<sup>°F</sup>`;

        const tempMinDisplay = units === 'metric' ?
            `${Math.round(main.temp_min)}<sup>°C</sup>` :
            `${Math.round(main.temp_min)}<sup>°F</sup>`;

        const tempMaxDisplay = units === 'metric' ?
            `${Math.round(main.temp_max)}<sup>°C</sup>` :
            `${Math.round(main.temp_max)}<sup>°F</sup>`;

        // Adjust the original timestamp by adding the timezone difference
        const sunriseTime = sys.sunrise + timezone;
        const sunsetTime = sys.sunset + timezone;

        // Current date:
        const currentTimestampMs = Date.now(); // Current time in milliseconds

        const localTime = calculateTimezoneTime(currentTimestampMs, timezone);

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        };

        if (units == "imperial") {
            options.hour12 = true; // Add AM/PM indicator 
        } else {
            options.hour12 = false; // Add AM/PM indicator 
        }

        // Convert the adjusted timestamp to a Date object
        const timeSunrise = new Date(sunriseTime * 1000);
        const timeSunset = new Date(sunsetTime * 1000);

        // Format the Date object to a readable string
        const sunriseDisplay = convertToHoursAndMinutesWithAMPM(timeSunrise.toISOString().replace('T', ' ').substring(0, 19), units);
        const sunsetDisplay = convertToHoursAndMinutesWithAMPM(timeSunset.toISOString().replace('T', ' ').substring(0, 19), units);

        const markup = `<h2 class="city-name" data-name="${name},${sys.country}">
                    <span>${name} <span class="current">${localTime.toLocaleString('en-US', options)}</span></span>
                    <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${tempDisplay}</div>
                <div class="details">
                    <div class="feels-like">${translate('feels_like', lang)}: ${feelsLikeDisplay}</div>
                    <div class="humidity">${translate('humidity', lang)}: ${Math.round(main.humidity)}%</div>
                    <div class="pressure">${translate('pressure', lang)}: ${Math.round(main.pressure)} hpa</div>
                    <div class="sunrise">${translate('sunrise', lang)}: ${sunriseDisplay}</div>
                    <div class="sunset">${translate('sunset', lang)}: ${sunsetDisplay}</div>
                </div>
                <figure>
                    <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
                    <figcaption>${weather[0]["description"]}</figcaption>
                </figure>
                `;
        li.innerHTML = markup;
        return li;
    } catch (error) {
        console.error(`Error fetching data for ${cityName}: ${error}`);
        return null;
    }
}

// Function to fetch weather data for all cities
async function fetchAllCitiesWeather() {

    list.innerHTML = ''; // Clear existing data

    for (const [index, city] of cities.entries()) {
        const cityElement = await fetchWeatherData(city, lang);
        if (cityElement) {
            cityElement.style.animationDelay = `${index * 100}ms`; // Apply the animation delay
            cityElement.classList.add('fadeIn'); // Add the fadeIn class
            list.appendChild(cityElement); // Append the city element to the list
        }
    }

    console.log("Weather data loaded successfully!");
}

fetchAllCitiesWeather();