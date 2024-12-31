import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  createGuestSession,
  getStoredGuestSession,
  isGuestSessionValid,
} from '../services/AuthService';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<{Home: undefined}>>();
  const errorMessage =
    'No se pudo crear la sesión. Por favor, revisa tu conexión a internet e intenta de nuevo.';
  useEffect(() => {
    const initializeSession = async () => {
      const storedSession = await getStoredGuestSession();
      if (storedSession && isGuestSessionValid(storedSession.expires_at)) {
        navigation.navigate('Home');
      } else {
        const newSession = await createGuestSession();
        if (newSession) {
          navigation.navigate('Home');
        } else {
          setLoading(false);
          alert(errorMessage);
        }
      }
    };
    initializeSession();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>
        Ocurrió un error al crear la sesión. Revisa tu conexión y reinicia la
        aplicación.
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default SplashScreen;
