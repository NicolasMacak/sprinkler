import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../components/Input';
import Card from '../components/Card';

const AuthScreen = props => {


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
                            errorMessage="Zadajte valídny email"
                            initialValue=""
                        />

                        <Input
                            id="password"
                            label="Heslo"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorMessage="Zadajte valídne heslo"
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Prihlásiť" onPress={() => { }} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Registrácia" onPress={() => { }} />
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
        margin: 10
    }
});

export default AuthScreen;