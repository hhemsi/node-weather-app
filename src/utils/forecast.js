const request = require('postman-request')

const units ='f'
const forecastUrl = 'http://api.weatherstack.com/current?access_key=aa142d4b44febc4cb159789b1c2bb184' +
'&units='+units


const forecast= (lon, lat, callback )=>{
    const url = forecastUrl + '&query='+ encodeURIComponent(lat)+','+encodeURIComponent(lon)
    // console.log('URL', url)
    // request({url:url, json: true}, (error,response)=>{
    request({url, json: true}, (error,{body})=>{ //destructure both url and response
            if(error){
            callback("Error sending request to webservice.\n"+error, undefined);
        }else if(body.error){
            callback("Unable to find location.\n"+body.error, undefined);
        }else{
            callback(undefined,{
                'location': body.location.name,
                'description': body.current.weather_descriptions[0],
                'temperature': body.current.temperature,
                'feelsLike': body.current.feelslike
            })
        }
    })
}

module.exports = forecast