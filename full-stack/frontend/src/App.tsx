import axios from 'axios'
import './App.css'
import { useEffect, useState } from 'react'

function App() {

  const [players , setPlayers] = useState([])

  useEffect(()=> {
    axios.get('/api/footballers')
    .then((res) => {
      setPlayers(res.data)
    })
    .catch((err) => console.log(err)
    )
  

  } , [])

  console.log(players);
  

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
