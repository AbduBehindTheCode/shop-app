import React from 'react';
import { StyleSheet, Switch } from 'react-native';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#d1d1d1', true: '#81c784' }}
      thumbColor={value ? '#4CAF50' : '#f4f3f4'}
      ios_backgroundColor="#d1d1d1"
    />
  );
};

const styles = StyleSheet.create({
  // Styles can be added for custom toggle if needed
});
