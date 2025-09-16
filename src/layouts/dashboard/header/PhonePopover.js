import { useState } from 'react';
// @mui
import {
  Box,
  ButtonBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
// locales
// components
import MenuPopover from '../../../components/menu-popover';
import Iconify from '../../../components/iconify';
import { useAuthContext } from '../../../auth/useAuthContext';
import { useSettingsContext } from '../../../components/settings';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

export default function PhonePopover() {
  const { user } = useAuthContext();

  const { phone, onChangePhone } = useSettingsContext();

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangePhone = (phoneNumber) => {
    console.log('Selected phone:', phoneNumber);
    onChangePhone(phoneNumber);
    handleClosePopover();
  };

  return (
    <>
      <ButtonBase
        onClick={handleOpenPopover}
        disabled={!user?.client_phones?.length}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.75,
          borderRadius: 1,
          spacing: 1,
          bgcolor: 'background.neutral',

          ...(openPopover && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <SvgColor
          src="/assets/icons/navbar/ic_phone.svg"
          sx={{ width: 16, height: 16, mr: 1, color: 'text.primary' }}
        />
        <Typography variant="subtitle2" sx={{ mr: 1, color: 'text.primary' }}>
          {user?.client_phones?.find((p) => p.id === phone?.id)?.phone || 'Select Phone'}
        </Typography>

        <Box
          component="span"
          sx={{
            ml: 1,
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Iconify icon="tdesign:arrow-up-down-1" width={20} height={20} />
        </Box>
      </ButtonBase>

      <MenuPopover open={openPopover} onClose={handleClosePopover} anchorEl={openPopover}>
        <Stack spacing={0.75} minWidth={140}>
          <List dense disablePadding>
            {user?.client_phones?.map((item) => (
              <ListItem
                button
                key={item.phone}
                onClick={() => handleChangePhone(item)}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  ...(item.phone === phone?.phone && {
                    bgcolor: 'action.selected',
                  }),
                }}
              >
                <ListItemAvatar>
                  <SvgColor
                    src="/assets/icons/navbar/ic_phone.svg"
                    sx={{ width: 16, height: 16 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="column" spacing={0.5}>
                      <Typography variant="body2" noWrap>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" noWrap>
                        {item.phone}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </MenuPopover>
    </>
  );
}
