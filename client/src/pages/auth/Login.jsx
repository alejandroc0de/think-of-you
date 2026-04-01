import { useState } from "react"
import { Navigate, Routes, Route, useNavigate } from "react-router-dom"
import Register from './Register'



function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
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
        <div className="flex flex-col items-center h-screen justify-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/background-login.jpg')"}} >
            <div className="flex flex-col border-2 bg-white p-5">
                <h1 className="text-9xl">Thinkofu</h1>
                <input value={username} onChange={handleUsername} type="text" placeholder="Enter Username" />
                <input value={password} onChange={handlePassword} type="password" placeholder="Enter Password" />
                <button onClick={handleSubmit} className="border-2 text-3xl mt-2">Submit</button>
                <button onClick={handleRegister} className="border-2 text-3xl mt-2">Register</button>
            </div>
        </div>
    )
}

export default Login