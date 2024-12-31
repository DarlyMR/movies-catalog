import {
  createStaticNavigation,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Button} from 'react-native';
import LobbyScreen from '../screens/LobbyScreen';
import MovieDetails from '../screens/MovieDetails';
import SplashScreen from '../screens/SplashScreen';
import FavoritesScreen from '../screens/FavoriteScreen';

export const StackNavigation = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  initialRouteName: 'SplashScreen',
  screens: {
    Home: {
      screen: LobbyScreen,
      options: {
        headerShown: true,
        headerBackTitleVisible: false,
        title: 'Vestíbulo de películas',
      },
    },
    MovieDetails: MovieDetails,
    SplashScreen: SplashScreen,
    FavoriteScreen: FavoritesScreen,
  },
});

export const Navigation = createStaticNavigation(StackNavigation);
