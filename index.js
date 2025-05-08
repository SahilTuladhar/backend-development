require('dotenv').config()


const express = require('express')
const app = express()
const port = process.env.PORT ? process.env.PORT : 3000
 
const userData = [ {
    name: 'Messi',
    age: 38,
    role: 'CAM'
} , {
    name: 'Saka',
    age: 22,
    role: 'RW'
}]

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter' , (req , res) => {
 res.send('twitter username: sailTuladhar')
})

app.get('/footballers' , (req , res)=>{
 res.json(userData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

