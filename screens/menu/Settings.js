import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Switch,
  TouchableHighlight,
  ToastAndroid
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import Card from '../../components/Card';
import Input from '../../components/Input';
import { COLORS, WateringsTypes } from '../../data/constants';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
import { update } from '../../store/actions/auth';
import auth from '../../store/reducers/auth';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from 'react-native-elements';

const formReducer = (state, action) => {

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

// Automatic 0, Manual 1, Critical 2 
const Settings = props => {
  // const [userSettings, setUserSettings] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const initialFillAutomaticRegulation = useSelector(state => state.auth.fillAutomaticRegulation) !== undefined ? useSelector(state => state.auth.fillAutomaticRegulation) : false;
  const initialAllowedWaterings = useSelector(state => state.auth.allowedWateringTypes) !== undefined ? useSelector(state => state.auth.allowedWateringTypes) : false;
  const userId = useSelector(state => state.auth.userId);
  const token = useSelector(state => state.auth.token);

  const dispatch = useDispatch();

  const [fillAutomaticRegulation, setFillAutomaticReg] = useState(initialFillAutomaticRegulation);
  const [allowedWaterings, setAllowedWaterings] = useState(initialAllowedWaterings);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: useSelector(state => state.auth.mail),
      nickname: useSelector(state => state.auth.nickname)
    },
    inputValidities: {
      nickname: true
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

  const handleAllowedTypes = (allowedType) => {

    if (allowedWaterings.includes(allowedType)) {

      let tmpFiled = allowedWaterings;
      tmpFiled = tmpFiled.filter(iterator => iterator !== allowedType);

      if (tmpFiled.length === 0) {
        useToaster("Musí byť zvolený aspoň 1 typ regulácie");
        return;
      }

      setAllowedWaterings(tmpFiled);
    }
    else {

      setAllowedWaterings([...allowedWaterings, allowedType]);
    }

  };

  const useToaster = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      0,
      200
    )
  };

  const confirmSettingsHandler = useCallback(() => {

    dispatch(update(
      userId,
      token,
      formState.inputValues.email,
      formState.inputValues.nickname,
      allowedWaterings,
      fillAutomaticRegulation
    ));

    useToaster("Nastavenia aktualizované");

  }, [dispatch, formState, allowedWaterings, fillAutomaticRegulation]);

  useEffect(() => {

    const failMessage = () => useToaster("Zadajte valídne meno");
    props.navigation.setParams({ putSettings: formState.inputValidities.nickname ? confirmSettingsHandler : failMessage });
  }, [confirmSettingsHandler]);

  return (
    <View
      // behavior="padding"
      // keyboardVerticalOffset={50}
      style={styles.screen}>
      <Card style={styles.card}>
        <ScrollView style={styles.userSettingsContainer}>
          {/* <Input
            id="email"
            label="Email"
            keyboardType="email-address"
            email
            autoCapitalize="none"
            errorText="Zadajte valídny email"
            initialValue={formState.inputValues.email}
            onInputChange={inputChangeHandler}
          /> */}
          <Input
            id="nickname"
            label="Prezývka"
            autoCapitalize="none"
            minLength={3}
            errorText="Meno musí mať aspoň 3 písmená"
            initialValue={formState.inputValues.nickname}
            onInputChange={inputChangeHandler}
          />

          {/* <View style={styles.switchContainer}>
            <Text>Predvyplniť reguláciu</Text>
            <Switch
              trackColor={{ false: "#D3D3D3", true: "#81b0ff" }}
              thumbColor={COLORS.SettingsHeader}
              onValueChange={() => { setFillAutomaticReg(previousState => !previousState) }}
              value={fillAutomaticRegulation} />
          </View> */}

          <View style={{ marginTop: 25 }}>
            <Text>Typy zavlažení na zobrazenie</Text>
            <View style={styles.checkboxContainer}>
              <CheckBox
                title='Automatické'
                containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                onPress={() => handleAllowedTypes(WateringsTypes.AUTOMATIC)}
                checkedColor={COLORS.SettingsHeader}
                checked={allowedWaterings.includes(WateringsTypes.AUTOMATIC)}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <CheckBox
                title='Manuálne'
                containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                onPress={() => handleAllowedTypes(WateringsTypes.MANUAL)}
                checkedColor={COLORS.SettingsHeader}
                checked={allowedWaterings.includes(WateringsTypes.MANUAL)}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <CheckBox
                title='Kritické'
                containerStyle={{ backgroundColor: 'white', borderWidth: 0 }}
                onPress={() => handleAllowedTypes(WateringsTypes.CRITICAL)}
                checkedColor={COLORS.SettingsHeader}
                checked={allowedWaterings.includes(WateringsTypes.CRITICAL)}
              />
            </View>
          </View>

        </ScrollView>
      </Card>
    </View>
  );
};


Settings.navigationOptions = navigationData => {

  const putSettings = navigationData.navigation.getParam('putSettings');
  return {
    headerRight: () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Favorite"
          iconName="save"
          onPress={putSettings}
        />
      </HeaderButtons>

  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    // height: '100%'
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
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
    padding: 20
  }
});

export default Settings;
