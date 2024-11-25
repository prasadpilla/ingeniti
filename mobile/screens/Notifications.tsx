import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, MD3Theme, Text, useTheme } from 'react-native-paper';

import Background from '../components/Background';

export default function Notifications() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();

  const notifications = [
    {
      id: 1,
      title: t('energy_spike_detected'),
      message: t('unusual_energy_consumption'),
      time: '2m ago',
      icon: 'warning',
      type: 'warning',
    },
    {
      id: 2,
      title: t('device_offline'),
      message: t('living_room_ac_offline'),
      time: '15m ago',
      icon: 'wifi-off',
      type: 'error',
    },
    {
      id: 3,
      title: t('energy_goal_achieved'),
      message: t('monthly_energy_goal_reached'),
      time: '1h ago',
      icon: 'emoji-events',
      type: 'success',
    },
    {
      id: 4,
      title: t('schedule_activated'),
      message: t('night_mode_activated'),
      time: '3h ago',
      icon: 'schedule',
      type: 'info',
    },
    {
      id: 5,
      title: t('firmware_update'),
      message: t('update_available'),
      time: '5h ago',
      icon: 'system-update',
      type: 'info',
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.secondaryContainer,
          height: 60,
          zIndex: 100,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}>
          <Appbar.BackAction size={24} />
        </TouchableOpacity>
        <Appbar.Content title={t('notifications')} titleStyle={styles(theme).headerTitle} />
        <View style={{ width: 40 }} />
      </Appbar.Header>
      <Background>
        <ScrollView style={styles(theme).container} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles(theme).notificationItem}>
              <MaterialIcons
                name={notification.icon}
                size={24}
                color={getIconColor(notification.type)}
                style={styles(theme).icon}
              />
              <View style={styles(theme).contentContainer}>
                <Text variant="titleMedium">{notification.title}</Text>
                <Text variant="bodyMedium" style={styles(theme).message}>
                  {notification.message}
                </Text>
                <Text variant="bodySmall" style={styles(theme).time}>
                  {notification.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Background>
    </>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 4,
    },
    notificationItem: {
      flexDirection: 'row',
      padding: 8,
      borderRadius: 8,
      marginVertical: 4,
      backgroundColor: theme.colors.elevation.level2,
    },
    icon: {
      marginRight: 16,
    },
    contentContainer: {
      flex: 1,
    },
    message: {
      opacity: 0.7,
      marginTop: 4,
    },
    time: {
      opacity: 0.5,
      marginTop: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
