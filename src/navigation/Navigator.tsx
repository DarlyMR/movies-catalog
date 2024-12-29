import {createStackNavigator} from '@react-navigation/stack';
import LobbyScreen from '../screens/LobbyScreen';
import {createStaticNavigation} from '@react-navigation/native';

export const StackNavigation = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Home: LobbyScreen,
    // Profile: ProfileScreen,
  },
});

export const Navigation = createStaticNavigation(StackNavigation);
