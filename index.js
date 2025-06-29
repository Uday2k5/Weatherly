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

    try{
        const response = await axios.get(url);
        const weatherData = response.data;

         const weather = {
            city: weatherData.name,
            temp: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon
        };

        res.render("weather.ejs", { weather });
    } catch (error) {
        console.error(error);
        res.send("Error fetching weather data. Try again.");
    }
    


});


app.listen(8080,()=>{
    console.log("server is running on port 8080");
});