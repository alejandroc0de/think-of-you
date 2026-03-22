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


    // This functions handles the login, makes a req to the back, receives the token and redirects to /home
    async function handleSubmit(){
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
                method:"POST",
                headers : {"Content-Type":"application/json"},
                body : JSON.stringify({username : username, password : password})
            });
            const data = await result.json();
            localStorage.setItem("token", data.token) // Save the token retorned by the back to the LocalStorage
            navigate('/home')
        } catch (error) {
            console.log("Error when trying to login" + error)
        }
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