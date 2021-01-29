const app = {};
app.apiKey = '4c725d373d2844acacc3569994a1b729';
app.imageUrl = 'http://openweathermap.org/img/wn/';

// get user input from 
app.getValue = () => {
    $('form').on('submit', (e) => { 
        e.preventDefault();        
        //save city from input field into a variable
        const userInput =  $('#search').val();
        //call getWeather function and pass userInput to getWeather function
        app.getWeather(userInput);
        //clear search input field
        $('#search').val('');
    })
}

app.getWeather = (city, hours) => {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?',
        dataType: 'json',
        method: 'GET',
        data: {
            appid: app.apiKey,
            q: `${city}`,
            units: 'metric'
        }
    }).then((result) => {
        const image = result.weather[0].icon;
        
        $('#city').html(result.name);
        $('#description').html(result.weather[0].main);
        const tempNow = Math.round(result.main.temp);
        const feelsLike = Math.round(result.main.feels_like);
        const tempMax = Math.round(result.main.temp_max);
        const tempMin = Math.round(result.main.temp_min);
        $('.degrees').html(`
            <div id='tempNow'>Now: ${tempNow} <i class="fas fa-temperature-low"></i></div>
            <div id="feelsLike">Feels Like: ${feelsLike} <i class="fas fa-temperature-low"></i></div>
            <div id='tempMax'>High: ${tempMax} <i class="fas fa-temperature-low"></i></div>
            <div id='tempMin'>Low: ${tempMin} <i class="fas fa-temperature-low"></i></div>
        `)
        //getting icon from the results
        $('#icon').attr(`src`, `${app.imageUrl}${image}.png`);
        // save icon description to a variable
        const desc = result.weather[0].main;
        console.log(desc)
            
        //getting timezone offset in seconds 
        const offset = result.timezone;
        console.log('offset in seconds', offset); 
        app.getTime(offset, desc);
    });    
}

// determine UTC timestamp.
    app.getTime = (offset, desc) => {
        let searchTimestamp;
        //get the curent timestamp for our location
        let timestamp = Date.now();

        //determine utc timestamp by adding local offset to local timestamp
        let utcTimestamp = timestamp + ((new Date().getTimezoneOffset())*60000);
        searchTimestamp = utcTimestamp + offset*1000;
       
        let searchDateObj = new Date(searchTimestamp);
        let humanDateFormat = searchDateObj.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        $('.localTime').html(`
            Local date & time: ${humanDateFormat}
        `)

        let hours = searchDateObj.getHours();

        //update body background using desc variable
        //if the sky is clear, check day or night
        if (desc === 'Clear') {
                if (hours > 6 && hours < 18) {
                    $('body').css('background-image', `url(assets/${desc}.jpg)`);
                } else {
                    $('body').css('background-image', `url(assets/${desc}-night.jpg)`);
                }
            
            } else { $('body').css('background-image', `url(assets/${desc}.jpg)`);
        }
    }


app.init = () => {
    app.getValue();
    
}

$(function (){
    app.init();
})

