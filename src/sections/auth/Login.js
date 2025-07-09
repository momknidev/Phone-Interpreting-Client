// @mui
import { Stack, Typography } from '@mui/material';

// layouts
import LoginLayout from '../../layouts/login';
//

import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
        <Typography variant="h4">Login</Typography>
      </Stack>
      <AuthLoginForm />
    </LoginLayout>
  );
}
