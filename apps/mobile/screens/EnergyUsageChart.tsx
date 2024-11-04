import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import MultiSelect from 'react-native-multiple-select';
import { Appbar, useTheme } from 'react-native-paper';
import DateTimePicker from 'react-native-ui-datepicker';
import { EnergyUsageChartProps } from '../types';
import { makeApiCall } from '../utils/api';
import { useAuth } from '@clerk/clerk-expo';

const screenWidth = Dimensions.get('window').width;

export interface ChartProps extends EnergyUsageChartProps {
  userId: string;
}

const EnergyUsageChart = ({ navigation, userId }: ChartProps) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(dayjs('2024-10-29'));
  const [endDate, setEndDate] = useState(dayjs('2024-10-31'));
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [deviceItems, setDeviceItems] = useState([]);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = await getToken();
        const response = await makeApiCall(token, '/devices', 'GET');
        if (!response.ok) {
          throw new Error('Failed to fetch devices');
        }
        const devices = await response.json();
        const formattedDevices = devices.map((device) => ({
          id: device.id,
          name: device.name,
          isSensor: device.isSensor,
        }));
        setDeviceItems(formattedDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, [userId]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEnergyData = async () => {
      if (selectedDevices.length === 0 || !startDate.isValid() || !endDate.isValid()) return;
      setLoading(true);

      const diffInDays = endDate.diff(startDate, 'day');

      let interval;
      if (diffInDays <= 7) {
        interval = '1h';
      } else if (diffInDays <= 31) {
        interval = '1d';
      } else {
        interval = '1M';
      }

      try {
        const token = await getToken();
        const adjustedEndDate = endDate.endOf('day').toISOString();
        const response = await makeApiCall(
          token,
          `/devices/device-energy?deviceIds=${selectedDevices.join(',')}&startDate=${startDate.toISOString()}&endDate=${adjustedEndDate}&interval=${interval}`,
          'GET'
        );

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setEnergyData(data.data);
        } else {
          setEnergyData([]);
        }
      } catch (error) {
        console.error('Error fetching energy data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, [selectedDevices, startDate, endDate]);

  const processDataForChart = () => {
    const chartData: { [key: string]: number } = {};

    energyData.forEach((entry) => {
      const diffInDays = endDate.diff(startDate, 'day');
      const dateKey = dayjs(entry.createdAt).format(
        diffInDays <= 2 ? 'HH:mm' : diffInDays <= 7 ? 'DD HH:mm' : diffInDays <= 31 ? 'DD-MM' : 'MM-YYYY'
      );
      if (!chartData[dateKey]) {
        chartData[dateKey] = 0;
      }
      chartData[dateKey] += entry.energy;
    });

    return {
      labels: Object.keys(chartData),
      datasets: [
        {
          data: Object.values(chartData) as number[],
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        },
      ],
      legend: ['Energy Usage'],
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
      x: 40,
    },
  };

  const renderItem = () => (
    <>
      <View style={styles.filtersContainer}>
        <View style={styles.datePickersRow}>
          <View style={styles.datePickerContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>Start Date:</Text>
            <TouchableOpacity onPress={() => setStartDatePickerVisible(!startDatePickerVisible)}>
              <Text style={{ color: theme.colors.primary }}>{startDate.format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.datePickerContainer}>
            <Text style={[styles.label, { color: theme.colors.onBackground }]}>End Date:</Text>
            <TouchableOpacity onPress={() => setEndDatePickerVisible(!endDatePickerVisible)}>
              <Text style={{ color: theme.colors.primary }}>{endDate.format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.multiSelectContainer}>
          <MultiSelect
            items={deviceItems}
            uniqueKey="id"
            onSelectedItemsChange={(selected: any) => setSelectedDevices(selected)}
            selectedItems={selectedDevices}
            selectText="Select Devices"
            searchInputPlaceholderText="Search Devices..."
            tagRemoveIconColor={theme.colors.primary}
            tagBorderColor={theme.colors.primary}
            tagTextColor={theme.colors.primary}
            selectedItemTextColor={theme.colors.primary}
            selectedItemIconColor={theme.colors.primary}
            itemTextColor={theme.colors.onBackground}
            displayKey="name"
            searchInputStyle={{ color: theme.colors.onBackground }}
            submitButtonColor={theme.colors.primary}
            submitButtonText="Submit"
            styleTextDropdown={{ color: theme.colors.onBackground }}
            styleTextDropdownSelected={{ color: theme.colors.onBackground }}
            styleIndicator={{ backgroundColor: theme.colors.primary }}
            styleItemsContainer={{ backgroundColor: theme.colors.background }}
            styleMainWrapper={{ backgroundColor: theme.colors.background }}
            styleInputGroup={{ backgroundColor: theme.colors.background }}
            styleSelectorContainer={{ backgroundColor: theme.colors.background }}
            styleRowList={{ backgroundColor: theme.colors.background }}
            styleDropdownMenuSubsection={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.outline,
            }}
            textInputProps={{ style: { color: theme.colors.onBackground } }}
          />
        </View>
      </View>
      <View>
        <Text style={[styles.chartTitle, { color: theme.colors.onBackground }]}>Energy Usage</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={data}
            width={Math.max(screenWidth - 20, data.labels.length * 60)}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={endDate.diff(startDate, 'day') <= 7 ? 45 : 30}
            fromZero
            showBarTops={false}
            style={styles.chartStyle}
            yAxisLabel=""
            yAxisSuffix=""
            withInnerLines={true}
            segments={5}
          />
        </ScrollView>
      </View>
    </>
  );

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
          <Appbar.BackAction size={24} color={theme.colors.onSecondaryContainer} />
        </TouchableOpacity>
        <Appbar.Content
          title="Energy Usage Chart"
          titleStyle={[styles.headerTitle, { color: theme.colors.onSecondaryContainer }]}
        />
        <View style={{ width: 40 }} />
      </Appbar.Header>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList data={[{ key: 'chart' }]} renderItem={renderItem} keyExtractor={(item) => item.key} />
        {(startDatePickerVisible || endDatePickerVisible) && (
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerModal}>
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
                calendarTextStyle={styles.datePickerText}
                selectedTextStyle={styles.datePickerSelectedText}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  filtersContainer: {
    padding: 10,
    marginBottom: 20,
  },
  datePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerContainer: {
    flex: 1,
    marginRight: 10,
  },
  datePickerText: {
    fontSize: 14,
  },
  datePickerSelectedText: {
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  multiSelectContainer: {
    marginTop: 10,
  },
  chartTitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  chartStyle: {
    borderRadius: 16,
    paddingLeft: 36,
    paddingRight: 36,
    paddingBottom: 36,
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
});

export default EnergyUsageChart;
