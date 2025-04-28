import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const RoleProtectedRoute = ({ children, allowedRoles }) => {
//   const { user } = useAuth();
  const {user , loading} = useContext(AuthContext) ;
  
  if(!loading){
  if (user) {
  //  console.log(user.role)
    if (!allowedRoles.includes(user.role)) {
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
