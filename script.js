let iLocation = document.querySelector("#locationInput");
let search = document.querySelector("#search-icon");
let sTemp = document.querySelector(".weather");
let sPlace = document.querySelector(".weather-place");
let sFeels = document.querySelector(".feels-like");
let url = "https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=d4f5700d5d5b7afc09a8ae42f01a7316"
let weatherImg = document.querySelector(".weather-img");

let temprature = document.querySelectorAll(".mTemp");
let sun = document.querySelectorAll(".sunCard");
let third = document.querySelectorAll(".thirdCard");
let wind = document.querySelectorAll(".wind");

let nextHour = document.querySelectorAll(".next-hour");
let currentIcon = document.querySelector(".current-icon");
let weatherDesc = document.querySelector(".weather-desc");

let nextHourImg = document.querySelectorAll(".next-hour-img");

let table = document.querySelectorAll(".table");
let ul = document.querySelector(".search-history");

let select = document.querySelector(".select");
let settingIcon = document.querySelector('.setting-icon');

settingIcon.addEventListener("click", () => {
    // console.log(select.style.display);
    if(select.style.display !== "none"){
        select.style.display = "none";
    }else{
        select.style.display = "block";

    }
})

async function sucessCallback(position){
    console.log(position.coords);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    weatherChange(lat, lon);
    // changeImg(desc);

    // filling data
    // fillData(weath);
}


function errorCallback(error){
    console.error(error);
}

navigator.geolocation.getCurrentPosition(sucessCallback, errorCallback);


search.addEventListener("click", async()=>{
    weatherSearch();
});

async function weatherSearch(){
    let location = (iLocation.value).toLowerCase();
    // searchHistory.push(location);
    let arr = location.split(" ");
    let loc = "";
    showSearchHistory(location);
    for (const e of arr) {
        loc += "+"+e;
    }
    location = loc.slice(1);
    // console.log(location)
    ul.style.display = "none";
    iLocation.value = "";
    
    weatherImg.style.top = "1200px";
    try{
        
        let weather1 = await fetchWeather1(location);
        
        console.log(weather1.data);
        lat = weather1.data.coord.lat
        lon = weather1.data.coord.lon

        // let weather = await fetchWeather(lat, lon);
        // console.log(weather.data);
        
        weatherChange(lat, lon);
        
        // filling data in cards
        

        
        // changeImg(desc);
        
    }catch(e){
        console.log("Wrong location", e);
        sFeels.innerText = "";
        sTemp.innerText = "";
        sPlace.innerText = "Location not Found";
        currentIcon.src = "";
        currentIcon.style.display = "none";
        weatherDesc.innerText = "";
        
        removeContent(temprature);
        removeContent(sun);
        removeContent(third);
        removeContent(wind);
        removeContent(table);
        // console.log(location)
    }
}

let searchHistory = [];
function showSearchHistory(location){
    
    let check = searchHistory.some((el) => location == el);
    
    if(!check){
        searchHistory.push(location);
        let li = document.createElement("li");
        li.innerText = location;
        
        let icon = document.createElement("span")
        icon.innerHTML = '<i class="fa-solid fa-xmark cut"></i>';
        li.append(icon);
        ul.append(li);
        
    }
    
    add();
    
}

ul.addEventListener("click", (e)=>{
    if(e.target.nodeName == "I"){
        e.target.parentElement.parentElement.remove();
    }
});

function add(){
    let allLi = document.querySelectorAll("li");
    console.log(allLi);
    allLi.forEach(all =>{
        all.addEventListener("click", (e) =>{
            console.log(e);
            if(e.target.nodeName == "LI"){
                iLocation.value = all.innerText;
                // console.log("print");
            }
            
        })
    });
}

    

let lInput = document.querySelector("#locationInput");
lInput.addEventListener("click", () => {
    ul.style.display = "block";
});
lInput.addEventListener("keypress", (e) =>{
    // console.log(e.key)
    if(e.key == "Enter"){
        weatherSearch();
    }
})



let mainContent = document.querySelector(".main-content");
mainContent.addEventListener("click", ()=>{
    ul.style.display = "none";
})

async function fetchLocation(lat, lon){
    let place = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
    // console.log(place)
    return place;
}

async function fetchWeather1(location) {
    const apiKey = "d4f5700d5d5b7afc09a8ae42f01a7316";
    let fWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
    return fWeather;
}   

async function fetchWeather(lat, lon) {
    const apiKey = "d4f5700d5d5b7afc09a8ae42f01a7316";
    let fWeather = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    return fWeather;
}

function celcius(temp){
    if(select.selectedOptions[0].label == "Celcius"){
        temp = temp - 273;
        return temp.toFixed(2) + " °C";
    }else{
        let temp1 = 1.8 *(temp - 273.15) + 32;
        return temp1.toFixed() + " °F";
    }
    
}


function changeImg(icon){
    // body.style.backgroundImage = `url("./Background/${icon}.png")`;
    weatherImg.style.top = "0";
    weatherImg.src = `./Background/${icon}.png`;
}



async function weatherChange(lat , lon){
        let place = await fetchLocation(lat, lon);
        let weather = await fetchWeather(lat, lon);
        fillData(weather);
       

        let state = place.data.address.state;
        let country = place.data.address.country;
        let city = place.data.address.city;

        let temp = weather.data.list[0].main.temp;
        // console.log(temp);
        sTemp.innerText = celcius(temp);

        let fLike = weather.data.list[0].main.feels_like;
        sFeels.innerText = "Feels Like: "+ celcius(fLike);


        if(city != undefined){
            if(state != undefined){
                sPlace.innerText = "Location: "+city+", "+state+", "+country;
            }else{
                sPlace.innerText= "Location: "+ country;
            }            
            
        }else{
            
            if(state != undefined){
                 sPlace.innerText = "Location: "+state+", "+country;
            }else{
                sPlace.innerText= "Location: "+ country;
            }
        }


        let lTime = weather.data.list[0].dt_txt;
        let cCloud = weather.data.list[0].clouds.all;
        let sLevel = weather.data.list[0].main.sea_level;
        let gLevel = weather.data.list[0].main.grnd_level;
        let population = weather.data.city.population;
        // console.log(population)
        fillTable([lTime, cCloud+" %", sLevel+" m", gLevel+' m', population, lat, lon]);
}


function content(element, list){
    for(let i = 0; i < element.length; i++ ){
        if(element[i].children[1] == undefined){
            let span = document.createElement("span");
            span.innerText = list[i];
            element[i].append(span);
            // console.log(element[i])
        }else{
            element[i].children[1].innerText = list[i];
        }
        
    }
}
function removeContent(element){
    if(element[1].children[1] != undefined){

    
        for(let i = 0; i < element.length; i++ ){
            if(element[i].children[1] != undefined){
                element[i].children[1].innerText = "";
            }

        }
    }
}


function impToNormal(time){
    let date = new Date(time * 1000);
    // Format the date and time
    let formattedTime = date.toLocaleTimeString(); // This gives a readable format
    // console.log(formattedTime);
    return formattedTime;
    
}


function fillData(weather){
    // to set all the data in cards 
    // setting temprature
    
    let icon = weather.data.list[0].weather[0].icon;
    // console.log(icon);
    changeImg(icon);
    currentIcon.src = `./Icons/${icon}.gif`;
    currentIcon.style.display = "block";

    
    weatherDesc.innerText = weather.data.list[0].weather[0].description;

    let maxTemp = celcius(weather.data.list[0].main.temp_max);
    let minTemp = celcius(weather.data.list[0].main.temp_min);
    content(temprature, [maxTemp, minTemp]);
    // Setting sunrise and sunset
    let sunrise = impToNormal(weather.data.city.sunrise);
    let sunset = impToNormal(weather.data.city.sunset);
    content(sun, [sunrise, sunset]);
    // setting Third visibility, pressure, humidity
    let visi = weather.data.list[0].visibility/1000;
    let humid = weather.data.list[0].main.humidity;
    let pressure = weather.data.list[0].main.pressure;
    content(third, [`${visi} Km`, `${humid} %`,`${pressure} mb` ])
    
    // setting wind
    let sWind = (weather.data.list[0].wind.speed*3.6).toFixed(2);
    let gust = weather.data.list[0].wind.gust==undefined ? "Not present": ((weather.data.list[0].wind.gust*3.6).toFixed(2))+" km/h";
    let deg = weather.data.list[0].wind.deg;
    // console.log(gust)
    content(wind, [`${sWind} km/h`, `${gust}`, `${deg}`])

    fillNextHour(weather, nextHour, nextHourImg);
}

function fillNextHour(weather, element, img){
    for(let i = 0; i < element.length; i++){
        let icon = weather.data.list[i+1].weather[0].icon;
        img[i].src= `./Icons/${icon}.gif`;
        let temp = celcius(weather.data.list[i+1].main.temp);
        let desc = weather.data.list[i+1].weather[0].description;

        if(element[i].children[2] == undefined){
            let span = document.createElement("span");
            span.innerHTML = `${desc}<br> Temprature: ${temp}`;
            element[i].append(span);
            // console.log(element[i])
        }else{
            element[i].children[2].innerHTML =  `${desc}<br> Temprature: ${temp}`;
        }
    }
}



function fillTable(element){


    for(let i = 0; i < table.length; i++){
        if(table[i].children[1] == undefined){
            let span = document.createElement("span");
            span.innerText = element[i]
            table[i].appendChild(span);

            // console.log(table[i]);
        
        }else{
            table[i].children[1].innerText = element[i];
        }
        
    }
}


let cards = document.querySelectorAll(".woble");

cards.forEach(card => {
    // console.log(card);
    card.addEventListener("mousemove", (e) =>{
        ul.style.display = "none";
        let details = card.getBoundingClientRect();
        const centerX = details.left + details.width/2;
        const centerY = details.top + details.height/2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        // console.log(centerX);
        const rotateX = (mouseY / details.height)*15;
        const rotateY = -(mouseX / details.width)*15;
        // console.log(rotateX);

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';        
    });
});

