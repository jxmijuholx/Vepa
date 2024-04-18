import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully!');
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Logout error:', error as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vepa</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TodoList')}>
        <Text style={styles.buttonText}>To-do list</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Journal')}>
        <Text style={styles.buttonText}>Journal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pomodoro')}> 
        <Text style={styles.buttonText}>Pomodoro</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0ead6',
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#654321',
  },
  button: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#8b4513',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  buttonLogout: {
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#8b0000', 
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Home;
