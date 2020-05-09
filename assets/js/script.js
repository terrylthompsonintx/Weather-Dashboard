//Global Variables begin
var historyList = document.querySelector('#history');
var searchbtnpress = document.querySelector('#searchbtn');
var heroDiv = document.querySelector('#hero');
var forecastDiv = document.querySelector('#forecast')
var apiKey = '7f0033f9d596986b6d7fb538906b12a7';
var city = '';
var searchHistoryList = [];
var units = 'imperial';
var cityLat = '';
var cityLon = '';
var apiReturn ={}
var displayCity= '';

var iconUrl = function(code){
    var icode=code + '@2x.png';
    //console.log(icode);
    var urlstring = 'https://openweathermap.org/img/wn/' + icode;
    return(urlstring);
}
//Global Variables End

//Fucntions Begin

//returns the date from unixtime stamp
var convertUnixToDate = function(utime){
    var unix_timestamp = utime;
    var date = new Date(unix_timestamp * 1000);
    realmonth = date.getMonth();
    realmonth ++;
    var toldate = realmonth +'/'+ date.getDate() +'/' + date.getFullYear();
    return(toldate);
}

//takes city input and makes it proper case
var scrubCity =function(){
    var dirtycity = city.toLowerCase().trim();
    //console.log(dirtycity);
    var firstChar = dirtycity.charAt(0).toUpperCase();
    var remains = dirtycity.slice(1);
    city = firstChar + remains;
    
}

//clears all display divs
var clearDiv =function(targetDiv){
    targetDiv.innerHTML='';
    //clears the div passed to it.
}

//task json object from API and generates html
var displayResults =function(json){
    clearDiv(heroDiv);
    clearDiv(forecastDiv)
  
    
    var iconsrc1 =iconUrl(json.current.weather[0].icon); 
    var divlabel =document.createElement('h2');
    var h2text = displayCity +' ' + convertUnixToDate(json.current.dt);
    divlabel.textContent = h2text;
    var iconimg1=document.createElement('img');
    iconimg1.setAttribute('src', iconsrc1);
    iconimg1.setAttribute('height', '100');
    iconimg1.setAttribute('width', '100');
    divlabel.appendChild(iconimg1);
    heroDiv.appendChild(divlabel);
    var divUl = document.createElement('ul');
    divUl.className='hero';
    divUl.setAttribute('id', 'heroUl');
    heroDiv.appendChild(divUl);
    var firstli= document.createElement('li');
    firstli.textContent='Temperature ' + json.current.temp + ' F';
    divUl.appendChild(firstli);
    var secondli= document.createElement('li');
    secondli.textContent='Humidity ' + json.current.humidity + ' %';
    divUl.appendChild(secondli);
    var thirdli= document.createElement('li');
    thirdli.textContent='Wind speed  ' + json.current.wind_speed + ' MPH';
    divUl.appendChild(thirdli);
   
   var fourthli= document.createElement('li');

   var uvitext = document.createElement('div')
   uvitext.className='col-2';
   uvitext.innerText= 'UV Index:'
   fourthli.appendChild(uvitext);
   //fourthli.textConent = 'UV Index:';
   var uvdisplay =document.createElement('div');
   var uviint = parseInt(json.current.uvi);
   //console.log(uviint);
   if (uviint >= 11){
    uvdisplay.className= 'purple';
    
    }else if(uviint >=8 && uviint <=10){
        uvdisplay.className='red';
        
    }else if(uviint >=6 && uviint <=7){
        uvdisplay.className='orange';
        
   }else if(uviint >=3 && uviint <=5){
        uvdisplay.className='yellow';
        
   }else{
        uvdisplay.className='green';
        
   }

   uvdisplay.textContent=json.current.uvi;
   uvdisplay.classList.add('col-1');
   fourthli.appendChild(uvdisplay);
   divUl.appendChild(fourthli);
   
   for(var i=1;i<6;i++){
       var newcard= document.createElement('div');
       newcard.setAttribute('class', 'card forecastcard col-2')
       var carddate = convertUnixToDate(json.daily[i].dt);
       newcard.innerText = carddate;
    
       
       var iconsrc =iconUrl(json.daily[i].weather[0].icon);
       var iconimg=document.createElement('img');
       iconimg.setAttribute('src', iconsrc);
       iconimg.setAttribute('height', '100');
       iconimg.setAttribute('width', '100');
       newcard.appendChild(iconimg);

       var cardtemp1 = document.createElement('p');
       cardtemp1.innerText = 'Day Temp: ' + json.daily[i].temp.day +' F';
       newcard.appendChild(cardtemp1);

       var cardtemp2 = document.createElement('p');
       cardtemp2.innerText = 'Night Temp: ' + json.daily[i].temp.night +' F';
       
       newcard.appendChild(cardtemp2);

       var cardhum = document.createElement('p');
       cardhum.innerText = 'Humidity: ' + json.daily[i].humidity +' %';
       newcard.appendChild(cardhum);
       
       forecastDiv.appendChild(newcard);
   }
//console.log(json);
}

    //loads search history from local storage and diplays in page 
var loadHistory=function(){
    searchHistoryList = JSON.parse(localStorage.getItem("searches"));
    //console.log ('loadhistory', searchHistoryList);
    if (searchHistoryList == null){
        searchHistoryList =[];
    }
    for(i=0;i<searchHistoryList.length;i++){
        var newLi = document.createElement('li');
        newLi.innerText=searchHistoryList[i];
        newLi.setAttribute('data',searchHistoryList[i])
        newLi.classList.add('oldcity');
        //console.log(newLi);
        historyList.appendChild(newLi);
          
    }
      
}    

// goes to api and requests weather
var fetchWeather = function(){
    var newEnd ="https://api.openweathermap.org/data/2.5/onecall?"

    var endpointurl = "https://api.openweathermap.org/data/2.5/forecast?q=" +city+"&appid="+apiKey+"&units="+units;
    //console.log();
    fetch(endpointurl)//api endpoint
    .then(function(responce){
        return responce.json();//once responce is recieved send it .json() method and pass to next
    })
    .then(function(myJson){
        
        cityLat = myJson.city.coord.lat;
        
        cityLon = myJson.city.coord.lon;
        displayCity =myJson.city.name;
        //console.log(myJson);
        
    })
    .then(function(){
        //console.log (cityLat,cityLon);
        var secondendp = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat +"&lon=" +cityLon +"&appid="+apiKey+"&units="+units;
        fetch(secondendp)
        .then(function(res){
            return res.json();
        })
        .then(function(res){
            displayResults(res);
        })
        .catch (function(error){
            console.log(error) //or someother error handling
           })
        
    })
    .catch (function(error){
     console.log(error) //or someother error handling
    })
}
// End of fucntions

//event handlers begin
var searchbtn= function(){
    city = document.getElementById('searchbox').value;
    scrubCity();
    if (searchHistoryList == null){
        searchHistoryList = [];
        searchHistoryList.push(city);
        localStorage.setItem('searches',JSON.stringify(searchHistoryList));
        fetchWeather(city);
    }
    else{
        var ispresent = false;
        for (a=0;a<searchHistoryList.length;a++){
            if (searchHistoryList[a]==city){
                ispresent=true;
            }
        }
       
        if(ispresent==true){
            fetchWeather(city);
        }
        else{
            searchHistoryList.push(city);
            localStorage.setItem('searches',JSON.stringify(searchHistoryList));
            var newLi = document.createElement('li');
            newLi.innerText=city;
            newLi.setAttribute('data',searchHistoryList[i])
            historyList.appendChild(newLi);
            fetchWeather(city);
        }
    }
}

var historybtn= function(){
    
    
    if (event.target.matches('.oldcity')){
    city=event.target.innerText;
    //console.log(city);
    fetchWeather(city);    
    }
    
}
//event  handlers end

loadHistory();

//event listeners
historyList.addEventListener('click',historybtn);
searchbtnpress.addEventListener('click',searchbtn);


