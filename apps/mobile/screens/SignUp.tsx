import { useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIError } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpForm, signUpFormSchema } from '@ingeniti/shared';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import Background from '../components/Background';
import Button from '../components/Button';
import CountryCodePicker from '../components/CountryCodePicker';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Themes } from '../styles/themes';
import { SignupProps } from '../types';
import { countries, CountryData } from '../utils/country-data';

const SignUpScreen: React.FC<SignupProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { isLoaded, signUp } = useSignUp();
  const [signUpError, setSignUpError] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);

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
    mode: 'onBlur',
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
      console.log('signUp', emailAddress, phone, password);
      await signUp.create({
        emailAddress,
        phoneNumber: phone,
        password,
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
      handleSignUpErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Background>
      <Header>{t('create_account')}</Header>
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
          />
        )}
      />

      <View style={styles.phoneInputContainer}>
        <View style={styles.phoneInput}>
          <CountryCodePicker
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
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
                selectionColor={Themes.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                containerStyles={styles.phoneInputField}
              />
            )}
          />
        </View>

        {signUpForm.formState.errors.phoneNumber && (
          <Paragraph style={styles.phoneInputFieldError}>
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
          />
        )}
      />

      <Controller
        control={signUpForm.control}
        name="termsAndConditions"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => onChange(!value)} style={styles.checkboxTouchable}>
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                color={Themes.colors.primary}
                onPress={() => onChange(!value)}
              />
            </TouchableOpacity>
            <Paragraph style={styles.checkboxText}>{t('terms_and_conditions')}</Paragraph>
          </View>
        )}
      />

      {signUpError && <Paragraph style={styles.errorText}>{signUpError}</Paragraph>}

      <Button
        mode="contained"
        onPress={signUpForm.handleSubmit(onSignUpPress)}
        style={styles.button}
        disabled={signUpForm.formState.isSubmitting || !signUpForm.formState.isValid}
      >
        {t('sign_up')}
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
          <Paragraph style={styles.link}>{t('login')}</Paragraph>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => {
          setSignUpError(undefined);
          signUpForm.reset();
          navigation.goBack();
        }}
      >
        <Paragraph style={styles.goBackText}>{t('go_back')}</Paragraph>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Themes.colors.primary,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Themes.colors.surface,
  },
  countryCodeInput: {
    backgroundColor: '#eee',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  goBackButton: {
    marginTop: 24,
  },
  goBackText: {
    color: Themes.colors.primary,
    fontWeight: '600',
  },
  phoneInputContainer: {
    width: '100%',
  },
  phoneInput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  phoneInputField: {
    flex: 1,
  },
  phoneInputFieldError: {
    color: 'red',
    textAlign: 'left',
    fontSize: 12,
    marginTop: -8,
    marginLeft: 4,
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxTouchable: {
    padding: 8,
    zIndex: 100,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    marginLeft: -48,
    zIndex: 1,
  },
});

export default SignUpScreen;
