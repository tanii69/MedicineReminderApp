import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import MedicineItem from '../component/MedicineItem';
import { cancelAllNotifications } from '../Services/Notification';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ReminderScreen() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('medicines')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const arr = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMeds(arr);
        },
        error => {
          console.error('Error loading medicines:', error);
        }
      );

    return () => unsubscribe();
  }, []);

  async function deleteMedicine(id) {
    const user = auth().currentUser;
    if (!user) return;

    Alert.alert(
      'Delete Medicine?',
      'This will remove this medicine and cancel its notifications.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('medicines')
                .doc(id)
                .delete();
              // (Optional) cancel specific notification if you saved IDs
            } catch (err) {
              console.error('Error deleting medicine:', err);
            }
          },
        },
      ]
    );
  }

  async function clearAll() {
    const user = auth().currentUser;
    if (!user) return;

    Alert.alert(
      'Clear All?',
      'This removes all medicines and cancels notifications.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const snapshot = await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('medicines')
                .get();

              const batch = firestore().batch();
              snapshot.docs.forEach(doc => batch.delete(doc.ref));
              await batch.commit();

              await cancelAllNotifications();
            } catch (err) {
              console.error('Error clearing medicines:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => deleteMedicine(id)}
    >
      <Text style={styles.deleteBtnText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Your Reminders</Text>
        <Text style={styles.subtitle}>Keep track of your medicines</Text>
      </View> */}

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={meds}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.card}>
              <MedicineItem medicine={item} />
            </View>
          </Swipeable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medicines yet.</Text>
            {/* <Text style={styles.emptySubText}>
              Add one using the tab below.
            </Text> */}
          </View>
        }
        keyExtractor={(item) => item.id}
      />

      {meds.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.countText}>Meds count: {meds.length}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySubText: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  clearBtn: {
    backgroundColor: '#052258ff',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  // deleteBtn: {
  //   backgroundColor: '#EF4444',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: 80,
  //   borderRadius: 16,
  //   marginVertical: 8,
  // },
  // deleteBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  countText: { textAlign: 'center', color: '#6B7280', marginBottom: 10 },
});