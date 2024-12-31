import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  getRequestToken,
  getSessionId,
  getStoredSessionId,
} from '../services/AuthService';
import {Context} from '../utils/context/authContext';

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const {setSessionId} = useContext(Context);
  const navigation = useNavigation<NavigationProp<{Home: undefined}>>();

  const errorMessage =
    'No se pudo crear la sesión. Por favor, revisa tu conexión a internet e intenta de nuevo.';

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedSession = await getStoredSessionId();
        if (
          storedSession /*&& isGuestSessionValid(storedSession.expires_at)*/
        ) {
          setSessionId(storedSession);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Home'}],
            }),
          );
          // navigation.navigate('Home');
        } else {
          // Start authentication flow for a regular user
          const requestToken = await getRequestToken();
          if (requestToken) {
            setAuthUrl(
              `https://www.themoviedb.org/authenticate/${requestToken}`,
            );
          } else {
            setLoading(false);
            alert(errorMessage);
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        setLoading(false);
        alert(errorMessage);
      }
    };
    initializeSession();
  }, [navigation]);

  const handleWebViewNavigation = async (event: any) => {
    console.log('🤔   => handleWebViewNavigation => event:', event);
    const url = event.url;
    if (url.includes('/allow')) {
      const requestToken = url
        .split('https://www.themoviedb.org/authenticate/')
        .at(-1)
        .split('/allow')[0];
      const sessionId = await getSessionId(requestToken);
      if (sessionId) {
        setSessionId(sessionId);
        navigation.navigate('Home');
      } else {
        alert('Error al crear la sesión. Intenta nuevamente.');
      }
    }
  };

  if (loading && !authUrl) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (authUrl) {
    return (
      <WebView
        source={{uri: authUrl}}
        onNavigationStateChange={handleWebViewNavigation}
      />
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
