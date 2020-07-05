const request = require('postman-request')

//GeoCoding
const geoCodingKey='pk.eyJ1IjoicGhhc29yMSIsImEiOiJja2J2OG02NnAwMWxwMnFveWU1OHVocG1qIn0.9QvqMXX6RtViOLBGFoOaIQ'

const geocode = (address, callback) =>{
    //encoding the address
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token='+geoCodingKey+'&limit=1'

    request({url:url, json: true}, (error,response)=>{
        if(error){
            callback('Unable to connect to location services',undefined)
        }else if(response.body.error){
            callback("Response error", undefined)
        } else if(response.statusCode === 200 && response.body.features.length>0){
            callback(undefined, {
                'lat':response.body.features[0].center[1],
                'lon':response.body.features[0].center[0],
                location:response.body.features[0].place_name
            })
        }else{
            callback("Unable to find location try another address", undefined)
        }
    })
    
}

module.exports = geocode