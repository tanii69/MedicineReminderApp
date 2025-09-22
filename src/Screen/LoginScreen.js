import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = email => /\S+@\S+\.\S+/.test(email);

  const onLogin = async () => {
    if (!email || !password) return Alert.alert('Validation', 'Please enter both email and password.');
    if (!validateEmail(email)) return Alert.alert('Validation', 'Please enter a valid email address.');

    setLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Error', 'Please verify your email before logging in.');
        await auth().signOut();
        return;
      }

      // ✅ If verified, go to Main
      Alert.alert('Success', 'Logged in successfully!');
      navigation.replace('Main');

    } catch (error) {
      console.log(error);
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') message = 'No user found with this email.';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email format.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.sub}>Sign in with your Email</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Your e-mail address"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          style={[styles.input, { flex: 1 }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showBtn}>
          <Text style={{ color: '#007BFF' }}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Log In" onPress={onLogin} />
      )}

      {/* 🔹 Extra Signup button */}
      <Text style={styles.link} onPress={() => navigation.replace('SignUp')}>
        Don’t have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sub: {
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  showBtn: {
    marginLeft: 10,
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
});