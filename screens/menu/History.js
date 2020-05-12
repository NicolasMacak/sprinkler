import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const History = props => {
  return (
    <View style={styles.screen}>
      <Text>Menu screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default History;
