import { useState } from "react"
import { Navigate, Routes, Route, useNavigate } from "react-router-dom"
import Register from './Register'



function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate() // Using this i can navigate to another route, a function cant render JSX
    const [wrongCredentials, setWrongCredentials] = useState(false)




    function handleUsername(event){
        setUsername(event.target.value)
    }

    function handlePassword(event){
        setPassword(event.target.value)
    }


    // This functions handles the login, makes a req to the back, receives the token and redirects to /home
    async function handleSubmit(){
        if(username == ""){
            return
        }

        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
                method:"POST",
                headers : {"Content-Type":"application/json"},
                body : JSON.stringify({username : username, password : password})
            });
            // I analize the result before using json() to avoid errors. 
            if(!result.ok){
                setWrongCredentials(true) // Conditional message
                return
            }
            const data = await result.json();
            setWrongCredentials(false) 
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
        <div className="flex flex-col items-center bg-amber-50 h-screen justify-center bg-cover bg-center bg-no-repeat" style={{fontFamily:"Gabriela"}} >
            <div className="flex flex-col border-2  rounded-2xl border-gray-300 shadow-2xl backdrop-blur-md backdrop-contrast-500 p-3 w-[90%] md:w-auto md:p-10">
                <h1 className=" font-bold text-6xl text-center md:text-8xl">thinkofu</h1>
                <input value={username} onChange={handleUsername} type="text" placeholder="Enter Username"  className="mt-4 p-3 border-b-2 border-gray-400 outline-none text-3xl "/>
                <input value={password} onChange={handlePassword} type="password" placeholder="Enter Password" className="text-3xl p-3 border-b-2 border-gray-400 outline-none" />
                <button onClick={handleSubmit} className=" border-b-2 border-gray-400 text-3xl font-bold mt-10 rounded-2xl text-gray-700 hover:scale-110 hover:text-black duration-200" >Submit</button>
                <button onClick={handleRegister} className="border-b-2 border-gray-400 text-3xl font-bold mt-5 rounded-2xl text-gray-700 hover:scale-110 hover:text-black duration-200">Register</button>

                <div>{wrongCredentials && <p className="text-red-600 text-2xl text-center mt-3.5"> Wrong Credentials </p>}</div>
                
            </div>
        </div>
    )
}

export default Login