import {createStackNavigator} from '@react-navigation/stack';
import LobbyScreen from '../screens/LobbyScreen';
import {createStaticNavigation} from '@react-navigation/native';
import MovieDetails from '../screens/MovieDetails';
import SplashScreen from '../screens/SplashScreen';

export const StackNavigation = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'SplashScreen',
  screens: {
    Home: LobbyScreen,
    MovieDetails: MovieDetails,
    SplashScreen: SplashScreen,
  },
});

export const Navigation = createStaticNavigation(StackNavigation);
