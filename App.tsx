import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AuthScreen from './components/AuthScreen';
import Home from './components/Home';
import Journal from './components/Journal';
import Pomodoro from './components/Pomodoro';
import TodoList from './components/TodoList';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="TodoList" component={TodoList} /> 
        <Stack.Screen name="Journal" component={Journal} />
        <Stack.Screen name="Pomodoro" component={Pomodoro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
