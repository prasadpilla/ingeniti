import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Paragraph, useTheme } from 'react-native-paper';
import Background from '../components/Background';
import DeviceToggle from '../components/DeviceToggle';
import { DeviceDetailsProps } from '../types/navigation.types';

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ route }) => {
  const { device } = route.params;
  const navigation = useNavigation();
  const theme = useTheme();

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
        <Appbar.Content title={device.name} titleStyle={styles.headerTitle} />
        <View style={{ width: 40 }} />
      </Appbar.Header>
      <Background>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.switchContainer}>
              <Paragraph>Device Power</Paragraph>
              <DeviceToggle device={device} />
            </View>
            <View style={styles.detailsContainer}>
              <DetailItem label="Serial Number" value={device.serialNumber} />
              <DetailItem label="Type" value={device.type} />
              <DetailItem label="Location" value={device.location} />
              <DetailItem label="Usage" value={device.usage} />
              <DetailItem label="Utility" value={device.utility} />
              <DetailItem label="Country" value={device.country} />
              <DetailItem label="Meter Service ID" value={device.meterServiceId} />
              <DetailItem label="Average Energy Cost" value={`$${device.averageEnergyCost}`} />
              <DetailItem label="Min Off Time" value={`${device.minOffTime} minutes`} />
              <DetailItem label="Max Load" value={device.maxLoad ? `${device.maxLoad} W` : 'N/A'} />
              <DetailItem
                label="Connected to Primary Device"
                value={device.isConnectedToPrimaryDevice ? 'Yes' : 'No'}
              />
            </View>
          </View>
        </ScrollView>
      </Background>
    </>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Paragraph style={styles.label}>{label}:</Paragraph>
    <Paragraph>{value}</Paragraph>
  </View>
);

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  detailsContainer: {
    width: '100%',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default DeviceDetails;
