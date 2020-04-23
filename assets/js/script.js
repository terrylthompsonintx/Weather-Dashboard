console.log('script present');
var searchbtnpress = document.querySelector('#searchbtn');
var apiKey = '7f0033f9d596986b6d7fb538906b12a7';
var city = '';
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

var displayResults =function(json){
    // Code that processes return, typically create dynamice html with it.
    
    }

var fetchWeather = function(){
    
    city = document.getElementById('searchbox').value;
    var endpointurl = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey;
    fetch(endpointurl)//api endpoint
    .then(function(responce){ 
        return responce.json();//once responce is recieved send it .json() method and pass to next
    })
    .then(function(myJson){
        console.log(myJson)
        //displayResults(myJson);
    })
    .catch (function(error){
     console.log(error) //or someother error handling
    })
}

searchbtnpress.addEventListener('click',fetchWeather);
