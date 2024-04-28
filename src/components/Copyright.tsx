import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Copyright() {
  return (
    <Typography variant="body2" color="#1776D0" align="center" sx={{ fontWeight: 'bold' }}>
      {'Copyright © '}
      <MuiLink color="inherit" href="https://mui.com/">
        Boris Lam
      </MuiLink>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}
