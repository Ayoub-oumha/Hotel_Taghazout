import { AuthProvider } from "./context/AuthContext"
import AppRouter from "./router"




function App() {


  
  return (
    <div>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </div>
  )
}

export default App
