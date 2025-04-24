import axios from "axios";

// Créer une instance de l'historique de navigation que nous pourrons importer
let navigate;
export const setNavigator = (nav) => {
    navigate = nav;
};

const api = axios.create({
    baseURL : 'http://localhost:8000/api' ,
    withCredentials : true 
})

// Request interceptor - simplifié
api.interceptors.request.use(
    async (config) => {
        // JWT token for authenticated requests
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - simplifié
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Utiliser navigate si disponible, sinon window.location comme solution de secours
            if (navigate) {
                navigate('/login');
            } else {
                // Fallback si navigate n'est pas encore défini
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;