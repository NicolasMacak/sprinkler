import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { View, Text, StyleSheet, Slider, Button, ActivityIndicator, ToastAndroid, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import CountDown from 'react-native-countdown-component';
import TimePicker from "react-native-modal-datetime-picker";
import { useIsFocused } from '@react-navigation/native';

import Card from '../components/Card';
import { COLORS } from '../data/constants';
import * as Time from '../data/Time';

import moment from "moment";

const FROM_INPUT = 'FROM';
const TO_INPUT = 'TO';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_INITIALIZATION = 'FORM_INITIALIZATION';
const SLIDER_UPDATE = 'SLIDER_UPDATE';

const formReducer = (state, action) => {

  if (action.type === SLIDER_UPDATE) {

    return {
      ...state,
      [action.inputId]: action.inputValue
    };
  }

  else if (action.type === FORM_INPUT_UPDATE) {
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
    wateringInterval: 60,
    criticalSoilMoist: 1,
    fromTime: "2020-06-14T06:00:00.833Z",
    toTime: "2020-06-14T16:00:00.833Z",
    nextWatering: new Date,
    countDown: 10,

  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickingInput, setTimePickingInput] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [counterId, setCounterId] = useState(0);

  const token = useSelector(state => state.auth.token);

  // const switchFillAutomaticRegulation = () => {
  // };


  const getAutomaticWatering = () => {

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

  };

  useEffect(() => {

    getAutomaticWatering();
  }, []);

  const whenIsNextWatering = (starWateringTime, endWateringTime, interval) => {

    const now = Time.now();
    let nextWateringTime = starWateringTime;
    let countDown = null;

    // dalsie polievanie
    while (nextWateringTime < now) {
      nextWateringTime = moment(nextWateringTime).add(interval, 'seconds');
    }

    nextWateringTime = new Date(nextWateringTime);

    if (nextWateringTime > endWateringTime) {

      nextWateringTime = starWateringTime;
      countDown = 86400 - Time.timeToSeconds(now) + Time.timeToSeconds(starWateringTime);
    } else {

      countDown = Time.timeToSeconds(nextWateringTime) - Time.timeToSeconds(now);
    }

    return {
      time: nextWateringTime,
      countDown: countDown
    };

  };

  const responseHandler = (response) => {
    const startWatering = Time.correctDate(response.startTime);
    const endWatering = Time.correctDate(response.endTime);

    const nextWateringInfo = whenIsNextWatering(startWatering, endWatering, response.interval);

    dispatchFormState({
      type: FORM_INITIALIZATION,
      wateringInterval: Math.floor(response.interval / 60),
      criticalSoilMoist: Math.floor((response.criticalSoilMoist - 300) / 300 * 100),
      fromTime: startWatering,
      toTime: endWatering,
      nextWatering: nextWateringInfo.time,
      countDown: nextWateringInfo.countDown
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
  };

  const setManual = () => {

    fetch('http://35.206.95.251:80/Waterings/manual',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({})
      })
      .then(() => useToaster('Uspešne nastavené'))
      .catch((error) => {
        console.error(error);
      });
  };

  const setAutomatic = () => {

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
      }).then(response => response.json())
      .then((response) => {
        useToaster('Úspešne nastavené!');
        responseHandler(response);
      })
      .catch((error) => {
        console.error(error);
      });

  };

  const handleTimePick = (date) => {
    date = Time.shift(date);

    if (timePickingInput === FROM_INPUT) {

      // zaciatok za koncom
      if (moment(date).isAfter(formState.toTime)) {
        cancelPicker();
        useToaster("Nesprávne zvolený rozsah");
        return;
      }

      cancelPicker();
      formUpdate('fromTime', moment(date));
    }
    else if (timePickingInput === TO_INPUT) {

      // koniec pred zaciatkom
      if (moment(date).isBefore(formState.fromTime)) {
        cancelPicker();
        useToaster("Nesprávne zvolený rozsah");
        return;
      }


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

  const wateringIntervalHandler = (value) => {
    dispatchFormState({
      type: SLIDER_UPDATE,
      inputId: 'wateringInterval',
      inputValue: value
    })
  };

  const criticalSoilMoistHandler = (value) => {
    dispatchFormState({
      type: SLIDER_UPDATE,
      inputId: 'criticalSoilMoist',
      inputValue: value
    })
  };

  const handleEndOfCountDown = () => {

    formUpdate('countDown', formState.wateringInterval * 60);
    setCounterId((Number(counterId) + 1).toString());
    formUpdate('nextWatering', moment(formState.nextWatering).add(formState.wateringInterval, 'minutes'));
  };

  return (
    <View style={styles.container}>

      <Card style={styles.shadowBox}>
        <Text style={styles.text}>Ďalšie zalievanie: {Time.format(formState.nextWatering)}</Text>
        <View style={styles.formControl}>
          <CountDown
            id={counterId.toString()}
            until={formState.countDown}
            size={30}
            onFinish={handleEndOfCountDown}
            // onPress={() => { setCounterId((Number(counterId) + 1).toString()); }}
            digitStyle={{ backgroundColor: '#FFF' }}
            digitTxtStyle={{ color: COLORS.RegulationHeader }}
            timeToShow={['H', 'M', 'S']}
            timeLabels={{ h: '', m: '', s: '' }}
          />
        </View>

        <View style={{ ...styles.rowButtonContainer, ...styles.formControl }}>
          <View style={{ width: 100 }}>
            <Button title={"Od " + Time.format(formState.fromTime)} onPress={() => {
              setShowTimePicker(true);
              setTimePickingInput(FROM_INPUT);
            }}
              color={COLORS.RegulationHeader}
            />
          </View>

          <View style={{ width: 100 }}>
            <Button title={"Do " + Time.format(formState.toTime)} onPress={() => {
              setShowTimePicker(true);
              setTimePickingInput(TO_INPUT);
            }}
              color={COLORS.RegulationHeader}
            />
          </View>
        </View>

        <View style={styles.formControl}>
          <Text style={styles.text}>Zaliať vždy po: {formState.wateringInterval} min</Text>

          <View style={{ width: '100%', marginTop: 20 }}>
            <Slider
              step={1}
              minimumValue={3}
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
          <Text style={styles.text}>Ak je vlhkosť pôdy menej než: {formState.criticalSoilMoist} %</Text>

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
        </View>

      </Card>

      <TimePicker
        value={new Date().getTime}
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleTimePick}
        onCancel={cancelPicker}
        date={timePickingInput === FROM_INPUT ? Time.shift(formState.fromTime, -2) : Time.shift(formState.toTime, -2)}
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
          onPress={() => navigationData.navigation.navigate('Auth')}
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
