import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { LineChart } from "react-native-chart-kit";

const Graph = props => {
    return <View style={styles.container}>
        <Text>{props.title}</Text>
        <LineChart
            data={{
                labels: props.labels,
                datasets: [
                    {
                        data: props.data
                    }
                ]

            }}

            width={Dimensions.get("window").width * 0.9} // from react-native
            height={220}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: "green",
                backgroundGradientFrom: "red",
                // backgroundGradientTopacity: 0.5,
                backgroundGradientTo: "blue",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 2
            }}

        />
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
});

export default Graph;

