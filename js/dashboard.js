let latitude;
let longitute;
let humidity;
let temperature;
let mainWeather;
let windSpeed;
let country;
let city;
let initialRun;


$( document ).ready(function() {
    localStorageChecker();
    verifyCity("Kinshasa");
    
    
});



//------------------------------
/*
onClick search event

PURPOSE: Take user-input in a city-search bar (#findField).  Judges whether or not
         the search bar contains a value, and passes it onto API call function verifyCity().

RETURNS: None, but passes search bar contents as argument to function verifyCity().
*/
//------------------------------




$("#searchPlace").on("click", function(event) {
    // Don't refresh window.
    event.preventDefault();
    housekeeping();
    var placeToSearch = $("#findField").val();

    if(placeToSearch.trim() === ""){
     alert("The searchbar does not contain any values.")
    }

    else{
        verifyCity(placeToSearch.trim())
        }
})

//------------------------------
/*
verifyCity()

PURPOSE: This function makes the actual API call based on user input, and
         judges whether or not the API call is valid.  It does not parse
         the actual JSON.  Done for the sake of manageability and troubleshooting.

PARAMETERS: N/A

RETURNS: None, but passes JSON response onto function gatherCurrentConditions()
         to parse data.
*/
//------------------------------

function verifyCity(cityParam){
    let cityName = cityParam;
    let API_Key = "2e518cc94de226f197ed41b22bc3e358";
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_Key}&units=imperial`;


    // make API call
    $.ajax({
        url: URL,
        method: "GET",
        error: function(XMLHttpRequest, textStatus, errorThrown){
            alert('Sorry, but this search generated an error.  Please try again! ' +
                    '\n Details: Status =' + XMLHttpRequest.status + ', Status Text: ' + XMLHttpRequest.statusText);
        },
    }).then(function(response){
       console.log(`Original JSON before stringify: ${response}`);
       JSON.stringify(response);
       console.log(`After stringify: ${response}`);
       gatherCurrentConditions(response, API_Key);

})

checkCityList(cityName);
    
 }      
    
 //------------------------------
/*
gatherCurrentConditions()

PURPOSE: Parses the JSON (representing CURRENT weather) passed onto it from 
         function verifyCity().  Also passes longitude and latitude as arguments
         to other functions.

PARAMETERS: conditions (this is JSON string that contains information about the
                         current weather conditions.)

RETURNS:

*/
//------------------------------

function gatherCurrentConditions(conditions, aK ){
    // Console information and put parsed JSON info into global variables.
    appKey = aK;
    // Use these to pass as parameter.
    longitude = conditions.coord.lon;
    latitude = conditions.coord.lat;
    //HUMIDITY
    humidity = conditions.main.humidity;
    $("#humidity").text("Humidity: " + humidity + "%");
    //TEMPERATURE
    temperature = conditions.main.temp;
    $("#temperature").text("Temperature: " + temperature + " °F");
    //WIND
    windSpeed = conditions.wind.speed;
    $("#windSpeed").text("Windspeed: " + windSpeed + " MPH");
    //MAIN WEATHER
    mainWeather = conditions.weather[0].main;
    iconCode = conditions.weather[0].icon;
    iconLink =  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    $("#weatherIcon").attr("src", iconLink);
    $('#currentWeather').text(mainWeather);
    
    //LOCATION
    country = conditions.sys.country;
    city = conditions.name;
    locationString = city + ", " + country;
    $("#cityName").text(locationString);

    gatherUV_Data(appKey);
   // grabMap(appKey,longitude, latitude )

} 

 //------------------------------
/*
gatherUV_Data()

PURPOSE: This function makes a call to the "One Call" OpenWeatherMap IP to
         fill in UV data, and daily forecasts.

PARAMETERS: ak (API Key)

RETURNS:

*/
//------------------------------         

function gatherUV_Data(aK){
    iconCode = "";
    let apiKey = aK;
    let URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=imperial`;

 $.ajax({
        url: URL,
        method: "GET",
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('Sorry, but this search generated an error.  Please try again! ' +
                    '\n Details: Status =' + XMLHttpRequest.status + ', Status Text: ' + XMLHttpRequest.statusText);
        },
    }).then(function(response){
       JSON.stringify(response);
       
       $("#uVLevel").text("UV Index: " + response.daily[0].uvi);

       $(".dailyDetail").remove();

       // Day 1
       $("#day_1").append(`<p class="dailyDetail"> Temp: ${Math.round(response.daily[0].temp.day)}°F</p>`);
       $("#day_1").append(`<p class="dailyDetail"> Humidity: ${response.daily[0].humidity} %</p>`);
       iconCode = response.daily[0].weather[0].icon;
       iconLink =  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
       $("#dayWeatherImage_1").attr("src", iconLink);
       // Day 2
       $("#day_2").append(`<p class="dailyDetail"> Temp: ${Math.round(response.daily[1].temp.day)}°F</p>`);
       $("#day_2").append(`<p class="dailyDetail"> Humidity: ${response.daily[1].humidity} %</p>`);
       iconCode = response.daily[1].weather[0].icon;
       iconLink =  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
       $("#dayWeatherImage_2").attr("src", iconLink);
       // Day 3
       $("#day_3").append(`<p class="dailyDetail"> Temp: ${Math.round(response.daily[2].temp.day)}°F</p>`);
       $("#day_3").append(`<p class="dailyDetail"> Humidity: ${response.daily[2].humidity} %</p>`);
       iconCode = response.daily[2].weather[0].icon;
       iconLink =  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
       $("#dayWeatherImage_3").attr("src", iconLink);
       // Day 4
       $("#day_4").append(`<p class="dailyDetail"> Temp: ${Math.round(response.daily[3].temp.day)}°F</p>`);
       $("#day_4").append(`<p class="dailyDetail"> Humidity: ${response.daily[3].humidity} %</p>`);
       iconCode = response.daily[3].weather[0].icon;
       iconLink =  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
       $("#dayWeatherImage_4").attr("src", iconLink);
       // Day 5
       $("#day_5").append(`<p class="dailyDetail"> Temp: ${Math.round(response.daily[4].temp.day)}°F</p>`);
       $("#day_5").append(`<p class="dailyDetail"> Humidity: ${response.daily[4].humidity} %</p>`);
       iconCode = response.daily[4].weather[0].icon;
       iconLink =  `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
       $("#dayWeatherImage_5").attr("src", iconLink);

       

})       
}


//------------------------------
/*
housekeeping()

PURPOSE: This makes sure that the results of previous searches do not
         carry over into new searches.

PARAMETERS: 

RETURNS:

*/
//------------------------------   
   
function housekeeping(){
    latitude = ""
    longitute = "";
    humidity = "";
    temperature = "";
    mainWeather = "";
    windSpeed = "";
    country = "";
    city = "";

    $(".dailyDetail").remove();
    $("#humidity, #temperature, #windSpeed, #weatherIcon, #currentWeather").empty();
}    




function localStorageChecker(){

    if(localStorage.getItem("mycityList") != undefined && localStorage.getItem("mycityList") != null && localStorage.getItem("mycityList") != "" ){
        import_localStorage_cities();
      }
}



function import_localStorage_cities(){
       
       var currentItem;
       var grabLocal = localStorage.getItem("mycityList");
        var cityMap = JSON.parse(grabLocal);
        
        
        for (var i = 0; i<cityMap.length; i++){
          currentItem=document.createElement("li");
          workingObj =  cityMap[i].city;
          $(currentItem).text(workingObj);
          $(".list-group").append(currentItem);
         }
      } 
          

      function checkCityList(cityName){
        if(cityName === "Kinshasa"){
            return;
        }

        $("li").each( function(){
           if( $(this).html() === cityName ){
              return;
             }
          })
      var addedItem = document.createElement("li");
      $(addedItem).text(cityName);
      $(".list-group").append(addedItem);

      alter_localStorageObject();

       }


      function alter_localStorageObject(){
        
        if($("#findField").val().trim() === "Kinshasa"){
            return;
        }

        let event_array = [];
        $("li").each( function(){
          
     
                           if( $(this).text() != null && $(this).text() != undefined && $(this).text() != "" ){
                             var currentLine = {
                                                  
                                                 "city" : $(this).html(), 
                                               };
                             event_array.push(currentLine);
                            }
                         } )
         
                var objString = JSON.stringify(event_array);
                 localStorage.setItem("mycityList", objString);       
                        } 

$("ul").on("click", function(event) {
    // Don't refresh window.
    event.preventDefault();
    var searchItem = event.target;
    var searchCriteria = $(searchItem).text();
    verifyCity(searchCriteria);
})
     


                           
                 
     
          
        
        
