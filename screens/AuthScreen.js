import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text, Button, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../components/Input';
import Card from '../components/Card';
import * as authActions from '../store/actions/auth';
import { COLORS } from '../data/constants';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    console.log("state", state);
    console.log("action", action);
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

const AuthScreen = props => {

    const dispatch = useDispatch();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

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

    const authHandler = async () => {
        let action;
        if (isSignUp) {
            action = authActions.signup(
                formState.inputValues.email,
                formState.inputValues.nickname,
                formState.inputValues.password
            )
        }
        else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            )
        }

        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
        }
        catch (err) {
            setError(err.message)
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (error) {
            console.log(error);
        }

    }, [error]);

    let isFormvalid = formState.inputValidities.email && formState.inputValidities.password;
    if (isSignUp && !formState.inputValidities.nickname) {
        isFormvalid = false;
    }

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

    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}>

            <LinearGradient colors={['#66ccff', '#2952ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="Email"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Zadajte valídny email"
                            initialValue=""
                            onInputChange={inputChangeHandler}

                        />

                        {isSignUp ? (
                            <Input
                                id="nickname"
                                label="Meno"
                                keyboardType="default"
                                required
                                autoCapitalize="words"
                                errorText="Toto pole nesmie byť prázdne"
                                initialValue=""
                                onInputChange={inputChangeHandler}

                            />
                        ) : <View></View>
                        }
                        <Input
                            id="password"
                            label="Heslo"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Zadajte valídne heslo"
                            initialValue=""
                            onInputChange={inputChangeHandler}
                        />
                        <View style={styles.buttonContainer}>


                            {isLoading ?
                                <ActivityIndicator
                                    size="small"
                                    color='white'
                                    style={{ backgroundColor: COLORS.authButton, height: '100%' }} /> :
                                <Button
                                    title={isSignUp ? "Registrovať" : "Prihlásiť"}
                                    onPress={authHandler}
                                    color={COLORS.authButton}
                                    disabled={!isFormvalid}

                                />
                            }


                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Prepnúť na ${isSignUp ? 'Prihlásenie' : 'Registráciu'}`}
                                onPress={() => {
                                    setIsSignUp(prevState => !prevState);
                                }} />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        margin: 10,
        height: 35
    }
});

export default AuthScreen;