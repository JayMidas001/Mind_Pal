const mongoose = require ('mongoose')
require('dotenv').config()
const url = process.env.DATABASE

mongoose.connect(url)
.then(()=>{
    console.log('connection to database successfully')
})
.catch((error)=>{
    console.log('error connecting to database', error.message)
})
