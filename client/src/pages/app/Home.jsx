import {io} from 'socket.io-client'

const socket = io("http://localhost:3000", {
    auth : {"token": "token"}
})

function Home(){



    return (

        <div>
            
        </div>
    )
}

export default Home