
const temp = document.querySelector(".temperature");

const API_KEY = "7d8ce127015cf218d1f5c76b3b8acdc6";
let cityName = "goa";

async function getTemp() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        temp.innerHTML = `${data?.main?.temp || "--"}°C`;
    } catch (error) {
        console.log("bhai error a gai h", error);
    }
}

getTemp();

