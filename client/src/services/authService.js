
// This is a function to communicate with the backend and keep the jsx cleaner

async function loginService(username,password) {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`,{
        method:"POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({username : username, password : password})
    });
    return result
}


async function registerService(name,username,password) {
    const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
        method:"POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({name : name, username: username, password: password})
    });
    return result
}

export {loginService,registerService} // Sintaxis to export both functions 
