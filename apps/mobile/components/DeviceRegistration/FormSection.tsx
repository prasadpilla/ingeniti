import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Paragraph, useTheme } from 'react-native-paper';

interface FormSectionProps {
  children: React.ReactNode;
  sectionTitle: string;
  isOpen: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({ children, sectionTitle, isOpen }) => {
  const theme = useTheme();
  const [isContentVisible, setIsContentVisible] = useState(isOpen);

  const toggleContent = () => setIsContentVisible(!isContentVisible);

  return (
    <View style={[styles.container, { borderColor: theme.colors.surfaceVariant }]}>
      <TouchableOpacity onPress={toggleContent} style={styles.touchableHeader}>
        <View
          style={[
            styles.sectionHeader,
            {
              borderBottomWidth: isContentVisible ? 1 : 0,
              borderColor: theme.colors.surfaceVariant,
              backgroundColor: theme.colors.secondaryContainer,
            },
          ]}
        >
          <Paragraph style={styles.sectionHeaderText}>{sectionTitle}</Paragraph>
          <MaterialCommunityIcons
            name={isContentVisible ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={theme.colors.secondary}
          />
        </View>
      </TouchableOpacity>
      {isContentVisible && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContent: {
    width: '100%',
    padding: 10,
  },
  touchableHeader: {
    width: '100%',
  },
});

export default FormSection;
