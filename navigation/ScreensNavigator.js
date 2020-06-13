import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import ScreensMenu from '../screens/menu/ScreensMenu';
import History from '../screens/menu/History';
import Settings from '../screens/menu/Settings';
import FlowRegulation from '../screens/FlowRegulation';
import MeasurementsScreen from '../screens/menu/MeasurementsScreen';
import Statistics from '../screens/menu/Statistics';

import { COLORS, TITLES } from '../data/constants';


const createNavigationsOptions = (headerTitle, headerColor) => {
    return {
        headerTitle: headerTitle,
        headerStyle: {
            backgroundColor: headerColor
        }
    };
}

const MenuNavigator = createStackNavigator({
    ScreensMenu: {
        screen: ScreensMenu,
        navigationOptions: createNavigationsOptions(TITLES.MenuScreen, COLORS.RegulationHeader)
    },
    MeasurementsScreen: {
        screen: MeasurementsScreen,
        navigationOptions: createNavigationsOptions(TITLES.MeasuremenScreen, COLORS.MeasuremenHeader)
    },
    History: {
        screen: History,
        navigationOptions: createNavigationsOptions(TITLES.HistoryScreen, COLORS.HistoryHeader)
    },
    Statistics: {
        screen: Statistics,
        navigationOptions: createNavigationsOptions(TITLES.SettingsScreen, COLORS.StatisticsHeader)
    },
    Settings: {
        screen: Settings,
        navigationOptions: createNavigationsOptions(TITLES.SettingsScreen, COLORS.SettingsHeader)
    }
},
    {
        defaultNavigationOptions: {
            headerTintColor: 'white'
        }
    }
);

const FlowRegulatorNavigator = createStackNavigator({
    FlowRegulation: {
        screen: FlowRegulation,
        navigationOptions: createNavigationsOptions(TITLES.RegulationScreen, COLORS.RegulationHeader)
    }
},
    {
        defaultNavigationOptions: {
            headerTintColor: 'white'
        }
    }
);

const createBottomNavigationOptions = (tabBarLabe, tabBarColor, iconName) => {
    return {
        tabBarIcon: tabInfo => {
            return (
                <FontAwesome5 name={iconName} size={25} color={tabInfo.tintColor} />
            );
        },
        tabBarColor: tabBarColor,
        tabBarLabel: tabBarLabe
    }
};

const BottomNavigator = createMaterialBottomTabNavigator({
    FlowRegulation: {
        screen: FlowRegulatorNavigator,
        navigationOptions: createBottomNavigationOptions(TITLES.RegulationScreen, COLORS.RegulationHeader, "seedling")
    },
    Menu: {
        screen: MenuNavigator,
        navigationOptions: createBottomNavigationOptions(TITLES.MenuScreen, COLORS.RegulationHeader, "bars")

    }
},
    {
        shifting: true
    }
);

export default createAppContainer(BottomNavigator);