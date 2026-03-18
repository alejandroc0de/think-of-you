import './App.css'
import {io} from 'socket.io-client'

function App() {
  const socket = io("http://localhost:3000")



  return(
    <h1>
      Hello
    </h1>
  )
}

export default App
