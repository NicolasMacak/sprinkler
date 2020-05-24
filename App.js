import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import AdditionalScreenNavigator from './navigation/ScreensNavigator';
import AuthScreen from './screens/AuthScreen';
import authReducer from './store/reducers/auth';

const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (

    // <MeasurementScreen />
    // <Provider store={store}>
    //   <AuthScreen />
    // </Provider>


    //   <Provider store={store}>
    <AdditionalScreenNavigator />
    // </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
