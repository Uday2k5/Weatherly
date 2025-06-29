const express =  require("express");
const app = express();
const path = require("path");
const axios =  require("axios");

const apikey  = "91fb47223a55de0e876cd009421f0fae";


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true}));


app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.post("/weatherly", async (req,res)=>{
    const city = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

    // try{
    //     const response = await axios.get(url);
    //     const weatherData = response.data;

    //      const weather = {
    //         city: weatherData.name,
    //         temp: weatherData.main.temp,
    //         description: weatherData.weather[0].description,
    //         icon: weatherData.weather[0].icon
    //     };

    //     res.render("weather.ejs", { weather });
    // } catch (error) {
    //     console.error(error);
    //     res.send("Error fetching weather data. Try again.");
    // }
    try {
    // 1️⃣ Get coordinates from city name
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`
    );

    if (!geoRes.data || geoRes.data.length === 0) {
      return res.send("City not found.");
    }

    const { lat, lon, name, country } = geoRes.data[0];

    // 2️⃣ Get current weather
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
    );

    // 3️⃣ Get air pollution data
    const airRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apikey}`
    );

    // 4️⃣ Get 5-day forecast
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`
    );

    // 5️⃣ Prepare data
    const weatherData = weatherRes.data;
    const airData = airRes.data.list[0];
    const forecastData = forecastRes.data.list.slice(0, 5); // 5 time slots (next 15 hours approx)
    const currentTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const result = {
      city: name,
      country,
      temp: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      wind: weatherData.wind.speed,
      airQuality: airData.main.aqi, // AQI: 1 (Good) to 5 (Very Poor)
      forecast: forecastData,
      time: currentTime,
    };

    res.render("weather.ejs", { weather: result });
  } catch (error) {
    console.error(error);
    res.send("Error fetching weather data. Try again.");
  }
    


});


app.listen(8080,()=>{
    console.log("server is running on port 8080");
});