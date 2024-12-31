import {API_KEY, API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Obtener un request token para iniciar el flujo de autenticación.
 */
export const getRequestToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_URL}/authentication/token/new?api_key=${API_KEY}`,
    );
    const data = await response.json();
    if (data.success) {
      return data.request_token;
    } else {
      throw new Error('Error al obtener el request token.');
    }
  } catch (error) {
    console.error('Error fetching request token:', error);
    return null;
  }
};

/**
 * Convertir un request token en un session ID.
 */
export const getSessionId = async (
  requestToken: string,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_URL}/authentication/session/new?api_key=${API_KEY}`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({request_token: requestToken}),
      },
    );
    const data = await response.json();
    if (data.success) {
      await AsyncStorage.setItem('sessionId', data.session_id);
      return data.session_id;
    } else {
      throw new Error('Error al convertir el request token en un session ID.');
    }
  } catch (error) {
    console.error('Error fetching session ID:', error);
    return null;
  }
};

/**
 * Obtener el session ID almacenado en AsyncStorage.
 */
export const getStoredSessionId = async (): Promise<string | null> => {
  try {
    const sessionId = await AsyncStorage.getItem('sessionId');
    return sessionId;
  } catch (error) {
    console.error('Error retrieving stored session ID:', error);
    return null;
  }
};

export const isSessionValid = (expiresAt: string): boolean => {
  const currentTime = new Date();
  const expiresAtTime = new Date(expiresAt);
  return currentTime < expiresAtTime;
};
