import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import MultiSelect from 'react-native-multiple-select';
import { Appbar, useTheme } from 'react-native-paper';
import DateTimePicker from 'react-native-ui-datepicker';
import { EnergyUsageChartProps } from '../types';

const screenWidth = Dimensions.get('window').width;

const deviceItems = [
  { id: '1', name: 'Device A' },
  { id: '2', name: 'Device B' },
  { id: '3', name: 'Device C' },
  { id: '4', name: 'Device D' },
];

const EnergyUsageChart = ({ navigation }: EnergyUsageChartProps) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(dayjs('2023-01-01'));
  const [endDate, setEndDate] = useState(dayjs('2023-12-31'));
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [endDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50, 75, 30, 60, 55, 40],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      },
      {
        data: [30, 25, 40, 60, 70, 50, 65, 80, 35, 55, 45, 70],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
    legend: ['Red Device', 'Blue Device'],
  };

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
            onChangeInput={(text: string) => console.log(text)}
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
            verticalLabelRotation={30}
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
        ></Appbar.Content>
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
    paddingLeft: 20,
    paddingRight: 20,
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
