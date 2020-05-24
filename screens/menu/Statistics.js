import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import Card from '../../components/Card';
import Graph from '../../components/Graph';
import PieChart from '../../components/PieChart';

const Statistics = props => {
    return (
        <View style={styles.screen}>
            <Card style={styles.card}>
                <ScrollView>

                    <Text>Extremy</Text>
                    <Text>Extremy</Text>
                    <Text>Extremy</Text>
                    <Text>Extremy</Text>
                    <Graph
                        title="Vlhkosť vzduchu"
                        unit="m^3"
                        days={["16", "17", "18", "19", "20", "21", "22", "23"]}
                        data={[
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]}
                    />

                    <Graph
                        title="Teplota vzduchu"
                        unit="m^3"
                        days={["16", "17", "18", "19", "20", "21", "22", "23"]}
                        data={[
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]}
                    />

                    <Graph
                        title="Vlhkosť pôdy"
                        unit="m^3"
                        days={["16", "17", "18", "19", "20", "21", "22", "23"]}
                        data={[
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100,
                            Math.random() * 100
                        ]}
                    />

                    <PieChart
                        title="Prispievatelia"
                    />

                </ScrollView>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        height: '100%',
        maxWidth: 400,
        borderRadius: 0
    }, screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Statistics;