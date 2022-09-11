function toggleDarkMode(){
  //this function adds the "bootstrap-dark" class to <body>
  //and then saves the user's preference in local storage
  let element = document.body;
  element.classList.toggle("bootstrap-dark");
  let bodyClassList = document.body.classList;
  if(bodyClassList.contains("bootstrap-dark")){
    saveDarkMode(true);

  } else {saveDarkMode(false);}
}

function saveDarkMode(newPreference){
  //if one can access local storage
  if (typeof(Storage) !== "undefined") {
    //if an item already exists with the "preference" key it gets deleted
    if(localStorage.getItem("preference") != null){
      localStorage.removeItem("preference");
    }
    //preference will have true if darkmode is enabled, false otherwise
    localStorage.setItem("preference", newPreference);
  }
}

//this function will have to check local storage and set darkmode (or keep lightmode)
function checkPreference(){
  
  //if localStorage is accessible...
  if (typeof(Storage) !== "undefined") {
    //if there is an item with the "preference" key and it has the value true...
    if(localStorage.getItem("preference") == "true"){
      let bodyClassList = document.body.classList;
      if(!bodyClassList.contains("bootstrap-dark")){ //if body DOES NOT already have bootstrap-dark
        let element = document.body;
        element.classList.toggle("bootstrap-dark");
      }

    }
  }
}
checkPreference();



function checkArray(){
//checks if localStorage has a "cities" item
  if (typeof(Storage) !== "undefined") {
    //if there is an item with the "preference" key and it has the value true...
    if(localStorage.getItem("cities") == null){
      //if there is no array...make a default and store it
      var array = ["rome", "berlin", "paris", "los angeles", "london", "tokyo", "beijing"];
      localStorage.setItem("cities", JSON.stringify(array));
    }
  }
}
checkArray();

function changeArray(index, cityName){
  if (typeof(Storage) !== "undefined") {
    //if there is an item with the "preference" key and it has the value true...
    if(localStorage.getItem("cities") != null){
      //if there is an array in local storage to modify...
      var array = JSON.parse(localStorage.getItem("cities"));
      array[index] = cityName;
      localStorage.removeItem("cities");
      localStorage.setItem("cities", JSON.stringify(array));
    }//otherwise nothing to modify
  }
}



async function getWeather(cityName, idCityName ,idTemperature, idIcon, idWeatherStatus){

  //IdCityName is to insert the city's name in the html page
  //consult https://openweathermap.org to view the API documentation for all things except pictures

  const appId="d42f0d997cad9e6b3c98f3bf5e7a6667";
  //acquire latitude and longitude of the city
  var response = await fetch("http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+appId,{method:"GET"});
  var responseObj = await response.json();
  var lat = responseObj[0].lat;
  var lon = responseObj[0].lon;

  //use the coordinates to acquire the current weather 
  var response = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+appId+"&units=metric",{method:"GET"});
  var weather = await response.json();
  let temp = weather.main.temp;
  //weatherStatus, for example light rain
  let weatherStatus = weather.weather[0].description;
  let iconCode = weather.weather[0].icon;
  //code acquired for the icon, actual icon (image) is required
  let iconURL = "http://openweathermap.org/img/wn/"+iconCode+"@2x.png";

  document.getElementById(idTemperature).innerText=temp+"°";
  document.getElementById(idWeatherStatus).innerText= weatherStatus;
  document.getElementById(idIcon).src=iconURL;
  document.getElementById(idCityName).innerText= cityName[0].toUpperCase() + cityName.substring(1);
}




async function getPicture(imageQuery,idImage){


  
  //use of pexels API to acquire images of the cities (ImageQuery will be the city name)
  const APIkey="563492ad6f91700001000001e8ee8a55fc734e6885decb34030bb5cb";
  const request = await fetch("https://api.pexels.com/v1/search?query="+imageQuery, {
    method: 'GET',
    headers:{
      Authorization: APIkey,
    }
  });
  //convert imageInfo from String to Object
  const imageInfoArray = await request.json();
  //ImageInfoArray is an array of objects containing data of several photos
  var imageURL = imageInfoArray.photos[0].src.portrait;
  document.getElementById(idImage).src = imageURL;
}

async function getPicturesCarousel(imageQuery,idImage1, idImage2, idImage3){


  //we will need 3 images
  //use of pexels API to acquire images of the cities (ImageQuery will be the city name)
  const APIkey="563492ad6f91700001000001e8ee8a55fc734e6885decb34030bb5cb";
  const request = await fetch("https://api.pexels.com/v1/search?query="+imageQuery, {
    method: 'GET',
    headers:{
      Authorization: APIkey,
    }
  });
  //convert imageInfo from String to Object
  const imageInfoArray = await request.json();
  //ImageInfoArray is an array of objects containing data of several photos
  var imageURL1 = imageInfoArray.photos[0].src.landscape;
  var imageURL2 = imageInfoArray.photos[1].src.landscape;
  var imageURL3 = imageInfoArray.photos[2].src.landscape;
  document.getElementById(idImage1).src = imageURL1;
  document.getElementById(idImage2).src = imageURL2;
  document.getElementById(idImage3).src = imageURL3;
}


async function getData(index, cityName){
  //acquires data and picture/s for the city that is passed as value

  //keeping this block just in case...

  getWeather(cityName, "city-"+index, "temperature-"+index, "icon-"+index, "weather-status-"+index);

  if(index != 0){
    //NOT carousel
    console.log("image-"+index);
    getPicture(cityName+" landmark", "image-"+index);
  } else{
    //for the carousel we need 3 image IDs
    getPicturesCarousel(cityName+" landmark", "image-00", "image-01", "image-02");
  }
}

function getDataForAll(){
  //it will have to acquire data about the array in local storage
  if (typeof(Storage) !== "undefined") {
    //if there is an item with the "cities" key we have an array
    if(localStorage.getItem("cities") != null){
      let cities = JSON.parse(localStorage.getItem("cities"));
      for(var i = 0; i < cities.length; i++){
        getData(i, cities[i]);
      }
    } else{
      //if there is no array in local storage...
      let array = ["rome", "berlin", "paris", "los angeles", "london", "tokyo", "beijing"];
      for(var i = 0; i < array.length; i++){
        getData(i, array[i]);
      }
    }
  }
}
getDataForAll();

async function searchCity(index){

  var cityName = document.getElementById("input-"+index).value;
  document.getElementById("input-"+index).value = "";
  if(cityName == ""){
    alert("Please enter the name of a city");
    return;
  }
  //call openWeatherAPI to see if the name is valid, if yes 
  const appId="d42f0d997cad9e6b3c98f3bf5e7a6667";
  //acquire latitude and longitude of the city
  var response = await fetch("http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&appid="+appId,{method:"GET"});
  var responseObj = await response.json();

  try{
    responseObj[0].name;
  } catch(err){
    //if no respose is given alert user and abort
    alert("City not found");
    return;
  }
  var cityNameEn = responseObj[0].name;

  //need to check if the city is already in the array
  if (typeof(Storage) !== "undefined") {
  //if local storage is accesible...
    if(localStorage.getItem("cities") != null){
      //if there is an array in local storage...
      var array = JSON.parse(localStorage.getItem("cities"));
      for(var i = 0; i < array.length; i++){
        if(cityNameEn.toLowerCase() == array[i].toLowerCase()){
          //if there already is this city in the array then we abort
          alert("This city is already present in this page");
          return;
        }
      }
    }
  }
  getData(index, cityNameEn);
  changeArray(index, cityNameEn);
}