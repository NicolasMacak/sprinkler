import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Statistics = props => {
    return (
        <View style={styles.screen}>
            <Text>Statistics</Text>
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

export default Statistics;