import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, Slider, Button, ActivityIndicator, ToastAndroid, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import CountDown from 'react-native-countdown-component';
import TimePicker from "react-native-modal-datetime-picker";

import Card from '../components/Card';
import { COLORS } from '../data/constants';

import moment from "moment";

const FROM_INPUT = 'FROM';
const TO_INPUT = 'TO';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_INITIALIZATION = 'FORM_INITIALIZATION';

const formReducer = (state, action) => {
  console.log(state, action);
  if (action.type === FORM_INPUT_UPDATE) {
    return {
      ...state,
      [action.inputId]: action.inputValue
    }
  }

  else if (action.type === FORM_INITIALIZATION) {
    return {
      wateringInterval: action.wateringInterval,
      criticalSoilMoist: action.criticalSoilMoist,
      fromTime: action.fromTime,
      toTime: action.toTime,
      countDown: action.countDown,
      nextWatering: action.nextWatering
    }
  };

  return state;
};


const FlowRegulation = props => {

  const [formState, dispatchFormState] = useReducer(formReducer, {
    wateringInterval: 50,
    criticalSoilMoist: 1,
    fromTime: new Date,
    toTime: new Date,
    nextWatering: new Date,
    countDown: 10,

  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickingInput, setTimePickingInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [counterId, setCounterId] = useState(0);

  const token = useSelector(state => state.auth.token);

  const getAutomaticWatering = () => {
    setIsLoading(true);

    fetch('http://35.206.95.251:80/Waterings/automatic', {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
      .then((response) => response.json())
      .then((response) => responseHandler(response))
      .catch((error) => {
        console.error(error);
      })

    setIsLoading(false);
  };

  useEffect(() => {
    getAutomaticWatering();
  }, []);

  const timeToSeconds = (time) => { return time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds() };



  const responseHandler = (response) => {
    const now = new Date();
    const startWatering = new Date(response.startTime);

    let nextWateringTime = startWatering;
    while (nextWateringTime < now) {
      nextWateringTime = moment(nextWateringTime).add(response.interval, 'seconds');
    }

    nextWateringTime = new Date(nextWateringTime);

    console.log(timeToSeconds(nextWateringTime) - timeToSeconds(now));

    dispatchFormState({
      type: FORM_INITIALIZATION,
      wateringInterval: Math.floor(response.interval / 60),
      criticalSoilMoist: Math.floor((response.criticalSoilMoist - 300) / 300 * 100),
      fromTime: response.startTime,
      toTime: response.endTime,
      nextWatering: nextWateringTime,
      countDown: timeToSeconds(nextWateringTime) - timeToSeconds(now)
    })
    setCounterId((Number(counterId) + 1).toString());
  }

  const useToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      0,
      200
    )
  }

  const setManual = () => {
    fetch('http://127.0.0.1:80/Waterings/manual',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({})
      }).then(() => {
        useToaster('Úspešne zaradené do ďalšieho cyklu')
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setAutomatic = () => {

    console.log("interval", formState.wateringInterval * 60, "critical", (formState.criticalSoilMoist / 100 * 300) + 300);

    fetch('http://35.206.95.251:80/Waterings/automatic',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          "interval": formState.wateringInterval * 60,
          "criticalSoilMoist": (formState.criticalSoilMoist / 100 * 300) + 300,
          "StartTime": formState.fromTime,
          "EndTime": formState.toTime
        })
      }).then(() => {
        useToaster('Automatická regulácia nastavená')
      })
      .catch((error) => {
        console.error(error);
      });

  };

  const handleTimePick = (date) => {

    if (timePickingInput === FROM_INPUT) {

      // if (timeToSeconds(new Date(date)) > timeToSeconds(formState.toTime)) {
      //   useToaster("Chybný interval");
      //   cancelPicker();
      //   return;
      // }

      cancelPicker();
      formUpdate('fromTime', moment(date).set('second', 0));
    }
    else if (timePickingInput === TO_INPUT) {

      // if (date < formState.fromTime) {
      //   useToaster("Chybný interval");
      //   cancelPicker();
      //   return;
      // }

      cancelPicker();
      formUpdate('toTime', date);
    }

  };

  const cancelPicker = () => setShowTimePicker(false);

  const formUpdate = (inputId, inputValue) => dispatchFormState({
    type: FORM_INPUT_UPDATE,
    inputId: inputId,
    inputValue: inputValue
  });

  const wateringIntervalHandler = (value) => { formUpdate('wateringInterval', value) };

  const criticalSoilMoistHandler = (value) => { formUpdate('criticalSoilMoist', value) };

  const handleEndOfCountDown = () => {

    formUpdate('countDown', formState.wateringInterval * 60);
    setCounterId((Number(counterId) + 1).toString());
    formUpdate('nextWatering', moment(formState.nextWatering).add(formState.wateringInterval, 'minutes'));
  };

  return (
    <View style={styles.container}>

      <Card style={styles.shadowBox}>
        <Text style={styles.text}>Ďalší zavlažovací proces: {moment(formState.nextWatering).format("HH:mm")}</Text>
        {/* <View style={styles.formControl}>
          <CountDown
            id={counterId.toString()}
            until={formState.countDown}
            size={30}
            onFinish={handleEndOfCountDown}
            digitStyle={{ backgroundColor: '#FFF' }}
            digitTxtStyle={{ color: COLORS.RegulationHeader }}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{ h: '', m: '', s: '' }}
          />
        </View>

        <View style={{ ...styles.rowButtonContainer, ...styles.formControl }}>
          <View style={{ width: 100 }}>
            <Button title={"Od " + moment(formState.fromTime).format("HH:mm")} onPress={() => {
              setShowTimePicker(true);
              setTimePickingInput(FROM_INPUT);
            }}
              color={COLORS.RegulationHeader}
            />
          </View>

          <View style={{ width: 100 }}>
            <Button title={"Do " + moment(formState.toTime).format("HH:mm")} onPress={() => {
              setShowTimePicker(true);
              setTimePickingInput(TO_INPUT);
            }}
              color={COLORS.RegulationHeader}
            />
          </View>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.text}>Dĺžka intervalu: {formState.wateringInterval} m</Text>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Slider
              step={1}
              minimumValue={1}
              maximumValue={300}
              onValueChange={wateringIntervalHandler}
              value={formState.wateringInterval}
              thumbTintColor={COLORS.RegulationHeader}
              minimumTrackTintColor={COLORS.RegulationHeader}
              maximumTrackTintColor='#aeaeae'
            />
          </View>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.text}>Ak je menej než: {formState.criticalSoilMoist} %</Text>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Slider
              step={1}
              minimumValue={0}
              maximumValue={40}
              onValueChange={criticalSoilMoistHandler}
              value={formState.criticalSoilMoist}
              thumbTintColor={COLORS.RegulationHeader}
              minimumTrackTintColor={COLORS.RegulationHeader}
              maximumTrackTintColor='#aeaeae'
            />
          </View>
        </View>

        <Button
          title="Nastaviť"
          color={COLORS.RegulationHeader}
          onPress={setAutomatic}
        />

        <View style={styles.manualButton}>
          <Button
            title="Zavlažiť manuálne"
            color={COLORS.RegulationHeader}
            onPress={setManual}
          />
        </View> */}

      </Card>

      <TimePicker
        value={new Date().getTime}
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleTimePick}
        onCancel={cancelPicker}
      />

    </View >
  );
};

FlowRegulation.navigationOptions = navigationData => {

  return {
    headerRight: () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="SignOut"
          iconName="power-off"
        />
      </HeaderButtons>

  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    marginBottom: 20,
    width: '100%'
  },
  rowButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  }, shadowBox: {
    width: '90%',
    height: '100%',
    alignItems: 'center',
    elevation: 5,
    paddingVertical: 10,
    borderRadius: 0
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
  }, switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25
  },
  manualButton: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10
  }
});

export default FlowRegulation;
