import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const RoleProtectedRoute = ({ children, allowedRoles }) => {
//   const { user } = useAuth();
  const {user , loading} = useContext(AuthContext) ;
  
  if(!loading){

    
  


  if (user) {
   
    if (!allowedRoles.includes(user.roles[0].name)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
  }
  if(!user){
    
    return <Navigate to="/login" replace />;
  }
}
  

  return children;
};

export default RoleProtectedRoute;
