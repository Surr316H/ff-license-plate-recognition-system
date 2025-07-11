import { useState } from "react";
import { AlertTriangleIcon, EyeIcon, EyeOffIcon } from "../../../assets";
import { UserRole } from "../../../store/constants";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../router/constants";
import { useAuthStore } from "../../../store/auth-store";

const validCredentials = [
  { userName: 'admin', password: 'admin123', role: UserRole.ADMIN },
  { userName: 'operator', password: 'op123', role: UserRole.OPERATOR }
];

export const AuthForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore()
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    const credential = validCredentials.find(
      cred => cred.userName === userName && cred.password === password
    );

    if (credential) {
      login({
        userName: credential.userName,
        isAuthenticated: true,
        role: credential.role
      })
      
      navigate(ROUTES.STREAM_PAGE)
    } else {
      setError('Invalid credentials');
    }
  };


  return (
    <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
    
    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded flex items-center gap-2">
        <AlertTriangleIcon />
        {error}
      </div>
    )}
    
    <button
      onClick={handleSubmit}
      className={`w-full py-2 px-4 rounded-md font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white`}
    >
      Login
    </button>
  </div>
  )
}