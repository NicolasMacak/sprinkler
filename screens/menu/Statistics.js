import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Card from '../../components/Card';
import Graph from '../../components/Graph';
import PieChart from '../../components/PieChart';
import { COLORS } from '../../data/constants';


const Statistics = props => {

    const [days, setDays] = useState([]);
    const [statistics, setStatistics] = useState();
    const [ratioData, setRatioData] = useState();

    const token = useSelector(state => state.auth.token);

    // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // console.log(randomColor);

    //pieChartHandler
    const ratioDataHandler = (response) => {

        let tmpRatioData = [];
        const colors = ['#ff0000', '#660066', '#008080', '#00ffff', '#00ff00', '#088da5', '#ffa500'];
        console.log(response);

        for (let i = 0; i < response.userRatio.length; i++) {

            if (response.userRatio[i].nickname == null) {
                continue;
            }

            const color = i < colors.length ? colors[i] : '#' + Math.floor(Math.random() * 16777215).toString(16)
            tmpRatioData = [...tmpRatioData,
            {
                name: response.userRatio[i].nickname,
                population: response.userRatio[i].count,
                color: color,
                legendFontColor: "white",
                legendFontSize: 15
            }];
        }

        const wateringTypeRatio = [
            {
                name: 'Automatické',
                population: response.numberOfAutomatic,
                color: '#40e0d0',
                legendFontColor: "white",
                legendFontSize: 15
            },
            {
                name: 'Manuálne',
                population: response.numberOfManual,
                color: '#576675',
                legendFontColor: "white",
                legendFontSize: 15
            },
            {
                name: 'Kritické',
                population: response.numberOfCritical,
                color: '#ff0000',
                legendFontColor: "white",
                legendFontSize: 15
            }
        ];



        // console.log(tmpRatioData);
        setRatioData({
            userRatio: tmpRatioData,
            wateringTypeRatio: wateringTypeRatio
        });

        console.log(ratioData);

    };

    const daysHandler = (lastDay, daysCount) => {

        let tmpDays = [];

        for (let i = 0; i < daysCount; i++) {
            tmpDays = [moment(lastDay).add(-i, 'days').format('D'), ...tmpDays];
        }

        setDays([...tmpDays]);
    };

    const statisticsDataHandler = (response) => {

        let tmpHum = [];
        let tmpTmp = [];
        let tmpSoil = [];
        let days = [];

        for (let i = 0; i < response.length; i++) {

            tmpHum = [...tmpHum, response[i].airHumidity];
            tmpTmp = [...tmpTmp, response[i].airTemperature];
            tmpSoil = [...tmpSoil, (response[i].soilMoisture - 300) / 300 * 100];
            days = [...days, moment(response[i].date).format('D.')];

        }

        setStatistics(
            {
                airHumidity: tmpHum,
                airTemperature: tmpTmp,
                soilMoisture: tmpSoil,
                days: days
            }
        );

        // fetch('http://35.206.95.251:80/measurements/lastday', {
        //     method: 'GET'
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => daysHandler(responseJson, response.length))
        //     .catch((error) => {
        //         console.error(error);
        //     });
    };

    useEffect(() => {
        fetch('http://35.206.95.251:80/measurements/statistics', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((responseJson) => statisticsDataHandler(responseJson))
            .catch((error) => {
                console.error(error);
            });

        fetch('http://35.206.95.251:80/Waterings/WateringStatistics', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => ratioDataHandler(responseJson))
            .catch((error) => {
                console.error(error);
            });
    }, []);


    return (

        <View style={styles.screen}>
            <Card style={styles.card}>
                {statistics !== undefined && ratioData !== undefined ? (
                    <ScrollView>

                        <Graph
                            title="Vlhkosť vzduchu"
                            unit=""
                            labels={statistics.days}
                            data={statistics.airHumidity}
                            color="#87d1d5"
                        />

                        <Graph
                            title="Teplota vzduchu"
                            unit=" °C"
                            labels={statistics.days}
                            data={statistics.airTemperature}
                            color="#f3545c"
                        />

                        <Graph
                            title="Vlhkosť pôdy"
                            unit=" %"
                            labels={statistics.days}
                            data={statistics.soilMoisture}
                            color="#509a3d"
                        />

                        <View style={{ width: '90%' }}>
                            <PieChart
                                title="Pomer manuálnych regulácií"
                                data={ratioData.userRatio}
                            />
                        </View>

                        <View style={{ width: '90%' }}>
                            <PieChart
                                title="Pomer typov regulácií"
                                data={ratioData.wateringTypeRatio}
                            />
                        </View>

                    </ScrollView>)
                    : <ActivityIndicator size={50} color={COLORS.StatisticsHeader} />}
            </Card>
        </View >
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