import { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'


function Home(){

    // DECLARATIONS ---------------------------------------------------
    const socketInfo = useRef(null)
    const [lastMessage,setLastMessage] = useState({sender:null,time:null,message:null})
    const [recentMessages, setRecentMessages] = useState([]) // Array of messages 

    // ----------------------------------------------------------------



    /* When a client sucessfully connects i have to send the token to the backend, it decode and save the username and 
    Id to the server memory, so real time messages can work. */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL, {
            auth : {"token": localStorage.getItem("token")}  
        })
        socketInfo.current = socket

        // Listener for socket incoming----
        socket.on("send", (data) => {
            setRecentMessages(prev => [data, ...prev]) // Adding socket msg to array from db, using a updater function to get latest value  
        })

        return()=> {
            // Cleanup: When client disconnects we need to disconnect socket 
            socket.disconnect()
        };
    },[]); // Empty dependecy array, so when mounted 



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
                setRecentMessages(data.recentMessages) // Returned by backend in the res json 
            } catch (error) {
                console.log("Error fetching last messages " + error)
            }
        };
        // No clean up needed since fetch doesnt leave anything open 
        fetchData()
    },[]) // On mounting 



 


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
                window.alert(data.message)
            }
        } catch (error) {
            console.log("Error when sending message" + error)
        }

    }

    // Function to format time to locale time 
    function formatTime(timestamp){
        return new Date(timestamp).toLocaleString()
    }


    // TODO
    // Messages are printed, but now gotta add the message just sent to the display messages 
    // Gotta improve the confirmation messages 



    


    return (

        <div>
            <div id='header'>
                <h1> Welcome User </h1>
            </div>

            <div id='content'>
                <button onClick={handleSendMessage}>I am thinking of you</button>
            </div>

            <div id='lastMessages'>
                {lastMessage.message && <p>{lastMessage.message}</p>}
                {recentMessages && recentMessages.map((item,index) => (
                    <div key={index}>
                        <p>{item.message_sent} at {formatTime(item.time_sent)}</p> 
                    </div>
                ))}
            </div>


        </div>
    )
}

export default Home