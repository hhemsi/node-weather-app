const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


console.log(__dirname)
//console.log(__filename)
console.log(path.join(__dirname, '../public'))

const app = express()


//templates using hbs module and define path
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// setup handlebars engine and views location
// look for docs in expressjs.com to see the property names/values
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// use the public static html directory
app.use(express.static(path.join(__dirname, '../public')))

// http://localhost:3000/about.html
// http://localhost:3000/help_static.html
// http://localhost:3000
// http://localhost:3000/help
// http://localhost:3000/about


// render using hanldebars module (index.hbs)
// pass in the view and an object with data
app.get('', (req, res)=>{
    res.render('index', {
        title:'Weather app',
        name:'Hani'
    })
})
app.get('/about', (req, res)=>{
    res.render('about', {
        title:'About ...',
        name:'Hani'
    })
})
app.get('/help', (req, res)=>{
    res.render('help', {
        title:'Help ...',
        name: 'Hani',
        helpText:'This is help content'
    })
})

//http://localhost:3000/weather?address=Orange
app.get('/weather', (req, res)=>{
    if(!req.query.address){
        return res.send({
            error:"Address must be provided"
        })
    }
    // do geo then forecast
    geocode(req.query.address, (error, {lat, lon, location}={})=>{//destructure and use default if undefined
        if(error){
            return res.send({
                error:"Error getting geocode for address:" +  req.query.address,
                info:error
            })
        }
        forecast(lon, lat, (error, forecastData) => {
            if(error){
                return res.send({
                    error:"Error getting forecast for address:" +  req.query.address,
                    info:error
                })
            }
            res.send({
                address:req.query.address,
                location,
                forecast:forecastData.description,
                temperature:forecastData.temperature,
                feelsLike:forecastData.feelsLike
            })
        })    
    })

})

//http://localhost:3000/products?search=games
app.get('/products', (req, res)=>{
    if(!req.query.search){
       return res.send({
           error:"You must provide search term"
       }) 
    }
    
    console.log(req.query.search)
    res.send({
        products:[]
    })    
})


app.get('/help/*', (req, res)=>{
    res.render('notFound', {
        title:'Not found ...',
        name: 'Hani',
        errorMessage:'Help article not found'
    })
})

// last, match wrong url
app.get('*', (req, res)=>{
    res.render('notFound', {
        title:'Not found ...',
        name: 'Hani',
        errorMessage:'Page not found'
    })})

app.listen(3000, ()=>{
    console.log("server starting on 3000")
})