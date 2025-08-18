// i18n
import './locales/i18n';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
/* eslint-disable import/no-unresolved */
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'react-international-phone/style.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------
import { createUploadLink } from 'apollo-upload-client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// locales
import ThemeLocalization from './locales';
// components
import { StyledChart } from './components/chart';
import SnackbarProvider from './components/snackbar';
import ScrollToTop from './components/scroll-to-top';
import { MotionLazyContainer } from './components/animate';
import { ThemeSettings, SettingsProvider } from './components/settings';
import { AuthProvider } from './auth/JwtContext';

// ----------------------------------------------------------------------

let httpLink = createUploadLink({
  uri: process.env.REACT_APP_APOLLO_SERVER_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

httpLink = authLink.concat(httpLink);

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: false }),
  link: httpLink,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <HelmetProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
              <BrowserRouter>
                <ScrollToTop />
                <MotionLazyContainer>
                  <ThemeProvider>
                    <ThemeSettings>
                      <ThemeLocalization>
                        <SnackbarProvider>
                          <StyledChart />
                          <Router />
                        </SnackbarProvider>
                      </ThemeLocalization>
                    </ThemeSettings>
                  </ThemeProvider>
                </MotionLazyContainer>
              </BrowserRouter>
            </SettingsProvider>
          </LocalizationProvider>
        </HelmetProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
