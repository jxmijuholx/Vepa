import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase authentication
      console.log('User signed out successfully!');
      // Navigate back to the Auth screen after logout
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    marginBottom: 16,
    backgroundColor: '#3498db',
    borderRadius: 4,
    padding: 10,
  },
  buttonLogout: {
    width: '80%',
    marginBottom: 16,
    backgroundColor: '#FF0000',
    borderRadius: 4,
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Home;
