import { 
  useCallback, 
  useEffect, 
  useRef, 
  type Dispatch, 
  type RefObject, 
  type SetStateAction
} from "react";
import type { LicensePlate } from "./interface";

interface UseGetWsDataProps {
  isRealTimeEnabledRef: RefObject<boolean>
  onSetData: Dispatch<SetStateAction<LicensePlate[]>>
}

export const useGetWsData = ({ isRealTimeEnabledRef, onSetData }: UseGetWsDataProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const addLicensePlateData = useCallback((newData: LicensePlate) => {
    onSetData(prevData => {
      const isDuplicate = prevData.some(item => 
        item.id === newData.id
      );
      
      if (isDuplicate) return prevData;
      
      const maxRecords = 1000;
      const newArray = [newData, ...prevData];
      
      return newArray.length > maxRecords 
        ? newArray.slice(0, maxRecords)
        : newArray;
    });
  }, []);
  
  
  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      try {
        const ws = new WebSocket('ws://localhost:3000');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'licenseplate') {
              if (isRealTimeEnabledRef.current) {
                addLicensePlateData(message.data);
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          wsRef.current = null;
          
          if (isRealTimeEnabledRef.current && event.code !== 1000 && !reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('Attempting to reconnect...');
              connectWebSocket();
            }, 3000);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);
}