import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../firebaseConfig';

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully!');
      }
      navigation.navigate('Home');
    } catch (error) {
      console.error('Authentication error:', error as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
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
    fontSize: 24,
    marginBottom: 20,
    color: '#654321',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#654321',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 16,
  },
  toggleText: {
    color: '#8b4513',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
});

export default AuthScreen;
