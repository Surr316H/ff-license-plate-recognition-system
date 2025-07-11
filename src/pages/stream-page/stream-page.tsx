import { useState, useEffect, useCallback, useRef } from 'react';
import { LogOutIcon } from '../../assets';
import { RecordsTable, VideoStream } from './components';
import { useAuthStore } from '../../store/auth-store';
import { ROUTES } from '../../router/constants';
import { useNavigate } from 'react-router';
import type { LicensePlate } from './interface';
import { useGetWsData } from './use-get-ws-data';

export const StreamPage = () => {
  const [data, setData] = useState<LicensePlate[]>([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const isRealTimeEnabledRef = useRef(isRealTimeEnabled);

  const { userName, role, logout } = useAuthStore();
  const navigate = useNavigate();

  useGetWsData({ isRealTimeEnabledRef ,onSetData: setData })

  useEffect(() => {
    isRealTimeEnabledRef.current = isRealTimeEnabled;
  }, [isRealTimeEnabled]);
  
  const handleLogout = useCallback(() => {
    logout();
    navigate(ROUTES.AUTH_PAGE);
  }, [logout, navigate]);

  const toggleRealTime = useCallback(() => {
    setIsRealTimeEnabled(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">License Plate Recognition System</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {userName} ({ role })
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOutIcon />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VideoStream />
            
            <div className="mt-4 bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Real-time Updates</span>
                <button
                  onClick={toggleRealTime}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    isRealTimeEnabled 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {isRealTimeEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Total Records: {data.length}
              </div>
            </div>
          </div>

          <RecordsTable data={data} />
        </div>
      </div>
    </div>
  );
}