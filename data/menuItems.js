import MenuItem from '../models/menuItem';
import { COLORS, TITLES } from '../data/constants';

export const MenuItems = [
    new MenuItem(0, TITLES.MeasuremenScreen, 'MeasurementsScreen', "thermometer-half", COLORS.MeasuremenHeader),
    new MenuItem(1, TITLES.HistoryScreen, 'History', 'tint', COLORS.HistoryHeader),
    new MenuItem(2, TITLES.StatisticsScreen, 'Statistics', 'chart-pie', COLORS.StatisticsHeader),
    new MenuItem(3, TITLES.SettingsScreen, 'Settings', 'whmcs', COLORS.SettingsHeader)
];