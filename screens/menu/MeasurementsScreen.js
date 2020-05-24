import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";

import Card from '../../components/Card';
import { measurements } from '../../data/dummyData';
import { COLORS } from '../../data/constants';

let actualDay = null;
const MeasurementScreen = props => {

    const [measurmentsData, setMeasurementsData] = useState([]);

    const measurementsDataHandler = (response) => {

        setMeasurementsData([...response, ...measurements]);
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

    const renderRecord = (measurement) => {

        let isNewDay = false;
        let thisDay = moment(measurement.item.createdAt).format("DD");

        if (actualDay !== thisDay) {
            isNewDay = true;
            actualDay = thisDay;
        }

        return <View style={styles.screen}>

            {isNewDay ? (<View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%', borderTopColor: 'black', borderTopWidth: 1, borderBottomColor: 'black', borderBottomWidth: 1 }]}>
                <Text style={{ ...styles.itemText, ...styles.newDayText }}>{moment(measurement.item.createdAt).format("M. D. YYYY")}</Text>
            </View>) : null}

            <View
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
        </View>
    };

    useEffect(() => {
        fetch('http://35.206.95.251:80/measurements', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => measurementsDataHandler(responseJson))
            .catch((error) => {
                console.error(error);
            })
    }, []);

    return (
        <View style={styles.screen}>

            <Card style={styles.card}>


                {renderHeader}
                {
                    measurmentsData.length === 0 ?
                        (<ActivityIndicator size={50} color={COLORS.MeasuremenHeader} />) :
                        (
                            <FlatList
                                keyExtractor={(item, index) => item.id.toString()}
                                data={measurmentsData}
                                renderItem={renderRecord}
                            />
                        )
                }
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
    screen: {
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
        textAlign: 'center',
        width: '100%'
    },
    newDayText: {
        color: 'gray'
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