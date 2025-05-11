import axios from 'axios'
import './App.css'
import { useState } from 'react'

function App() {

  const [players , setPlayers] = useState([])

  axios.get('http://localhost:4000/footballers')
  .then((res) => {
    setPlayers(res.data)
  })
  .catch((err) => console.log(err)
  )

  return (
    <>
     <div>
      <h1 className=''>Arsenal Football Players</h1>
      {
        players.map((player , index) => (
         <div key={index}>
           <h3>{player.name}</h3>
           <p>{player.position}</p>
         </div>
        ))
      }


     </div>
    </>
  )
}

export default App
