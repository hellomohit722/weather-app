const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");


const grandAcessContainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchForm]");
const loadingscreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-inputContainer");

let currentTab = userTab;
const API_KEY = "7d8ce127015cf218d1f5c76b3b8acdc6";
getFromSessionStorage();

currentTab.classList.add("current-tab");

function switchTab(clickedTab)
{
  if(currentTab!=clickedTab)
  {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchform.classList.contains("active"))
    {
      grandAcessContainer.classList.remove("active");
      userInfoContainer.classList.remove("active")
      searchform.classList.add("active");
    }
    else
    {
      searchform.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

function getFromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");  //why---------------------------> 
  if(!localCoordinates)
  {
    grandAcessContainer.classList.add("active");
  }
  else
  {
    const coordinates = JSON.parse(localCoordinates);  //why -------------------------------------------->
    fatchUserWeatherInfo(coordinates);
  }
}

async function fatchUserWeatherInfo(coordinates)
{
  const {lat,lon} = coordinates;  //why------------------------------------------------------------------>
  grandAcessContainer.classList.remove("active");
  loadingscreen.classList.add("active");

  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingscreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err)
  {
    loadingscreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const weatherDescription = document.querySelector("[data-weatherDescription]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temperature = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  cityName.innerHTML = weatherInfo?.name || "Unknown Location";
  countryIcon.src = `https://flagcdn.com/w320/${weatherInfo.sys.country.toLowerCase()}.png`;
  weatherDescription.innerHTML = weatherInfo?.weather?.[0]?.description || "No description available";
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`;
  temperature.innerHTML = `${weatherInfo?.main?.temp ?? "N/A"}°C`;
  windSpeed.innerHTML = `${weatherInfo?.wind?.speed ?? "N/A"} km/h`;
  humidity.innerHTML = `${weatherInfo?.main?.humidity ?? "N/A"}%`;
  clouds.innerHTML = `${weatherInfo?.clouds?.all ?? "N/A"}%`;
}


function getLocation()  // why ---------------------------->
{
  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else
  {
    alert("Did not support");
  }
}

function showPosition(position)
{
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude
  }

  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fatchUserWeatherInfo(userCoordinates);
}


const getAccessButton = document.querySelector("[data-generateAccess]");
getAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]")
searchform.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName==="")
    return ;
  else
  {
    fatchSearchWeatherInfo(cityName);
  }
})

async function fatchSearchWeatherInfo(cityName) {
  loadingscreen.classList.remove("active");
  userInfoContainer.classList.remove("active");
  grandAcessContainer.classList.remove("active");

  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingscreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err)
  {
    loadingscreen.classList.remove("active");
  }
}

userTab.addEventListener("click",()=>{
  switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
  switchTab(searchTab);
});