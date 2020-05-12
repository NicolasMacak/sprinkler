import React, { useState } from 'react';
import { View, Text, StyleSheet, Slider, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card';

const maxFlowValue = 50;

const FlowRegulation = props => {

  const [flowValue, setFlowValue] = useState(20);

  return (
    <LinearGradient colors={['#66ccff', '#2952ff']} style={styles.container}>

      <View style={[styles.loaderCover, { height: 100 - (flowValue / maxFlowValue * 100) + '%' }]}></View>

      <Card style={styles.shadowBox}>

        <Text style={styles.text}>Prietok vody</Text>
        <Text>{flowValue}</Text>

        <View style={{ width: '100%' }}>
          <Slider
            step={1}
            maximumValue={0}
            maximumValue={50}
            onValueChange={setFlowValue}
            value={flowValue}
            thumbTintColor='red'
            minimumTrackTintColor='purple'
            maximumTrackTintColor='green'
          />
        </View>

        <View style={{ width: 200, marginTop: 40 }}>
          <Button style={{ flex: 1 }} title='Potvrdiť' />
        </View>

      </Card>

    </LinearGradient>
  );
};

FlowRegulation.navigationOptions = {
  headerTitle: 'Regulácia toku'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  }, shadowBox: {
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    paddingVertical: 10
  },
  backgroundFill: {
    backgroundColor: '#7497b8',
    width: '100%',
    bottom: 0,
    position: 'absolute'
  },
  loaderCover: {
    backgroundColor: 'white',
    width: '100%',
    height: '50%',
    top: 0,
    position: 'absolute',
    zIndex: 1
  }
});

export default FlowRegulation;
