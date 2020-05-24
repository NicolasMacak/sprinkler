import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import moment from "moment";

import Card from '../../components/Card';
import { COLORS } from '../../data/constants'

const History = props => {

  const [historyData, setHistoryData] = useState([]);

  const HistoryDataHandler = (response) => {
    if (historyData.length > 0) {
      return;

    }

    setHistoryData([...response]);
  };

  const renderHeader =

    <View style={styles.headerLine}>

      <View style={styles.column}>
        <Text style={{ ...styles.itemText, ...styles.headerText }}>Hodnota</Text>
      </View>
      <View style={styles.column}>
        <Text style={{ ...styles.itemText, ...styles.headerText }}>Nastavil</Text>
      </View>
      <View style={styles.column}>
        <Text style={{ ...styles.itemText, ...styles.headerText }}>Čas nastavenia</Text>
      </View>

    </View>;

  const renderRecord = (record) => {

    return <View
      style={[{ flexDirection: 'row' }, record.index % 2 == 1 ? {} : styles.stripLine]}>

      <View style={styles.column}>
        <Text style={styles.itemText}>{record.item.value}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.itemText}>{record.item.modifiedByNickname}</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.itemText}>

          {moment(record.item.createdAt).format("HH:mm")}

        </Text>
      </View>

    </View>
  };

  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGZlLmNvbSIsInVuaXF1ZV9uYW1lIjoiMSIsIm5iZiI6MTU4OTk3OTQyMiwiZXhwIjoxNTkwNTg0MjIyLCJpYXQiOjE1ODk5Nzk0MjJ9.iJNvbq7FyJB7fTLpt_vEtmUO-CQK8RQ0CFsCTc8Oi8k";
  useEffect(() => {
    fetch('http://35.206.95.251:80/regulation',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then((response) => response.json())
      .then((responseJson) => HistoryDataHandler(responseJson))
      .catch((error) => {
        console.error(error);
      })
  }, []);
  return (
    <View style={styles.screen}>

      <Card style={styles.card}>

        {renderHeader}

        {
          historyData.length === 0 ?
            (<ActivityIndicator size={50} color={COLORS.HistoryHeader} />) :
            (
              <FlatList
                keyExtractor={(item, index) => item.id.toString()}
                data={historyData}
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

export default History;
