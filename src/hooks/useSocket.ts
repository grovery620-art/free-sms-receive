import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(numberId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io();

    socketInstance.on('connect', () => {
      setIsConnected(true);
      if (numberId) {
        socketInstance.emit('join-number', numberId);
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [numberId]);

  return { socket, isConnected };
}
