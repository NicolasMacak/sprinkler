import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { COLORS } from '../../data/constants';
import { MenuItems } from '../../data/menuItems';

const ScreensMenu = props => {

  const renderMenuItem = (itemData) => {
    return <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        props.navigation.navigate({ routeName: itemData.item.screenName });
      }}
    >
      <View style={{ ...styles.iconContainer, backgroundColor: itemData.item.iconBackgroundColor, }}>
        <FontAwesome5 name={itemData.item.iconName} size={60} color="white" />
      </View>
      <View style={styles.menuItemHeaderContainer}>
        <Text style={styles.menuItemHeader}>{itemData.item.itemTitle}</Text>
      </View>
    </TouchableOpacity>
  }

  return (
    <View style={styles.screen}>

      <View>
        <FlatList
          keyExtractor={(item, index) => item.id.toString()}
          data={MenuItems}
          renderItem={renderMenuItem}
          numColumns={2}
        />

      </View>
    </View>
  );
};

ScreensMenu.navigationOptions = navigationData => {

  return {
    headerRight: () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="SignOut"
          iconName="power-off"
          onPress={() => navigationData.navigation.navigate('Auth')}
        />
      </HeaderButtons>

  };
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //justifyContent: 'center',
    // alignItems: 'center'
  },
  menuContainer: {
    flex: 1
  },
  menuItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#a3c1e3',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'

  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuItemHeaderContainer: {
    marginTop: 20
  },
  menuItemHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});


export default ScreensMenu;
