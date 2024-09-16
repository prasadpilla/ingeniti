export interface CountryData {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export const countries: CountryData[] = [
  { id: 1, name: 'India', code: '+91', flag: '🇮🇳' },
  { id: 2, name: 'United States', code: '+1', flag: '🇺🇸' },
  { id: 3, name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { id: 4, name: 'Canada', code: '+1', flag: '🇨🇦' },
  { id: 5, name: 'Australia', code: '+61', flag: '🇦🇺' },
  { id: 6, name: 'Germany', code: '+49', flag: '🇩🇪' },
  { id: 7, name: 'France', code: '+33', flag: '🇫🇷' },
  { id: 8, name: 'Japan', code: '+81', flag: '🇯🇵' },
  { id: 9, name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { id: 10, name: 'Mexico', code: '+52', flag: '🇲🇽' },
];
