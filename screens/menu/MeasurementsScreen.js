import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";

import Card from '../../components/Card';
import { measurements } from '../../data/dummyData';
import { COLORS } from '../../data/constants';


const MeasurementScreen = props => {

    const [measurmentsData, setMeasurementsData] = useState([]);

    const measurementsDataHandler = (response) => {
        if (measurmentsData.length > 0) {
            return;
        }

        setMeasurementsData([...response]);
        console.log(measurmentsData);
    };

    const renderHeader =

        <View style={styles.headerLine}>

            <View style={styles.column}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Vlhkosť vzduchu</Text>
            </View>
            <View style={{ ...styles.column, borderLeftWidth: 0 }}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Teplota vzduchu</Text>
            </View>
            <View style={styles.column}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Vlkhosť pôdy</Text>
            </View>
            <View style={styles.column}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Čas záznamu</Text>
            </View>

        </View>;

    const renderMeasurement = (measurement) => {

        return <View
            style={[{ flexDirection: 'row' }, measurement.index % 2 == 1 ? {} : styles.stripLine]}>

            <View style={styles.column}>
                <Text style={styles.itemText}>{measurement.item.airhum}</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.itemText}>{measurement.item.airtemp}</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.itemText}>{measurement.item.soilmoist}</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.itemText}>

                    {moment(measurement.item.createdAt).format("HH:mm")}

                </Text>
            </View>

        </View>
    };

    //  const getMeasurements = () => {

    fetch('http://35.206.95.251:80/measurements', {
        method: 'GET'
    })
        .then((response) => response.json())
        .then((responseJson) => {
            measurementsDataHandler(responseJson);
        })
        .catch((error) => {
            console.error(error);
        });
    //};

    // if (measurmentsData.length === 0) {


    //     getMeasurements();
    // }



    return (
        <View style={styles.gradient}>

            <Card style={styles.card}>


                {renderHeader}
                {/* <ActivityIndicator size={50} color="#0001ff" /> */}
                <FlatList
                    keyExtractor={(item, index) => item.id.toString()}
                    data={measurmentsData}
                    renderItem={renderMeasurement}
                />
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
    },
    gradient: {
        flex: 1,
        alignItems: 'center'
    },
    column: {
        flex: 1,
        paddingHorizontal: 1,
        marginBottom: 2
    },
    itemText: {
        fontSize: 15,
        textAlign: 'center'
    },
    headerLine: {
        flexDirection: 'row'
    },
    headerText: {
        color: '#73818b',
        fontWeight: 'bold'
    },
    stripLine: {
        backgroundColor: '#e9ecef'
    }
});

export default MeasurementScreen;