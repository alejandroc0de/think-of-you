// services to communicate with backend

async function fetchMessages () {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: "GET",
        headers : {'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type' : "application/json"}
    })
    const data = await result.json()
    return data
}

async function sendMessage() {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/messages`,{
                method: "POST",
                headers  : {'Authorization' : `Bearer ${localStorage.getItem('token')}`, // Send token for middleware backend 
                            "Content-Type":"application/json"},
                body : JSON.stringify({message : "I am thinking of you"})
    })
    return result
}

async function getPartnerService() {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/partnerships`,{
        method: "GET",
        headers : {Authorization : `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type' : "application/json"}
    })
    return result
}

async function setPartner() {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/partnerships`, {
        method: "POST",
        headers: {'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type' : "application/json"},
        body: JSON.stringify({username : partnerUsername})
    })
    const data = await result.json()
    return data
}



export {fetchMessages,sendMessage,getPartnerService,setPartner}