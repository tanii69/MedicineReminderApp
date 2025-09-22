import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFEFD5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#4B0082',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    width: 100,
    backgroundColor: '#F3F4F6',
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2f417aff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 20,
  },
});

export default function DashBoardScreen() {
  const [stats, setStats] = useState({});
  const [todayCount, setTodayCount] = useState({
    water: 0,
    steps: 0,
    sleep: 0,
  });

  const todayKey = () => new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Load last 7 days stats from Firestore
  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      console.error("No logged-in user!");
      return;
    }

    console.log("Listening to history for user:", user.uid);

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('history')
      .orderBy('date', 'desc')
      .limit(7)
      .onSnapshot(
        snapshot => {
          if (!snapshot) {
            console.warn("Snapshot is null");
            return;
          }

          if (snapshot.empty) {
            console.log("No history data found.");
            setStats({});
            setTodayCount({ water: 0, steps: 0, sleep: 0 });
            return;
          }

          let tempStats = {};
          snapshot.forEach(doc => {
            tempStats[doc.id] = doc.data();
          });

          setStats(tempStats);

          const k = todayKey();
          setTodayCount(tempStats[k] || { water: 0, steps: 0, sleep: 0 });
        },
        error => {
          console.error("Firestore onSnapshot error:", error);
        }
      );

    return () => unsubscribe();
  }, []);

  // Save today's data to Firestore
  async function saveToday() {
    const user = auth().currentUser;
    if (!user) return Alert.alert("Error", "User not logged in");

    const k = todayKey();

    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('history')
        .doc(k)
        .set({
          ...todayCount,
          date: k,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert("Success", "Today's stats saved!");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  // Last 7 days keys
  const keys = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const waterSeries = keys.map(k => stats[k]?.water ?? 0);
  const stepsSeries = keys.map(k => stats[k]?.steps ?? 0);
  const sleepSeries = keys.map(k => stats[k]?.sleep ?? 0);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>📊 Today's Health Summary</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>💧 Water (glasses)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(todayCount.water)}
            onChangeText={text =>
              setTodayCount({ ...todayCount, water: text === '' ? 0 : Number(text) })
            }
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🚶 Steps</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(todayCount.steps)}
            onChangeText={text =>
              setTodayCount({ ...todayCount, steps: text === '' ? 0 : Number(text) })
            }
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>🛌 Sleep (hours)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(todayCount.sleep)}
            onChangeText={text =>
              setTodayCount({ ...todayCount, sleep: text === '' ? 0 : Number(text) })
            }
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={saveToday}>
          <Text style={styles.buttonText}>💾 Save Today's Stats</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.chartTitle}>📈 Water Intake - Last 7 Days</Text>
      <LineChart
        data={{
          labels: keys.map(k => k.slice(5)), // MM-DD
          datasets: [{ data: waterSeries }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=" 💧"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#e0f2fe',
          backgroundGradientTo: '#bae6fd',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#87a0d6ff',
          },
        }}
        style={{ borderRadius: 16, marginBottom: 16 }}
      />

      <Text style={styles.chartTitle}>📈 Steps - Last 7 Days</Text>
      <LineChart
        data={{
          labels: keys.map(k => k.slice(5)),
          datasets: [{ data: stepsSeries }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=" 🚶"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#e0f2fe',
          backgroundGradientTo: '#bae6fd',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#2563EB',
          },
        }}
        style={{ borderRadius: 16, marginBottom: 16 }}
      />

      <Text style={styles.chartTitle}>📈 Sleep - Last 7 Days</Text>
      <LineChart
        data={{
          labels: keys.map(k => k.slice(5)),
          datasets: [{ data: sleepSeries }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=" 💤"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#e0f2fe',
          backgroundGradientTo: '#bae6fd',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#2563EB',
          },
        }}
        style={{ borderRadius: 16, marginBottom: 16 }}
      />
    </ScrollView>
  );
}