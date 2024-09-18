export interface CountryData {
  id: number;
  name: string;
  nativeName: string;
  code: string;
  flag: string;
}

export const countries: CountryData[] = [
  { id: 1, name: 'India', nativeName: 'भारत', code: '+91', flag: '🇮🇳' },
  { id: 2, name: 'United States', nativeName: 'United States', code: '+1', flag: '🇺🇸' },
  { id: 3, name: 'United Kingdom', nativeName: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { id: 4, name: 'Canada', nativeName: 'Canada', code: '+1', flag: '🇨🇦' },
  { id: 5, name: 'Australia', nativeName: 'Australia', code: '+61', flag: '🇦🇺' },
  { id: 6, name: 'Germany', nativeName: 'Deutschland', code: '+49', flag: '🇩🇪' },
  { id: 7, name: 'France', nativeName: 'France', code: '+33', flag: '🇫🇷' },
  { id: 8, name: 'Japan', nativeName: '日本', code: '+81', flag: '🇯🇵' },
  { id: 9, name: 'Brazil', nativeName: 'Brasil', code: '+55', flag: '🇧🇷' },
  { id: 10, name: 'Mexico', nativeName: 'México', code: '+52', flag: '🇲🇽' },
];
