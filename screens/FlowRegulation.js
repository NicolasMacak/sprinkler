import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Slider, Button, ActivityIndicator, ToastAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/Card';

const maxFlowValue = 50;
let actualFlowValue = 0;
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGZlLmNvbSIsInVuaXF1ZV9uYW1lIjoiMSIsIm5iZiI6MTU4OTk3OTQyMiwiZXhwIjoxNTkwNTg0MjIyLCJpYXQiOjE1ODk5Nzk0MjJ9.iJNvbq7FyJB7fTLpt_vEtmUO-CQK8RQ0CFsCTc8Oi8k";


fetch('http://35.206.95.251:80/regulation/last', {
  method: 'GET',
  headers: {
    'Authorization': token
  }
})
  .then((response) => response.json())
  .then((responseJson) => {
    actualFlowValue = Number(responseJson);
  })
  .catch((error) => {
    console.error(error);
    throw error;
  });

const FlowRegulation = props => {

  const [flowValue, setFlowValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('http://35.206.95.251:80/regulation/last', {
      method: 'GET', headers: {
        'Authorization': token
      },
    })
      .then((response) => console.log(response.json()))
      // .then((responseJson) => setFlowValue(responseJson))
      .catch((error) => {
        console.error(error);
      })
  }, []);

  const postRegulation = () => {
    setIsLoading(true);

    fetch('http://35.206.95.251:80/regulation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          ModifiedById: 1,
          value: flowValue
        })
      }).then(() => {
        setIsLoading(false);

        ToastAndroid.showWithGravityAndOffset(
          "Tok " + flowValue + " úspešne nastavený!",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          0,
          200
        )
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });

  };

  return (
    <LinearGradient colors={['#66ccff', '#2952ff']} style={styles.container}>

      <View style={[styles.loaderCover, { height: 100 - (flowValue / maxFlowValue * 100) + '%' }]}></View>

      <Card style={styles.shadowBox}>

        <Text style={styles.text}>Prietok vody</Text>
        <Text style={styles.text}>Maximum: {maxFlowValue}</Text>
        <Text>{flowValue}</Text>

        <View style={{ width: '100%' }}>
          <Slider
            step={1}
            maximumValue={0}
            maximumValue={50}
            onValueChange={setFlowValue}
            value={flowValue}
            thumbTintColor='#2952ff'
            minimumTrackTintColor='#2952ff'
            maximumTrackTintColor='#aeaeae'
          />
        </View>

        <View style={{ width: 200, marginTop: 40 }}>
          {
            isLoading ? (
              <ActivityIndicator size="small" color="#0001ff" />
            ) : (
                <Button
                  style={{ flex: 1 }}
                  title='Potvrdiť'
                  onPress={postRegulation}
                />
              )
          }

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
