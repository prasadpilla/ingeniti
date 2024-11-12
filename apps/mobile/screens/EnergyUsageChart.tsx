import { useAuth } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Device, EnergyData, EnergyResponse } from '@ingeniti/shared';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import MultiSelect from 'react-native-multiple-select';
import { Appbar, useTheme } from 'react-native-paper';
import DateTimePicker from 'react-native-ui-datepicker';
import { EnergyUsageChartProps } from '../types';
import { makeApiCall } from '../utils/api';

const screenWidth = Dimensions.get('window').width;

export interface ChartProps extends EnergyUsageChartProps {
  userId: string;
}

const EnergyUsageChart = ({ navigation, userId }: ChartProps) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const { getToken } = useAuth();

  const { data: devices = [], isLoading: isLoadingDevices } = useQuery<Device[]>({
    queryKey: ['devices', userId],
    queryFn: async () => {
      const token = await getToken();
      const response = await makeApiCall(token, '/devices', 'GET');
      if (!response.ok) {
        throw new Error('Failed to fetch devices');
      }
      const data = await response.json();
      return data;
    },
  });

  const { data: energyResponse, isLoading: isLoadingEnergyData } = useQuery<EnergyResponse>({
    queryKey: ['energyData', selectedDevices, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const token = await getToken();
      const adjustedEndDate = endDate.endOf('day').toISOString();
      const response = await makeApiCall(
        token,
        `/devices/device-energy?deviceIds=${selectedDevices.join(',')}&startDate=${startDate.toISOString()}&endDate=${adjustedEndDate}`,
        'GET'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch energy data');
      }
      const data = await response.json();
      return data;
    },
    enabled: selectedDevices.length > 0 && startDate.isValid() && endDate.isValid(),
  });

  const energyData = energyResponse?.data ?? [];

  const processDataForChart = () => {
    if (!energyData.length) {
      return {
        labels: [],
        datasets: [],
        legend: [],
      };
    }

    const chartData: { [key: string]: { [deviceId: string]: number } } = {};
    const colors = [
      { line: '#FF6384', gradient: ['rgba(255,99,132,0.3)', 'rgba(255,99,132,0.0)'] },
      { line: '#36A2EB', gradient: ['rgba(54,162,235,0.3)', 'rgba(54,162,235,0.0)'] },
      { line: '#FFCE56', gradient: ['rgba(255,206,86,0.3)', 'rgba(255,206,86,0.0)'] },
      { line: '#4BC0C0', gradient: ['rgba(75,192,192,0.3)', 'rgba(75,192,192,0.0)'] },
      { line: '#9966FF', gradient: ['rgba(153,102,255,0.3)', 'rgba(153,102,255,0.0)'] },
      { line: '#FF9F40', gradient: ['rgba(255,159,64,0.3)', 'rgba(255,159,64,0.0)'] },
    ];

    // First pass: collect all unique dates
    energyData.forEach((entry: EnergyData) => {
      const date = dayjs(entry.timestamp);
      const interval = energyResponse?.interval || 'daily';
      let dateKey = '';

      switch (interval) {
        case 'hourly':
          dateKey = date.format('HH:00');
          break;
        case 'daily':
          dateKey = date.format('DD/MM');
          break;
        case 'weekly':
          dateKey = `W${date.format('w')}`;
          break;
        case 'monthly':
          dateKey = date.format('MMM');
          break;
        default:
          dateKey = date.format('DD/MM');
      }

      if (!chartData[dateKey]) {
        chartData[dateKey] = {};
      }

      if (!chartData[dateKey][entry.deviceId]) {
        chartData[dateKey][entry.deviceId] = 0;
      }
      chartData[dateKey][entry.deviceId] += entry.energy;
    });

    const labels = Object.keys(chartData);
    const datasets = selectedDevices.map((deviceId, index) => ({
      data: labels.map((label) => chartData[label][deviceId] || 0),
      color: () => colors[index % colors.length].line,
      strokeWidth: 2,
      withDots: true,
      withShadow: false,
      withScrollableDot: false,
      withGradient: true,
      gradient: colors[index % colors.length].gradient,
    }));

    const legend = selectedDevices.map((deviceId) => {
      const device = devices.find((d) => d.id === deviceId);
      return device?.name || 'Unknown Device';
    });

    return {
      labels,
      datasets,
      legend,
    };
  };

  const data = processDataForChart();

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${theme.dark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${theme.dark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    barPercentage: 0.5,
    groupSpacing: 0.4,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    propsForLabels: {
      fontSize: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    fillShadowGradientFrom: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    fillShadowGradientTo: theme.dark ? 'rgba(255, 255, 255, 0.0)' : 'rgba(0, 0, 0, 0.0)',
    useShadowColorFromDataset: true,
  };

  const renderSelectedDevices = () => {
    return (
      <View style={styles.selectedDevicesContainer}>
        {selectedDevices.map((deviceId) => {
          const device = devices.find((d) => d.id === deviceId);
          return (
            <View key={deviceId} style={styles.selectedDeviceTag}>
              <Text style={styles.selectedDeviceText}>{device?.name || 'Unknown Device'}</Text>
              <TouchableOpacity onPress={() => setSelectedDevices(selectedDevices.filter((id) => id !== deviceId))}>
                <Text style={styles.removeTagText}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = () => (
    <>
      <View style={[styles.filtersContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.datePickersRow}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setStartDatePickerVisible(!startDatePickerVisible)}
          >
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={[styles.dateValue, { color: theme.colors.primary }]}>{startDate.format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setEndDatePickerVisible(!endDatePickerVisible)}
          >
            <Text style={styles.dateLabel}>End Date</Text>
            <Text style={[styles.dateValue, { color: theme.colors.primary }]}>{endDate.format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.multiSelectContainer}>
          <MultiSelect
            items={devices}
            uniqueKey="id"
            onSelectedItemsChange={setSelectedDevices}
            selectedItems={selectedDevices}
            selectText={isLoadingDevices ? 'Loading devices...' : 'Select Devices'}
            searchInputPlaceholderText="Search Devices..."
            tagRemoveIconColor={theme.colors.primary}
            tagBorderColor={theme.colors.primary}
            tagTextColor={theme.colors.primary}
            selectedItemTextColor={theme.colors.primary}
            selectedItemIconColor={theme.colors.primary}
            itemTextColor={theme.colors.onBackground}
            displayKey="name"
            searchInputStyle={{
              color: theme.colors.onBackground,
              flex: 1,
              textAlign: 'left',
              width: '100%',
              paddingTop: 4,
              paddingBottom: 4,
            }}
            submitButtonColor={theme.colors.primary}
            submitButtonText="Select"
            styleTextDropdown={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 16,
            }}
            styleTextDropdownSelected={{
              color: theme.colors.onSurfaceVariant,
              fontSize: 16,
              fontWeight: '500',
            }}
            styleIndicator={{
              backgroundColor: 'transparent',
              alignSelf: 'center',
              marginTop: 0,
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
            styleItemsContainer={{
              backgroundColor: theme.colors.background,
              marginTop: 4,
              marginBottom: 8,
              borderRadius: 8,
              borderColor: theme.colors.outline,
              borderWidth: 1,
              padding: 4,
            }}
            styleMainWrapper={{
              backgroundColor: theme.colors.background,
              flex: 1,
            }}
            styleInputGroup={{
              backgroundColor: theme.colors.background,
              paddingHorizontal: 4,
            }}
            styleSelectorContainer={{
              backgroundColor: theme.colors.background,
              flex: 1,
              width: '100%',
            }}
            styleRowList={{
              backgroundColor: theme.colors.background,
              justifyContent: 'center',
            }}
            styleDropdownMenuSubsection={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
              borderRadius: 8,
              paddingLeft: 16,
              paddingRight: 8,
              paddingVertical: 2,
              minHeight: 40,
              alignItems: 'center',
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            textInputProps={{
              style: {
                color: theme.colors.onBackground,
                backgroundColor: 'transparent',
                textAlign: 'left',
                width: '100%',
                height: 40,
              },
              placeholderTextColor: theme.colors.onSurfaceVariant,
            }}
            hideTags
          />
          {renderSelectedDevices()}
        </View>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedDevices.length === 0 ? (
            <View style={styles.loadingContainer}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={48}
                color={theme.colors.secondaryContainer}
                style={{ marginBottom: 12 }}
              />
              <Text style={{ color: theme.colors.onBackground }}>Please select devices to view data</Text>
            </View>
          ) : isLoadingEnergyData ? (
            <View style={styles.loadingContainer}>
              <MaterialCommunityIcons
                name="loading"
                size={48}
                color={theme.colors.primary}
                style={{ marginBottom: 12 }}
              />
              <Text style={{ color: theme.colors.onBackground }}>Loading...</Text>
            </View>
          ) : data.labels.length === 0 ? (
            <View style={styles.loadingContainer}>
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={48}
                color={theme.colors.secondaryContainer}
                style={{ marginBottom: 12 }}
              />
              <Text style={{ color: theme.colors.onBackground }}>No data available for selected period</Text>
            </View>
          ) : (
            <LineChart
              data={data}
              width={Math.max(screenWidth - 20, data.labels.length * 100)}
              height={300}
              chartConfig={{
                ...chartConfig,
                barPercentage: 0.8,
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              verticalLabelRotation={45}
              fromZero
              style={styles.chartStyle}
              yAxisLabel=""
              yAxisSuffix=" kWh"
              withInnerLines={true}
              segments={5}
              bezier
            />
          )}
        </ScrollView>
      </View>
    </>
  );

  return (
    <>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Energy Usage" titleStyle={[styles.headerTitle, { color: theme.colors.onSurface }]} />
      </Appbar.Header>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList data={[{ key: 'chart' }]} renderItem={renderItem} keyExtractor={(item) => item.key} />
        {(startDatePickerVisible || endDatePickerVisible) && (
          <View style={styles.datePickerOverlay}>
            <View style={[styles.datePickerModal, { backgroundColor: theme.dark ? '#333' : '#fff' }]}>
              <DateTimePicker
                mode="single"
                date={startDatePickerVisible ? startDate.toDate() : endDate.toDate()}
                onChange={({ date }) => {
                  if (startDatePickerVisible) {
                    setStartDate(dayjs(date));
                    setStartDatePickerVisible(false);
                  } else {
                    setEndDate(dayjs(date));
                    setEndDatePickerVisible(false);
                  }
                }}
                headerTextStyle={{
                  ...styles.datePickerText,
                  color: theme.dark ? '#fff' : '#000',
                }}
                weekDaysTextStyle={{
                  ...styles.datePickerText,
                  color: theme.dark ? '#fff' : '#000',
                }}
                headerButtonColor={theme.dark ? '#fff' : '#000'}
                calendarTextStyle={{
                  ...styles.datePickerText,
                  color: theme.dark ? '#fff' : '#000',
                }}
                selectedTextStyle={{
                  ...styles.datePickerSelectedText,
                  color: theme.dark ? '#fff' : '#000',
                }}
                selectedItemColor="#0047FF"
              />
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 0,
    height: 56,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  filtersContainer: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  datePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedDeviceTag: {
    backgroundColor: 'rgba(74, 157, 178, 0.1)',
    borderRadius: 8,
    borderColor: '#4A9DB2',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedDeviceText: {
    fontSize: 12,
    color: '#4A9DB2',
    marginRight: 8,
  },
  removeTagText: {
    color: '#4A9DB2',
    opacity: 0.6,
    fontSize: 16,
    marginTop: -2,
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginLeft: 0,
    marginBottom: 36,
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  loadingContainer: {
    width: screenWidth - 20,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDevicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    textAlignVertical: 'center',
  },
  datePickerText: {
    fontSize: 14,
  },
  datePickerSelectedText: {
    fontWeight: '600',
  },
  multiSelectContainer: {
    flex: 1,
    marginTop: 2,
  },
});

export default EnergyUsageChart;
