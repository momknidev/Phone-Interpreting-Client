// @mui
import { enUS, itIT } from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    label: 'Italian',
    value: 'it',
    systemValue: itIT,
    icon: '/assets/icons/flags/ic_flag_it.svg',
  },
];

export const defaultLang = allLangs[0]; // English
