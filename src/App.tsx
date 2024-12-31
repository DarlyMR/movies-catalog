/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Navigation} from './navigation/Navigator';
import {AppContextProvider} from './utils/context/authContext';

function App(): React.JSX.Element {
  return (
    <AppContextProvider>
      <Navigation />
    </AppContextProvider>
  );
}

export default App;
