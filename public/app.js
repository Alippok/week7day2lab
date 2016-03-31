window.onload = function(){
  console.log('App started');

  var url = "https://restcountries.eu/rest/v1";

  var request = new XMLHttpRequest();//a new XMLHttpRequest object
  request.open("GET", url); //tell request the ACTION and LOCATION
  
    request.onload = function(){//tell it what to do when it has finished getting data
      if(request.status === 200)//200 is an ok status/complete
        console.log('got the data, success');
        var jsonString = request.responseText;//what does this responseText do?
        
        localStorage.setItem("all countries", jsonString)
      };
  
  request.send();//actually go of and do what we defined above

  var dropDown = document.getElementById("dropdown")
  var allCountriesString = getAllFromLocalStorage("all countries");
  var allCountriesObjects = JSON.parse(allCountriesString);
  var map = new Map({lat:20, lng:0}, 1)
  map.bindClick();

  var countryNames = getCountryNames(allCountriesObjects);
  // console.log("country names", countryNames)
  // createAppendOptionsElements(countryNames); //Split this function as it was doing two things.
  var dropDownOptions = createOptionsElements( countryNames );
  appendOptionsElements( dropDown, dropDownOptions );


    dropDown.onchange = function(){
      var country = retrieveCountryStats(allCountriesObjects, dropDown.value);
      // console.log("country", country);
      var countryLatLng = retrieveCountryLatLng(allCountriesObjects, dropDown.value)
      // console.log(countryLatLng)

      map.updateMap(countryLatLng, 6);
      var countryStatsString = createCountryStatsString(country)
      console.log(countryStatsString)
      map.addInfoWindow(countryLatLng, country[0], countryStatsString)    
      

      var borderingCountriesCodes = retrieveBorderingCountriesCodes(allCountriesObjects, dropDown.value);
      // console.log('bordering country codes', countryCodes)
      var borderingCountriesNames = retrieveBorderingCountriesNames(allCountriesObjects, borderingCountriesCodes);
      // console.log(borderingCountriesNames)
      var borderingCountriesStats = retrieveMultiCountryStats( allCountriesObjects, borderingCountriesNames, retrieveCountryStats );
      // console.log(borderingCountriesStats)
      var borderingCountriesElement = createMultiCountryDisplayElements( borderingCountriesStats, createCountryDisplayElement )

      var displayArea = document.getElementById('display_area');
      var countryDisplayElement = createCountryDisplayElement(country);
      var borderingCountriesDisplayArea = document.getElementById('bordering_countries')
      
      // console.log(body)
      // console.log(displayArea)
      // displayArea.removeChild(displayArea.childNodes[0]);
      if (displayArea.childNodes.length === 0 ){
        // displayArea.appendChild( countryDisplayElement );
        appendChildToElement( displayArea, countryDisplayElement )
        appendChildToElement( borderingCountriesDisplayArea, borderingCountriesElement )
        // borderingCountriesDisplayArea.appendChild( borderingCountriesElement );
      } else {
        // displayArea.removeChild(displayArea.childNodes[0])
        removeChildFromElement( displayArea, 0 )
        removeChildFromElement ( borderingCountriesDisplayArea, 1)
        // borderingCountriesDisplayArea.removeChild( borderingCountriesDisplayArea.childNodes[1])
        appendChildToElement( displayArea, countryDisplayElement )
        appendChildToElement( borderingCountriesDisplayArea, borderingCountriesElement )
        // displayArea.appendChild(countryDisplayElement);
        // borderingCountriesDisplayArea.appendChild( borderingCountriesElement );
      }
    }
};

// var countryNames = getCountryNames(countries)
// // console.log(countriesArray)
// // console.log('12th country', countriesArray[13])
// createAppendOptionsElements(countryNames)


var getAllFromLocalStorage = function(key){
  return localStorage.getItem(key);
};

var getCountryNames = function(array){
  countryNames = [];
  array.forEach(function(country){
    countryNames.push(country.name);
  })
  return countryNames;
};

var createOptionsElements = function(array){
  options = []
  array.forEach(function(countryName){
    var option = document.createElement("option")
    option.innerText = countryName;
    option.value = countryName;
    options.push(option)
  })
  return options;
}

var appendOptionsElements = function(element, array){
  array.forEach(function(option){
    element.appendChild(option);
  })
};

var retrieveCountryStats = function(array, countryName){
  var countryArray = []
  array.forEach(function(country){
    // console.log(country)
    if (country.name === countryName){
      countryArray.push(country.name, country.capital, country.population);
    }
  });
  return countryArray
}

var createCountryStatsString = function(array){
  var string = array[0] + "\n" + array[1] + "\n" + array[2].toString();
  return string
}

var retrieveCountryLatLng = function(array, countryName){
  var latlng;
  array.forEach(function(country){
    // console.log(country)
    if (country.name === countryName){
      latlng = {lat: country.latlng[0], lng: country.latlng[1]};
    }
  });
  return latlng
}

var retrieveBorderingCountriesCodes = function(array, countryName){
  var countryCodes = []
    array.forEach(function(country){
      if (country.name === countryName){
        countryCodes.push(country.borders);
      }
    });
    return countryCodes;
}

var retrieveBorderingCountriesNames = function(array1, array2){
  var countriesStats = [];
  var countriesNames = [];
  var codes = array2.pop()

  codes.forEach(function(code){
    // console.log(code)
    array1.forEach(function(country){
      // console.log(country.alpha3Code)
        if (country.alpha3Code === code){
          countriesNames.push(country.name);
        }
      });
  })
  // console.log(countryStats)
   return countriesNames;
}

var retrieveMultiCountryStats = function(array1, array2, callBack){
  var countriesStats = [];
    array2.forEach(function(countryName){
      countriesStats.push(callBack(array1, countryName));
    });
  return countriesStats;
}

var createMultiCountryDisplayElements = function(array, callBack){
  var divElement = document.createElement('div');
  array.forEach(function(countryStatsArray){
    var countryDisplayElement = callBack( countryStatsArray );
    divElement.appendChild( countryDisplayElement );
  });
  return divElement;
};


//   array1.forEach(function(country){
//     array2.forEach(function(code){
//       if (country.alpha3code === code){
        
//         countryStats.push(country.name, country.capital, country.population);
//       }
//     });
//     countriesStats.push(countryStats);
//   });
//   return countriesStats;
// }

var createCountryDisplayElement = function(array){
  var divElement = document.createElement('div')
  array.forEach(function(data){
    var paragraphElement = document.createElement('p')
    paragraphElement.innerText = data;
    divElement.appendChild(paragraphElement);
  });
  return divElement;
};

var appendChildToElement = function(element, child){
  element.appendChild(child);
}

var removeChildFromElement = function(element, childIndex){
  element.removeChild(element.childNodes[childIndex]);
}



