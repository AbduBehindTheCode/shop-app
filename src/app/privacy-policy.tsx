import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const PRIVACY_POLICY_TEXT = `# Privacy Policy

**Last Updated: December 13, 2025

## Introduction

Shoppy+ ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process personal information in connection with our mobile application and services.

## Information We Collect

We collect the following personal information when you create an account:

- **First Name** - Required for account identification
- **Last Name** - Required for account identification
- **Email Address** - Required for account communication
- **Phone Number** - Optional for account recovery and notifications
- **Address** - Optional

## How We Use Your Information

- Creating and managing your account
- Sending transactional emails
- Responding to customer support requests
- Improving our service
- Complying with legal obligations

## Data Security

We implement appropriate technical and organizational security measures to protect your personal information, including encrypted data transmission (SSL/TLS), secure authentication mechanisms, and secure backend infrastructure.

## Data Retention

We retain your personal information for as long as your account is active. When you request account deletion, we process your deletion request within 48 hours and permanently delete all personal data.

## Sharing of Information

We may share your personal information with:
- Service providers (email services)
- When required by law or regulation
- In case of business transfers

**We do not sell your personal information to third parties.**

## Your Privacy Rights

You have the right to:
- Access the personal information we hold about you
- Request a copy of your data
- Update or correct your information
- Delete your account anytime through the app

## Children's Privacy

Shoppy+ is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

## Contact Us

For questions about this Privacy Policy or our privacy practices:

**Email:** shoppy.dot.plus@gmail.com

We will respond to privacy inquiries within 30 days.

## GDPR (European Users)

If you are located in the EU/EEA, you have additional rights under GDPR including the right to be informed, right of access, right to rectification, right to erasure, and more.

## CCPA (California Users)

If you are a California resident, you have the right to know what personal information is collected, know whether your data is sold or disclosed, delete personal information, and non-discrimination for exercising your rights.

---

**© 2025 Shoppy+. All rights reserved.**

For the complete Privacy Policy, please contact us at shoppy.dot.plus@gmail.com`;

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {PRIVACY_POLICY_TEXT.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return (
                <Text key={index} style={styles.heading1}>
                  {line.replace('# ', '')}
                </Text>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <Text key={index} style={styles.heading2}>
                  {line.replace('## ', '')}
                </Text>
              );
            }
            if (line.startsWith('- ')) {
              return (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{line.replace('- ', '')}</Text>
                </View>
              );
            }
            if (line.startsWith('**')) {
              return (
                <Text key={index} style={styles.bold}>
                  {line}
                </Text>
              );
            }
            if (line.trim() === '') {
              return <View key={index} style={styles.spacer} />;
            }
            return (
              <Text key={index} style={styles.bodyText}>
                {line}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  backIcon: {
    fontSize: 32,
    color: '#333',
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 24,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginTop: 16,
  },
  bodyText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  spacer: {
    height: 12,
  },
});
