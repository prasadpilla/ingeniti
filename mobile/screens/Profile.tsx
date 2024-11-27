import { useClerk, useUser } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Appbar, Divider, Switch, Text, useTheme } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import { useAppTheme } from '../providers/ThemeProvider';

export default function ProfileScreen() {
  const theme = useTheme();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const { appThemeType, setAppTheme } = useAppTheme();
  const navigation = useNavigation();
  const { user } = useUser();

  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
      setTimeout(() => {
        setIsSigningOut(false);
      }, 0);
    } catch (error) {
      console.error(error);
      setIsSigningOut(false);
    } finally {
      setIsSigningOut(false);
    }
  };

  const toggleTheme = () => {
    setAppTheme(appThemeType === 'light' ? 'dark' : 'light');
  };

  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const dynamicStyles = StyleSheet.create({
    settingsSection: {
      backgroundColor: theme.colors.elevation.level1,
      borderRadius: 8,
      marginBottom: 16,
      padding: 8,
      width: '100%',
    },
    valueText: {
      marginRight: 8,
      opacity: 0.7,
      color: theme.colors.onSurface,
    },
    sectionTitle: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      opacity: 0.8,
      color: theme.colors.onSurface,
    },
    email: {
      opacity: 0.7,
      color: theme.colors.onSurface,
    },
  });

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
        <Appbar.Content title={t('profile')} titleStyle={styles.headerTitle} />
        <TouchableOpacity style={{ padding: 8 }} onPress={toggleTheme}>
          <MaterialIcons
            name={appThemeType === 'light' ? 'dark-mode' : 'light-mode'}
            size={24}
            color={theme.colors.onSecondaryContainer}
          />
        </TouchableOpacity>
      </Appbar.Header>
      <Background>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text variant="headlineMedium" style={{ color: theme.colors.onPrimaryContainer }}>
                {getInitials()}
              </Text>
            </View>
            <Text variant="headlineMedium" style={styles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text variant="bodyLarge" style={dynamicStyles.email}>
              {user?.emailAddresses[0]?.emailAddress}
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="titleLarge">12</Text>
                <Text variant="bodySmall">{t('devices')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">24kWh</Text>
                <Text variant="bodySmall">{t('energy_saved')}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge">$45</Text>
                <Text variant="bodySmall">{t('monthly_savings')}</Text>
              </View>
            </View>
          </View>

          <View style={dynamicStyles.settingsSection}>
            <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
              {t('notifications')}
            </Text>
            <View style={styles.settingItem}>
              <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('push_notifications')}
              </Text>
              <Switch value={pushNotifications} onValueChange={setPushNotifications} />
            </View>
            <Divider />
            <View style={styles.settingItem}>
              <MaterialIcons name="mail" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('email_notifications')}
              </Text>
              <Switch value={emailNotifications} onValueChange={setEmailNotifications} />
            </View>
            <Divider />
            <View style={styles.settingItem}>
              <MaterialIcons name="campaign" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('marketing_emails')}
              </Text>
              <Switch value={marketingEmails} onValueChange={setMarketingEmails} />
            </View>
          </View>

          <View style={dynamicStyles.settingsSection}>
            <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
              {t('preferences')}
            </Text>
            <View style={styles.settingItem}>
              <MaterialIcons name="language" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('language')}
              </Text>
              <View style={styles.valueContainer}>
                <Text variant="bodyMedium" style={dynamicStyles.valueText}>
                  English
                </Text>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
              </View>
            </View>
            <Divider />
            <View style={styles.settingItem}>
              <MaterialIcons name="security" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('privacy')}
              </Text>
              <View style={styles.valueContainer}>
                <Text variant="bodyMedium" style={dynamicStyles.valueText}>
                  {t('public')}
                </Text>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
              </View>
            </View>
            <Divider />
            <View style={styles.settingItem}>
              <MaterialIcons name="storage" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('data_usage')}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
            </View>
          </View>

          <View style={dynamicStyles.settingsSection}>
            <Text variant="titleMedium" style={dynamicStyles.sectionTitle}>
              {t('about')}
            </Text>
            <View style={styles.settingItem}>
              <MaterialIcons name="help-outline" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('help_center')}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
            </View>
            <Divider />
            <View style={styles.settingItem}>
              <MaterialIcons name="info-outline" size={24} color={theme.colors.primary} />
              <Text variant="bodyLarge" style={styles.settingText}>
                {t('about_us')}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
            </View>
          </View>

          <Button mode="contained" onPress={handleSignOut} disabled={isSigningOut} style={styles.signOutButton}>
            {isSigningOut ? <ActivityIndicator animating={true} color={theme.colors.secondary} /> : t('sign_out')}
          </Button>
        </ScrollView>
      </Background>
    </>
  );
}
const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 5,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginBottom: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
  },
  settingText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  divider: {
    marginVertical: 2,
  },
  signOutButton: {
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
