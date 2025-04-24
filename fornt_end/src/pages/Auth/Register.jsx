import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    password_confirmation: "" 
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const {login} = useContext(AuthContext);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputs({...inputs, [name]: value});
  };

  const validate = () => {
    const newErrors = {};
    
    if(!inputs.name || inputs.name.length < 3) {
      newErrors.name = 'Nom complet requis (3 caractères minimum)';
    }

    if(!inputs.email) {
      newErrors.email = 'Email invalide';
    }
    else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if(!inputs.password || inputs.password.length < 8) {
      newErrors.password = 'Mot de passe requis (8 caractères minimum)';
    }

    if(inputs.password !== inputs.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  async function registerFunc() {
    try {
      let res = await api.post("/register", inputs);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // Handle validation errors from Laravel backend
        const validationErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          validationErrors[key] = err.response.data.errors[key][0];
        });
        setErrors(validationErrors);
      } else {
        // Generic error message
        setServerError("Échec de l'inscription. Veuillez réessayer ultérieurement.");
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      registerFunc();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join us to receive exclusive offers and updates
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={inputs.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46] sm:text-sm`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={inputs.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46] sm:text-sm`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={inputs.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46] sm:text-sm`}
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={inputs.password_confirmation}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C6A46] focus:border-[#7C6A46] sm:text-sm`}
                  placeholder="Confirm your password"
                />
                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            </div>

            {serverError && <p className="mt-4 text-sm text-red-600">{serverError}</p>}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7C6A46] hover:bg-[#907c52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C6A46] transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#7C6A46] hover:text-[#907c52]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative area */}
      <div className="hidden md:flex md:w-1/2 bg-[#7C6A46] flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Hotel Taghazout</h1>
          <p className="text-xl mb-8">Join our community and unlock exclusive benefits.</p>
          <div className="h-1 w-20 bg-white rounded-full mb-8"></div>
          <p className="text-sm opacity-80">
            Register today to manage your bookings, access special rates, receive personalized recommendations, and enjoy a seamless experience with Taghazout Hub.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;