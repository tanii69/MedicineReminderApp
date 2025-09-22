import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function MedicineItem({ medicine }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{medicine.name}</Text>
      <Text style={styles.sub}>Dose: {medicine.dose}</Text>
      <Text style={styles.sub}>Time: {medicine.timeHHMM}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
    card: {padding: 12, borderRadius: 12, backgroundColor: '#f2f2f2', marginBottom: 10},
    name: {fontSize:18, fontWeight: '600'},
    sub: {color: '#444', marginTop: 2},
});