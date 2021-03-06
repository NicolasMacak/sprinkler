import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { PieChart } from "react-native-chart-kit";

const data = [
    {
        name: "Seould",
        population: 21500000,
        color: "rgba(131, 167, 234, 1)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Toronto",
        population: 2800000,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Beijing",
        population: 527612,
        color: "red",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "New York",
        population: 8538000,
        color: "#ffffff",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    },
    {
        name: "Moscow",
        population: 11920000,
        color: "rgb(0, 0, 255)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
    }
];

const chartConfig = {
    // backgroundGradientFrom: "#1E2923",
    // backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "#08130D",
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const CustomChartPie = props => {
    return <View style={styles.container}>

        <View style={styles.title}>

            <View style={styles.title}>
                <Text style={{ color: 'white', fontSize: 20 }} >{props.title}</Text>
            </View>
            <PieChart
                data={props.data}
                width={Dimensions.get("window").width}
                height={120}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                showLegend={false}
            />
        </View>
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15
    },
    title: {
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        flex: 1,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5b5963'
    }
});

export default CustomChartPie;

