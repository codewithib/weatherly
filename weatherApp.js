// Grabbing all my elements from html

const cityInput = document.querySelector(".city-text");

const searchBtn = document.querySelector(".search");

const cityInfos = document.querySelector(".city-info");

const tempDisplay = document.querySelector(".temp");

const weatherConditionDisplay = document.querySelector(".weather-condition");

const timeDisplay = document.querySelector(".time");

// const weatherIconDisplay = document.querySelector(".weather-icon");

const humidityDisplay = document.querySelector(".number-humidity");

const pressureDisplay = document.querySelector(".number-pressure");

const visibilityDisplay = document.querySelector(".number-visibility");

const fiveDaysDisplay = document.querySelector(".five-days-container");

const iconDisplayWrapper = document.querySelector(".center-weather-icon")

// Writing my async functions to fetch data and making the promise return async

const getCurrentWeather = async (event) => {

    event.preventDefault();
    const city = cityInput.value.trim();

    // Writing the resolve state of the function

    try {
        
        const apiKey = '3ab0ef60b213e9508103da95332076de';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url); // assigning the response from the api to response variable

        if (!response.ok) {
            throw new Error("City not found or spelling incorrect");
        }

        const weatherData = await response.json(); // converting the response from the API to json format

        // assigning all the weather info I need from the api to a variable starts here
        const cityName = weatherData.name; 
        const countryCode = weatherData.sys.country;
        const flagUrl = `https://flagsapi.com/${countryCode}/shiny/64.png`;
        const weatherIconCode = weatherData.weather[0].icon;
        const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@4x.png`;
        const temp = weatherData.main.temp;
        const weatherCondition = weatherData.weather[0].description;
        const timeStamp = weatherData.dt;// Getting the time stamp
        const date = new Date(timeStamp * 1000); // Converting to a JS Date Object
        const timeString = date.toLocaleTimeString(); // Formating the time for dsplay

        const humidity = weatherData.main.humidity;
        const pressure = weatherData.main.pressure;
        const visibility = weatherData.visibility;
        const visibilityInKm = (visibility / 1000).toFixed(1);


        // assigning all the weather info I need from the api to a variable ends here

        console.log(weatherData);

        // Fecthing the geeocoding api to get the states of the city enter by the user

        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error ("Failed to fetch location details");
        }

        const geoData = await geoResponse.json(); //converting the geoResponse from the API to json format

        const state = geoData[0]?.state || "Unknown State";   //Getting the state from the json format


        // Displaying info assigned to my variables to the page starts here
        cityInfos.textContent = `${cityName}, ${state}`;
        const flagDisplay = document.createElement("img");
        cityInfos.appendChild(flagDisplay);
        flagDisplay.src = flagUrl;
        flagDisplay.classList.toggle("flag");
        tempDisplay.textContent = `${temp}, °C`;
        weatherConditionDisplay.textContent = weatherCondition;
        timeDisplay.textContent = timeString;

        const weatherIconDisplay = document.createElement("img");

        weatherIconDisplay.src = weatherIconUrl;

        weatherIconDisplay.classList.toggle("weather-icon");

        iconDisplayWrapper.appendChild(weatherIconDisplay);

        

        humidityDisplay.textContent = `${humidity}%`;
        pressureDisplay.textContent = `${pressure}hPa`;
        visibilityDisplay.textContent = `${visibilityInKm}km`

        // Displaying info assigned to my variables to the page ends here

        // Fetching forecast data for five days weather

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
            throw new Error ("Unable to get forecast details");
        }

        const forecastData = await forecastResponse.json();

        const dailyForecasts = forecastData.list.filter((item) => item.dt_txt.includes("12:00:00"));
        fiveDaysDisplay.innerHTML = "";

        for (let day of dailyForecasts) {
            // assigning all the weather info I need from the api to a variable starts here
            const timeStamp = day.dt;
            const date = new Date(timeStamp * 1000);
            const timeString = date.toDateString();
            const temp = day.main.temp;

            const weatherIconCode = day.weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

            const weatherCondition = day.weather[0].description;

            // assigning all the weather info I need from the api to a variable ends here

            const foreCastItem = document.createElement("div");

            const time = document.createElement("p");// Creating p tag to hold my date
            time.textContent = timeString; // assigning my p tag content

            foreCastItem.appendChild(time);

            const weatherIconDisplay = document.createElement("img");
            weatherIconDisplay.src = weatherIconUrl;
            weatherIconDisplay.classList.toggle("five-days-icon");

            foreCastItem.appendChild(weatherIconDisplay);


            

            // foreCastItem.innerHTML = `<p>${timeString}</p>`;

            

            fiveDaysDisplay.appendChild(foreCastItem);
        }


    } catch (error) {
        alert(error)
    }

    cityInput.value = "";
} 


searchBtn.addEventListener("click", getCurrentWeather);

