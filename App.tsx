import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MovieList from './Screens/Home.tsx';
import MovieDetail from './Screens/MovieDetail.tsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Favourites from './Screens/Favourites.tsx';


export type RootStackParamList = {
  Home: undefined;
  Favourites: undefined;
  MovieDetail: { movieId: number; title: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={"black"} />
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            name='Home'
            component={MovieList} />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={({ route }) => ({ title: route.params.title })}
          />
          <Stack.Screen
            name="Favourites"
            component={Favourites}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App