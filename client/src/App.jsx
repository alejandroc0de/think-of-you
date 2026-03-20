import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/app/Home'


function App() {
  



  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<Navigate to= "/login"/>}/>
          <Route path='/login' element = {<Login />} /> 
          <Route path='/register' element = {<Register />} />
          <Route path='/home' element = {<Home />} />
        </Routes>
      
      
      </BrowserRouter>
    </div>
  )
}

export default App
