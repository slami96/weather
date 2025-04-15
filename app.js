// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const loadingContainer = document.getElementById('loading-container');
const weatherContainer = document.getElementById('weather-container');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');

// API Key - Replace with your OpenWeatherMap API key
const API_KEY = 'YOUR_API_KEY_HERE';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Try to load the last searched city from localStorage
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeatherData(lastCity);
    }
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            showError('Please enter a city name');
        }
    }
});

// Functions
/**
 * Fetches weather data from the OpenWeatherMap API
 * @param {string} city - The city name to get weather for
 */
async function getWeatherData(city) {
    // Save the city to localStorage
    localStorage.setItem('lastCity', city);
    
    // Show loading state
    setAppState('loading');
    
    try {
        // Fetch weather data using async/await
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Display weather data
        displayWeatherData(data);
        
        // Show weather container
        setAppState('weather');
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError(error.message === 'city not found' 
            ? 'City not found. Please check the spelling and try again.' 
            : `Failed to fetch weather data: ${error.message}`);
    }
}

/**
 * Displays the weather data in the UI
 * @param {Object} data - The weather data from the API
 */
function displayWeatherData(data) {
    // Update city name and date
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = getCurrentDate();
    
    // Update weather icon and temperature
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    
    // Update weather details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

/**
 * Controls the application state
 * @param {string} state - The app state ('loading', 'weather', or 'error')
 */
function setAppState(state) {
    // Hide all containers first
    errorContainer.classList.add('hidden');
    loadingContainer.classList.add('hidden');
    weatherContainer.classList.add('hidden');
    
    // Show the appropriate container based on state
    switch (state) {
        case 'loading':
            loadingContainer.classList.remove('hidden');
            break;
        case 'weather':
            weatherContainer.classList.remove('hidden');
            break;
        case 'error':
            errorContainer.classList.remove('hidden');
            break;
    }
}

/**
 * Shows an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    setAppState('error');
}

/**
 * Gets the current formatted date
 * @returns {string} The formatted date string
 */
function getCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
}
