import { useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom"
import {io} from 'socket.io-client'
import { jwtDecode } from "jwt-decode"; // Decode token with username and id 
 



function Home(){

    // DECLARATIONS ---------------------------------------------------
    const socketInfo = useRef(null)
    const [recentMessages, setRecentMessages] = useState([]) // Array of messages 
    const bottomRef = useRef(null) // Ref for the message div and auto scroll
    const navigate = useNavigate()
    const [hasPartner, setHasPartner] = useState(false) // State for conditional rendering 
    const [alreadyHasPartner, setAlreadyHasPartner] = useState(false) // Conditional for partner with another partner already, dont cry
    const [partnerExists, setPartnerExists] = useState(true) // Conditional for incorrect username 
    const [partnerUsername, setPartnerUsername] = useState("")


    // ----------------------------------------------------------------


    /* PROTECT HOME - If no token, return to login. Navigate has to be use in useEffect() */

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(!token){
            navigate('/login');
        }
    },[])



    // Decode token to access the username and id, wont change so const is ok and NOT useState
    const decodedToken = jwtDecode(localStorage.getItem("token"))
    const myId = decodedToken.id
    const myUsername = decodedToken.username





    /* When a client sucessfully connects i have to send the token to the backend, it decode and save the username and 
    Id to the server memory, so real time messages can work. */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL, {
            auth : {"token": localStorage.getItem("token")}  
        })
        socketInfo.current = socket

        // Listener for socket incoming----
        socket.on("send", (data) => {
            setRecentMessages(prev => [...prev, data]) // Adding socket msg to array from db, using a updater function to get latest value 
            // prev is the most recent value, so i add new message to the top of the list  
        })

        return()=> {
            // Cleanup: When client disconnects we need to disconnect socket 
            socket.disconnect()
        };
    },[]); // Empty dependecy array, so when mounted 


    // Function to get partner info on mounting, checks if client has partner and if client has partner conditional render
    useEffect(() => {
        async function getPartnerInfo(){
            try{
                const result = await fetch(`${import.meta.env.VITE_API_URL}/partnerships`,{
                    method: "GET",
                    headers : {Authorization : `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type' : "application/json"}
                    })
                if(result.ok){
                    setHasPartner(true)
                }
            }catch(error){
                console.log(error)
            }
        };
        getPartnerInfo() 
    },[])


    /* Load the messages from the db once client logs in ----------------------------- */ 
    useEffect(() => {
        async function fetchData(){
            try {
                const result = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
                    method: "GET",
                    headers : {'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type' : "application/json"}
                })
                const data = await result.json()
                setRecentMessages(data.recentMessages.reverse()) // Returned by backend in the res json 
            } catch (error) {
                console.log("Error fetching last messages " + error)
            }
        };
        // No clean up needed since fetch doesnt leave anything open 
        fetchData()
    },[]) // On mounting 

    
    /* UseEffect for scroll to latest message once messages gets changed ------------- */
    useEffect(() => {
        if(bottomRef.current){
            bottomRef.current.scrollIntoView({behavior : "smooth", block : "end"})
        }
        // If there is a ref scroll to the latest message
    },[recentMessages])
 


    // FUNCTIONS --------------------------------------------------------------

    async function handleSendMessage(){
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/messages`,{
                method: "POST",
                headers  : {'Authorization' : `Bearer ${localStorage.getItem('token')}`, // Send token for middleware backend 
                            "Content-Type":"application/json"},
                body : JSON.stringify({message : "I am thinking of you"})
            })
            if(result.status !== 201 ){
                const data = await result.json()
                window.alert(data.message)
            }
            else{
                const data = await result.json()
                // Insert message to the messages array to be able to update it
                setRecentMessages(prev  => [...prev, data.messageObj.rows[0] ]) // This comes from the back, to be able to use Timestamp from Psql
            }
        } catch (error) {
            console.log("Error when sending message" + error)
        }
    }

    function handlePartnerUsername(event){
        setPartnerUsername(event.target.value)
    }

    // This functions sets the partner to the db and conditional render
    async function handleSetPartner(){
        if(partnerUsername == ""){
            return // If empty username
        }
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/partnerships`, {
                method: "POST",
                headers: {'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type' : "application/json"},
                body: JSON.stringify({username : partnerUsername})
            })
            const data = await result.json()
            if(data.error == "23505"){ // If username already has a partner
                setAlreadyHasPartner(true)
            }
            if(data.error == "007"){ // If username doesnt exists on the db 
                setPartnerExists(false)
            }
            if(result.ok){
                window.alert("Partner linked!")
               setHasPartner(true)
            }
        } catch (error) {
            console.log(error)
        }
    }




    // Function to format time to locale time 
    function formatTime(timestamp){
        return new Date(timestamp).toLocaleString([],{
            day : "2-digit",
            month: "short",
            hour : "2-digit",
            minute : "2-digit"
        })
    }

    // Function for logout client
    function handleLogout(){
        localStorage.clear()
        navigate('/login')
    }


    // ----------------------------------------------------------------------------------------------------------


    return (
        <div className='flex flex-col items-center justify-center h-screen bg-cover bg-center bg-no-repeat' >
            {/* HEADER */}
            <div id='header' className='flex flex-col text-7xl font-bold items-center h-[25%] justify-center' style={{fontFamily: 'Rouge Script'}}>
                <h1> Welcome {myUsername} </h1>
            </div>

            {/* CONTENT HAS PARTNER */}

            {hasPartner && <div className='flex flex-row h-[65%] w-screen justify-evenly '>

                <div id='lastMessages' className='border-2 overflow-hidden p-3 rounded-2xl border-gray-200  w-[35%] backdrop-blur-xsz' >
                    {recentMessages && recentMessages.map((item,index) => (
                        <div className={item.sender == myId? 'text-right m-5':'text-left m-5'} key={index}>
                            <span className= {item.sender == myId ? "bg-blue-200 shadow-2xs border-2 border-gray-200  rounded-2xl p-1" : "bg-gray-200 border-2 border-gray-300 rounded-2xl p-1"}> {item.sender == myId ? "You" :"Partner" } - {item.message_sent} at {formatTime(item.time_sent)}</span> 
                        </div>
                    ))}
                    <div ref={bottomRef}></div>
                </div>

                <div id='content' className=' flex flex-col justify-center '>
                    <button className='border-2 shadow-2xl bg-gray-50 rounded-2xl mb-10 p-5 mt-5 text-4xl font-bold hover:bg-pink-200 hover:scale-125 duration-300' style={{fontFamily: 'Rouge Script'}} onClick={handleSendMessage}>I am thinking of you</button>
                </div>
            </div>
            }

            {/* CONTENT HAS NOT PARTNER */}
            {!hasPartner &&    
                <div>
                    <div className=' flex flex-col text-5xl font-bold leading-normal' style={{fontFamily: 'Rouge Script'}}>
                        <p>You dont have a partner, to use the app please first link your partner</p>
                        <label htmlFor="">Partner username: </label>
                        <input value={partnerUsername} onChange={handlePartnerUsername} type="text" placeholder='Enter Username'/>
                        <button onClick={handleSetPartner}>Submit</button>
                        {alreadyHasPartner && <p className='text-5xl text-red-600 font-bold leading-normal text-center'>This user already has a partner </p>}
                        {!partnerExists && <p className='text-5xl text-red-600 font-bold leading-normal text-center'> This username is not on thinkingofyou </p>}
                    </div> 
                </div>
            }

                

            
            {/* FOOTER */}

            <div id='logoutButton' className=' h-[10%] flex flex-col justify-center'>
                <button onClick={handleLogout} className='text-4xl font-bold hover:scale-110 hover:text-red-600 duration-200' style={{fontFamily: 'Rouge Script'}}>Logout</button>
            </div>
        </div>
    )
}

export default Home



