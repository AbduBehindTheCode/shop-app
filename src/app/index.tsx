import { useAppSelector } from '@/store/store';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Index() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);



  // Redirect based on auth state
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/login'} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});
