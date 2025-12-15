import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.title}>Shop App</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.description}>
          Shop App helps you manage your household shopping lists, collaborate with family, and never forget an item again!
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developed by</Text>
          <Text style={styles.sectionText}>A&Y Family</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:support@shopapp.com')}>
            <Text style={styles.link}>support@shopapp.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { alignItems: 'center', padding: 32 },
  logo: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  version: { fontSize: 16, color: '#666', marginBottom: 16 },
  description: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 24 },
  section: { width: '100%', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  sectionText: { fontSize: 15, color: '#555' },
  link: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
});
