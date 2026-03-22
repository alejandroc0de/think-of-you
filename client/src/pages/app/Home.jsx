import { useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'


function Home(){

    // DECLARATIONS ---------------------------------------------------
    const socketInfo = useRef(null)
    const [lastMessage,setLastMessage] = useState({sender:null,time:null,message:null})




    /* When a client sucessfully connects i have to send the token to the backend, it decode and save the username and 
    Id to the server memory, so real time messages can work. */
    useEffect(() => {
        const socket = io("http://localhost:3000", {
            auth : {"token": localStorage.getItem("token")}  
        })
        socketInfo.current = socket

        // Listener for socket incoming----
        socket.on("send", (data) => {
            setLastMessage({sender:data.sender, time:data.time, message:data.message})
        })

        return()=> {
            // Cleanup: When client disconnects we need to disconnect socket 
            socket.disconnect()
        };
    },[]); // Empty dependecy array, so when mounted 
 



    // Here we need to implement socket to listen to incomming messages 

    

    return (

        <div>
            
        </div>
    )
}

export default Home