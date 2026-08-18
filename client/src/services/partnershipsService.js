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

export {getPartnerService,setPartner}