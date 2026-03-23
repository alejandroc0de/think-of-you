import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register(){

    //DECLARATION ---------------------------------------------------------
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate() // To redirect to login once registered

    // --------------------------------------------------------------------

    // FUNCTIONS ----------------------------------------------------------

    function handleName(event){
        setName(event.target.value)
    }
    function handleUsername(event){
        setUsername(event.target.value)
    }
    function handlePassword(event){
        setPassword(event.target.value)
    }

    async function handleSubmit(){
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
                method:"POST",
                headers : {"Content-Type":"application/json"},
                body : JSON.stringify({name : name, username: username, password: password})
            });
            if(result.statusCode !== 200){
                const data = await result.json()
                if(data.error === "23505"){ // code for unique clause violation 
                    window.alert("Username Already Taken")
                    return
                }else{
                    window.alert("Error when saving info to the DB")
                    return
                }
            }
            navigate('/login')
        } catch (error) {
            window.alert("Error when trying to login " + error)
        }
    }

    return(
        <div>
            <h1>Register to Thinkofyou</h1>
            <input value={name} onChange={handleName} type="text" name="" id="" placeholder="Enter your name" />
            <input value={username} onChange={handleUsername} type="text"placeholder="Create a username" />
            <input value={password} onChange={handlePassword} type="password" placeholder="Create a password" />
            <button onClick={handleSubmit} >Submit</button>
        </div>
    )
}

export default Register