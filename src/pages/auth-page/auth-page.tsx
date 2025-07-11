import { AuthForm } from "./components"

export const AuthPage = () => {  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-center mb-6">License Plate Recognition System</h1>
          <AuthForm />
          <div className="mt-4 text-sm text-gray-600">
            <p>Demo credentials:</p>
            <p>Admin: admin / admin123</p>
            <p>Operator: operator / op123</p>
          </div>
        </div>
      </div>
    );
}