import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('history')
      .orderBy('date', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(data);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>📜 History</Text>*/}
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>📅 {item.date}</Text>
            <Text>💧 Water: {item.water} glasses</Text>
            <Text>🚶 Steps: {item.steps}</Text>
            <Text>🛌 Sleep: {item.sleep} hrs</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No history yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8DC',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#F0FFF0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  date: {
    fontWeight: '700',
    marginBottom: 4,
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});