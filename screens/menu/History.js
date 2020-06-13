import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import moment from "moment";
import { useSelector } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons';

import Card from '../../components/Card';
import { COLORS } from '../../data/constants'

let actualDay = null;
const History = props => {

  const [historyData, setHistoryData] = useState([]);
  const [endReached, setEndReached] = useState(false);

  const onlyMyRegulations = useSelector(state => state.auth.onlyMyRegulations) !== undefined ? useSelector(state => state.auth.onlyMyRegulations) : false;
  const userId = useSelector(state => state.auth.userId);
  const token = useSelector(state => state.auth.token);

  const HistoryDataHandler = (response) => {
    console.log(response);
    if (response.length === 0) {
      setEndReached(true);
    }

    setHistoryData([...historyData, ...response]);
  };

  const renderHeader =

    <View style={styles.headerLine}>

      <View style={styles.column}>
        <Text style={{ ...styles.itemText, ...styles.headerText }}>Spustil</Text>
      </View>
      <View style={styles.column}>
        <Text style={{ ...styles.itemText, ...styles.headerText }}>Typ</Text>
      </View>
      <View style={styles.column}>
        <Text style={{ ...styles.itemText, ...styles.headerText }}>Čas záznamu</Text>
      </View>

    </View>;

  const renderFooter = () => {
    return (
      !endReached ?
        <View>
          <ActivityIndicator size={50} color={COLORS.HistoryHeader} />
        </View> : null
    );
  }

  const renderRecord = (record) => {

    // let isNewDay = false;
    // let thisDay = moment(record.item.createdAt).format("DD");

    // if (actualDay !== thisDay) {
    //   isNewDay = true;
    //   actualDay = thisDay;
    // }

    // console.log(isNewDay);
    let type = '';
    switch (record.item.wateringType) {
      case 0:
        type = 'Automatické'
        break;

      case 1:
        type = 'Manuálne'
        break;

      case 2:
        type = 'Kritick0'
        break;

      default:
        break;
    }

    return <View style={styles.screen}>

      {/* {isNewDay ?
        (<View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%', borderTopColor: 'black', borderTopWidth: 1, borderBottomColor: 'black', borderBottomWidth: 1 }]}>
          <Text style={{ ...styles.itemText, ...styles.newDayText }}>{moment(record.item.createdAt).format("M. D. YYYY")}</Text>
        </View>) : null} */}

      <View
        style={[{ flexDirection: 'row' }, record.index % 2 == 1 ? {} : styles.stripLine]}>



        <View style={styles.column}>
          <Text style={styles.itemText}>{record.item.triggeredByNickname !== null ? record.item.triggeredByNickname :
            <FontAwesome5 name="robot" size={15} />}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.itemText}>{type}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.itemText}>

            {moment(record.item.createdAt).format("HH:mm")}

          </Text>
        </View>

      </View>

    </View>
  };

  const getHistoryData = () => {

    fetch(`http://35.206.95.251:80/Waterings/?skip=${historyData.length}&perPage=50`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
      .then((response) => response.json())
      .then((responseJson) => HistoryDataHandler(responseJson))
      .catch((error) => {
        console.error(error);
      })
  };


  useEffect(() => {
    getHistoryData();
  }, []);
  return (
    <View style={styles.screen}>

      <Card style={styles.card}>

        {renderHeader}

        <FlatList
          keyExtractor={(item, index) => item.id.toString()}
          data={historyData}
          renderItem={renderRecord}
          ListFooterComponent={renderFooter}
          onEndReached={!endReached ? getHistoryData : null}
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
    marginBottom: 2,
    justifyContent: 'center'
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
