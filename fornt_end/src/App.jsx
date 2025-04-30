import { AuthProvider } from "./context/AuthContext"
import { ReservationCartProvider } from "./context/ReservationCartContext"
import AppRouter from "./router"

function App() {
  return (
    <div>
      <AuthProvider>
        <ReservationCartProvider>
          <AppRouter/>
        </ReservationCartProvider>
      </AuthProvider>
    </div>
  )
}

export default App
