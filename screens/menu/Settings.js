import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Button,
  Switch
} from 'react-native';

import Card from '../../components/Card';
import Input from '../../components/Input';
import { COLORS } from '../../data/constants';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGZlLmNvbSIsInVuaXF1ZV9uYW1lIjoiMSIsIm5iZiI6MTU4OTk3OTQyMiwiZXhwIjoxNTkwNTg0MjIyLCJpYXQiOjE1ODk5Nzk0MjJ9.iJNvbq7FyJB7fTLpt_vEtmUO-CQK8RQ0CFsCTc8Oi8k";

const formReducer = (state, action) => {
  console.log(state);
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const updateSettings = (newMail, newNickname) => {
  console.log(newMail, newNickname);
  fetch('http://35.206.95.251:80/users',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': token
      },
      body: JSON.stringify({
        "id": 1,
        "email": newMail,
        "nickname": newNickname,
        "userSettings": "{\"temperature\": 5}"
      })
    })
    .then((response) => response.json())
    .then((responseJson) => console.log(responseJson))
    .catch((error) => {
      console.error(error);
    })

};


const Settings = props => {
  // const [userSettings, setUserSettings] = useState({});
  const [isLoading, setIsLoading] = useState(false);



  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      nickname: '',
      password: ''
    },
    inputValidities: {
      email: false,
      nickname: false,
      password: false
    },
    formIsValid: false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const confirmSettingsHandler = () => {
    console.log("Handler");
    console.log(formState.inputValues.email,
      formState.inputValues.nickname);
    setIsLoading(true);
    updateSettings(
      formState.inputValues.email,
      formState.inputValues.nickname
    );
    setIsLoading(false);
  };

  // useEffect(() => {
  //   fetch('http://35.206.95.251:80/users', {
  //     method: 'GET', headers: {
  //       'Authorization': token
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => setUserSettings(responseJson))
  //     .catch((error) => {
  //       console.error(error);
  //     })
  // }, []);

  // console.log(userSettings);
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}>
      <Card style={styles.card}>

        {/* {
          Object.keys(userSettings).length === 0 ?
            (<ActivityIndicator size={50} color={COLORS.SettingsHeader} />) :
            ( */}

        <ScrollView>
          <View style={styles.userSettingsContainer}>
            <Input
              id="email"
              label="Email"
              keyboardType="email-address"
              email
              autoCapitalize="none"
              errorText="Zadajte valídny email"
              initialValue="test@tfe.com"
              onInputChange={inputChangeHandler}
            />

            <Input
              id="nickname"
              label="Meno"
              autoCapitalize="none"
              initialValue="Nicolas"
              onInputChange={inputChangeHandler}
            />

            {/* <Input
              id="password"
              label="Heslo"
              keyboardType="default"
              secureTextEntry
              minLength={5}
              autoCapitalize="none"
              errorText="Zadajte valídne heslo"
              onInputChange={inputChangeHandler}
            /> */}

            {isLoading ?
              <ActivityIndicator
                size="small"
                color='blue'
              //   style={{ backgroundColor: COLORS.authButton, height: '100%' }} 
              /> :
              <Button
                title="Potvrdiť"
                onPress={confirmSettingsHandler}
              // color={COLORS.authButton}
              //    disabled={!isFormvalid}

              />
            }

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              value={true}
            />
          </View>
        </ScrollView>

        {/* )} */}
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    width: '90%',
    height: '100%',
    maxWidth: 400,
    borderRadius: 0
  },
  userSettingsContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  }
});

export default Settings;
