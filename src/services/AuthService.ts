import {API_KEY, API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GuestSession} from '../utils/interfaces/guest-session';

export const createGuestSession = async (): Promise<GuestSession | null> => {
  try {
    const response = await fetch(
      `${API_URL}/authentication/guest_session/new?api_key=${API_KEY}`,
    );
    const data = await response.json();
    if (data.success) {
      const session: GuestSession = {
        guest_session_id: data.guest_session_id,
        expires_at: data.expires_at,
      };
      await AsyncStorage.setItem('guestSession', JSON.stringify(session));
      return session;
    } else {
      throw new Error('Error al crear la sesión de invitado');
    }
  } catch (error) {
    console.error('Error creating guest session:', error);
    return null;
  }
};

export const getStoredGuestSession = async (): Promise<GuestSession | null> => {
  try {
    const sessionString = await AsyncStorage.getItem('guestSession');
    if (sessionString) {
      return JSON.parse(sessionString);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving stored guest session:', error);
    return null;
  }
};

export const isGuestSessionValid = (expiresAt: string): boolean => {
  const currentTime = new Date();
  const expiresAtTime = new Date(expiresAt);
  return currentTime < expiresAtTime;
};
