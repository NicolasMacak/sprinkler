import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from "moment";

import Card from '../../components/Card';
import { COLORS } from '../../data/constants';

let actualDay = null;

const MeasurementScreen = props => {

    const [measurmentsData, setMeasurementsData] = useState([]);
    const [endReached, setEndReached] = useState(false);

    const measurementsDataHandler = (response) => {

        if (response.length === 0) {
            setEndReached(true);
        }

        setMeasurementsData([...measurmentsData, ...response]);
    };

    const renderFooter = () => {
        return (
            !endReached ?
                <View>
                    <ActivityIndicator size={50} color={COLORS.MeasuremenHeader} />
                </View> : null
        );
    }


    const renderHeader =

        <View style={styles.headerLine}>

            <View style={styles.column}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Vlhkosť vzduchu</Text>
            </View>
            <View style={{ ...styles.column, borderLeftWidth: 0 }}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Teplota vzduchu  (°C)</Text>
            </View>
            <View style={styles.column}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Vlkhosť pôdy        (%)</Text>
            </View>
            <View style={styles.column}>
                <Text style={{ ...styles.itemText, ...styles.headerText }}>Čas záznamu</Text>
            </View>

        </View>;

    const renderRecord = (measurement) => {

        // let isNewDay = false;
        // const thisDay = moment(measurement.item.createdAt).format("DD");
        // console.log(thisDay);

        // if (actualDay !== thisDay) {
        //     isNewDay = true;
        //     actualDay = thisDay;
        // }
        // console.log(isNewDay);

        return <View style={styles.screen}>
            {/* 
            {isNewDay ?
                (<View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%', borderTopColor: 'black', borderTopWidth: 1, borderBottomColor: 'black', borderBottomWidth: 1 }]}>
                    <Text style={{ ...styles.itemText, ...styles.newDayText }}>{moment(measurement.item.createdAt).format("M. D. YYYY")}</Text>
                </View>) : null} */}

            <View
                style={[{ flexDirection: 'row' }, measurement.index % 2 == 1 ? {} : styles.stripLine]}>

                <View style={styles.column}>
                    <Text style={styles.itemText}>{measurement.item.airhum}</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.itemText}>{measurement.item.airtemp}</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.itemText}>{Math.floor((measurement.item.soilmoist - 300) / 300 * 100)}</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.itemText}>

                        {moment(measurement.item.createdAt).format("HH:mm")}

                    </Text>
                </View>

            </View>
        </View>
    };



    const getMeasurements = () => {

        fetch(`http://35.206.95.251:80/measurements?skip=${measurmentsData.length}&perPage=50`, {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => measurementsDataHandler(responseJson))
            .catch((error) => {
                console.error(error);
            })
    };

    useEffect(() => {
        getMeasurements();
    }, []);

    return (
        <View style={styles.screen}>

            <Card style={styles.card}>

                {renderHeader}
                <FlatList
                    keyExtractor={(item, index) => item.id.toString()}
                    data={measurmentsData}
                    renderItem={renderRecord}
                    ListFooterComponent={renderFooter}
                    onEndReached={!endReached ? getMeasurements : null}
                    onEndReachedThreshold={0.5}
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