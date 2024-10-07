import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Paragraph, Switch, Title } from 'react-native-paper';
import Background from '../components/Background';
import { DeviceDetailsProps } from '../types/navigation.types';

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ route }) => {
  const { device } = route.params;
  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>{device.name}</Title>
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
          <DetailItem label="Connected to Primary Device" value={device.isConnectedToPrimaryDevice ? 'Yes' : 'No'} />
          <View style={styles.switchContainer}>
            <Paragraph>Device Power</Paragraph>
            <Switch value={device.isSwitchOn ?? false} onValueChange={() => {}} />
          </View>
        </View>
      </ScrollView>
    </Background>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Paragraph style={styles.label}>{label}:</Paragraph>
    <Paragraph>{value}</Paragraph>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});

export default DeviceDetails;
