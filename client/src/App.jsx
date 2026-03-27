import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/app/Home'
import ProtectedRoute from './pages/component/ProtectedRoute';


function App() {
  



  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {<Navigate to= "/login"/>}/>
          <Route path='/login' element = {<Login />} /> 

          <Route element = {<ProtectedRoute />}>
            <Route path='/home' element={<Home />}/>
          </Route>

          <Route path='/register' element = {<Register />} />
        </Routes>
      
      
      </BrowserRouter>
    </div>
  )
}


// I wrap the middleware in a Route, what is wrapped will be the children or the outlet, if the condition is not satisfied
// Protected route will return a navigate to login in case there is no token  

export default App
