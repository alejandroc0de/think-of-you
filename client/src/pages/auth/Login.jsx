import { useState } from "react"
import { Navigate, Routes, Route, useNavigate } from "react-router-dom"
import Register from './Register'



function Login(){

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate() // Using this i can navigate to another route, a function cant render JSX




    function handleUsername(event){
        setUsername(event.target.value)
    }

    function handlePassword(event){
        setPassword(event.target.value)
    }


    function handleSubmit(){

    }

    function handleRegister(){
        navigate('/register')
    }





    return(
        <div>
            <h1>Hellooo</h1>
            <input value={username} onChange={handleUsername} type="text" placeholder="Enter Username" />
            <input value={password} onChange={handlePassword} type="password" placeholder="Enter Password" />
            <button onClick={handleSubmit} >Submit</button>
            <button onClick={handleRegister} >Register</button>
        </div>
    )
}

export default Login