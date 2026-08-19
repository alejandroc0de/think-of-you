async function getPartnerService() {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/partnerships`,{
        method: "GET",
        headers : {Authorization : `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type' : "application/json"}
    })
    return result
}

async function setPartner(partnerUsername) {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/partnerships`, {
        method: "POST",
        headers: {'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type' : "application/json"},
        body: JSON.stringify({username : partnerUsername})
    })
    return result
}

export {getPartnerService,setPartner}