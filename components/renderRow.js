import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const RenderedRow = props => {

    // console.log(props.item.item);

    const columnArray = Object.values(props.item.item)

    const row = columnArray.map(column => (
        <Text>{column}</Text>
    ));

    console.log(columnArray);

    return (
        <View style={{ flexDirection: 'row' }}>
            {row}
        </View>
    );
}

const styles = StyleSheet.create({

});

export default RenderedRow;