import { useTranslation } from 'react-i18next';

import Background from '../components/Background';
import Header from '../components/Header';

export default function ProfileScreen() {
  const { t } = useTranslation();

  return (
    <Background>
      <Header>{t('profile')}</Header>
    </Background>
  );
}
