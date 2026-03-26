import { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'


function Home(){

    // DECLARATIONS ---------------------------------------------------
    const socketInfo = useRef(null)
    const [recentMessages, setRecentMessages] = useState([]) // Array of messages 
    const bottomRef = useRef(null) // Ref for the message div and auto scroll

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
            setRecentMessages(prev => [...prev, data]) // Adding socket msg to array from db, using a updater function to get latest value 
            // prev is the most recent value, so i add new message to the top of the list  
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

    // Function to format time to locale time 
    function formatTime(timestamp){
        return new Date(timestamp).toLocaleString()
    }


    // TODO
    // Gotta handle the amount of messages printed, and double check the code for bugs 
    // Gotta improve the confirmation messages 




    return (

        <div>
            <div id='header'>
                <h1> Welcome User </h1>
            </div>

            <div id='content'>
                <button className='border-2 mb-10' onClick={handleSendMessage}>I am thinking of you</button>
            </div>

            <div className='border-2 h-50 overflow-scroll' id='lastMessages'>
                {recentMessages && recentMessages.map((item,index) => (
                    <div key={index}>
                        <p>Sender : {item.sender} - {item.message_sent} at {formatTime(item.time_sent)}</p> 
                    </div>
                ))}
                <div ref={bottomRef}></div>
            </div>

        </div>
    )
}

export default Home