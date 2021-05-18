import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Crud from './pages/Crud';
import List from './pages/List';
import Header from './components/Header';

const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Navigator 
        screenOptions={{
          headerShown: false, 
          cardStyle: { backgroundColor: '#dcdcdc'}
        }}
      >
        <Screen 
          name="Menu" 
          component={Crud} 
          options={{
            headerShown: true,
            header: () => <Header name="Estudantes" type={0} />
          }} 
        />
        <Screen 
          name="Lista" 
          component={List}
          options={{
            headerShown: true,
            header: () => <Header name="Cleiton" type={1} />
          }} 
        />
      </Navigator>
    </NavigationContainer>
  );
}