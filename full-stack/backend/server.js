import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express();

const port = process.env.PORT ? process.env.PORT : 3000;

const footballers = [
    {
    id: 1,
    name: "Bukay Saka",
    position: 'Winger'
},

{
    id: 2,
    name: "Declan Rice",
    position: 'Defensive midfielder'
}, 

{
    id: 3,
    name: "Martin Odegaard",
    position: 'Attacking Midfielder'
}, 

{
    id: 4,
    name: "Kai Havertz",
    position: 'Striker'
}, 
]

app.get('/' , (req , res) => {
    res.send("Server is Ready");
})

app.get('/api/footballers' , (req , res) => {
    res.json(footballers);
})

app.listen(port , () => {
    console.log(`Server is running at port: ${port}`);
    
})

