import { useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Appbar, Checkbox, useTheme } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { SignUpForm, signUpFormSchema } from 'shared';

import Button from '../components/Button';
import CountryCodePicker from '../components/CountryCodePicker';
import FormInput from '../components/FormInput';
import Paragraph from '../components/Paragraph';
import { SignupProps } from '../types';
import { countries, CountryData } from '../utils/country-data';

const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'INR', value: 'INR' },
  { label: 'JPY', value: 'JPY' },
];

const SignUpScreen: React.FC<SignupProps> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isLoaded, signUp } = useSignUp();
  const [signUpError, setSignUpError] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      password: '',
      termsAndConditions: false,
    },
    mode: 'onChange',
  });

  const handleSignUpErrors = (errors: ClerkAPIError[]) => {
    if (errors.length > 0) {
      const err = errors[0];
      const errCode = err.code;
      const paramName = err.meta?.paramName;

      switch (`${errCode}-${paramName}`) {
        case 'form_identifier_exists-email_address':
          setSignUpError(t('email_exists'));
          break;
        case 'form_identifier_exists-phone_number':
          setSignUpError(t('phone_exists'));
          break;
        case 'form_param_format_invalid-phone_number':
          setSignUpError(t('invalid_phone'));
          break;
        case 'form_password_pwned-password':
          setSignUpError(t('common_password'));
          break;
        default:
          setSignUpError(t('something_went_wrong'));
          break;
      }
    }
  };

  const onSignUpPress: SubmitHandler<SignUpForm> = async (data) => {
    if (!isLoaded) return;

    const { firstName, lastName, emailAddress, password } = data;
    const phone = `${selectedCountry.code}${data.phoneNumber}`;

    try {
      await signUp.create({
        emailAddress,
        phoneNumber: phone,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          currency: selectedCurrency,
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      navigation.navigate('VerifySignUpEmail', {
        emailAddress,
        phoneNumber: phone,
        firstName,
        lastName,
      });
    } catch (err: unknown) {
      if (err) {
        handleSignUpErrors([err]);
      } else {
        setSignUpError(t('something_went_wrong'));
      }
    }
  };

  useEffect(() => {
    const checkFormValidity = () => {
      const { firstName, lastName, emailAddress, phoneNumber, password, termsAndConditions } = signUpForm.getValues();

      const isValid =
        firstName.trim() !== '' &&
        lastName.trim() !== '' &&
        emailAddress.trim() !== '' &&
        phoneNumber.trim() !== '' &&
        password.trim() !== '' &&
        termsAndConditions === true &&
        Object.keys(signUpForm.formState.errors).length === 0;

      setIsButtonEnabled(isValid);
    };

    const subscription = signUpForm.watch(checkFormValidity);
    return () => subscription.unsubscribe();
  }, [signUpForm]);

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
          title={t('create_account')}
          titleStyle={[styles.headerTitle, { color: theme.colors.onSecondaryContainer }]}
        />
        <View style={{ width: 40 }} />
      </Appbar.Header>
      <View style={styles.container}>
        <Controller
          control={signUpForm.control}
          name="firstName"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label={t('first_name')}
              returnKeyType="next"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
              containerStyles={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={signUpForm.control}
          name="lastName"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label={t('last_name')}
              returnKeyType="next"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={error?.message}
              containerStyles={styles.inputContainer}
            />
          )}
        />

        <Controller
          control={signUpForm.control}
          name="emailAddress"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label={t('email')}
              returnKeyType="next"
              value={value}
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                if (signUpError) setSignUpError(undefined);
              }}
              errorText={error?.message}
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              containerStyles={styles.inputContainer}
            />
          )}
        />

        <View style={styles.phoneInputContainer}>
          <View style={styles.phoneInput}>
            <View style={styles.countryCodePickerContainer}>
              <CountryCodePicker selectedCountry={selectedCountry} onSelectCountry={setSelectedCountry} />
            </View>
            <Controller
              control={signUpForm.control}
              name="phoneNumber"
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <FormInput
                  label={t('phone_number')}
                  placeholder="82345 54389"
                  placeholderTextColor="#aaa"
                  returnKeyType="done"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (signUpError) setSignUpError(undefined);
                  }}
                  onBlur={onBlur}
                  hasError={!!error?.message}
                  keyboardType="phone-pad"
                  selectionColor={theme.colors.onPrimaryContainer}
                  underlineColor="transparent"
                  mode="outlined"
                  containerStyles={styles.phoneInputField}
                />
              )}
            />
          </View>

          {signUpForm.formState.errors.phoneNumber && (
            <Paragraph style={[styles.phoneInputFieldError, { color: theme.colors.onErrorContainer }]}>
              {signUpForm.formState.errors.phoneNumber.message}
            </Paragraph>
          )}
        </View>

        <Controller
          control={signUpForm.control}
          name="password"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <FormInput
              label={t('password')}
              returnKeyType="done"
              value={value}
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                if (signUpError) setSignUpError(undefined);
              }}
              errorText={error?.message}
              isPassword
              containerStyles={styles.inputContainer}
            />
          )}
        />

        <View style={styles.dropdown}>
          <Dropdown
            label={t('Select Currency')}
            value={selectedCurrency}
            onSelect={(value) => {
              setSelectedCurrency(value ?? 'INR');
            }}
            options={currencyOptions}
          />
        </View>

        <Controller
          control={signUpForm.control}
          name="termsAndConditions"
          render={({ field: { value, onChange } }) => (
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => onChange(!value)} style={styles.checkboxTouchable}>
                <Checkbox
                  status={value ? 'checked' : 'unchecked'}
                  color={theme.colors.primary}
                  onPress={() => onChange(!value)}
                />
              </TouchableOpacity>
              <Paragraph style={styles.checkboxText}>{t('terms_and_conditions')}</Paragraph>
            </View>
          )}
        />

        {signUpError && (
          <Paragraph style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>{signUpError}</Paragraph>
        )}

        <Button
          mode="contained"
          onPress={signUpForm.handleSubmit(onSignUpPress)}
          style={styles.button}
          disabled={!isButtonEnabled || signUpForm.formState.isSubmitting}
        >
          {signUpForm.formState.isSubmitting ? (
            <ActivityIndicator animating={true} color={theme.colors.secondary} />
          ) : (
            t('sign_up')
          )}
        </Button>
        <View style={styles.row}>
          <Paragraph style={styles.label}>{t('dont_have_account')} </Paragraph>
          <TouchableOpacity
            onPress={() => {
              setSignUpError(undefined);
              signUpForm.reset();
              navigation.navigate('Login');
            }}
          >
            <Paragraph style={[styles.link, { color: theme.colors.primary }]}>{t('login')}</Paragraph>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  countryCodePickerContainer: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
  },
  button: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
  link: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: -4,
  },
  countryCodeInput: {
    backgroundColor: '#eee',
  },
  errorText: {
    color: 'red',
    marginTop: 2,
    textAlign: 'center',
    fontSize: 14,
  },
  phoneInputContainer: {
    width: '100%',
    marginBottom: -4,
  },
  phoneInput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneInputField: {
    flex: 1,
    marginBottom: -4,
  },
  phoneInputFieldError: {
    color: 'red',
    textAlign: 'left',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
  checkboxTouchable: {
    padding: 8,
    zIndex: 100,
  },
  checkboxText: {
    fontSize: 14,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdown: {
    width: '100%',
    marginTop: 12,
    marginBottom: 4,
  },
  container: {
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
});

export default SignUpScreen;
