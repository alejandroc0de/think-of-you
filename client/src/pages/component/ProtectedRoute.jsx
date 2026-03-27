import {Outlet, Navigate} from 'react-router-dom'

// With this function i evaluate the token, if not token go to /login else go to Outlet

function ProtectedRoute(){

    const token = localStorage.getItem("token")
    if(!token){
        return <Navigate to = "/login" />;
    }else{
        return <Outlet /> // Render the children (Wrapped) in the App jsx 
    } 
}
export default ProtectedRoute