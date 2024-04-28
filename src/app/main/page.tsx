'use client'
import * as React from 'react';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import Copyright from '@/components/Copyright';

import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import {useUserStore} from '../../store/UserStore';
import { useRouter } from 'next/navigation';
import ScolaireIcon from '@/components/ScolaireIcon';
export default function Main() {
  const router = useRouter()
  const getUserStore = useUserStore();

  useEffect(() => {

    if (getUserStore.isSessionExpred() ) {
      console.log("User  expired")
      router.push("/timeout");
    } else  {
      console.log("User NOT  expired !")
    }

  }, []);  

  return (
    <Container   sx={{
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto' 
    }}>
      <Box 
        sx={{
          //my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ResponsiveAppBar></ResponsiveAppBar>
        
          <Box height={100} />  
         <Box marginTop={2} />
         <Typography
              variant="h3"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                //display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'impact',
                fontWeight: 600,
                letterSpacing: '.1rem',
                color: '#1776D0',
                textDecoration: 'none',
              }}
            >
              SCOLAIRE LEDGER 
            </Typography>
            <br/>
            <Typography
              variant="h3"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                //display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'impact',
                fontWeight: 600,
                letterSpacing: '.1rem',
                color: '#1776D0',
                textDecoration: 'none',
              }}
            >
            BACKEND SYSTEM
            </Typography>         
         <ScolaireIcon size={300} color={"#1776D0"} />
        <Copyright />
      </Box>
    </Container>
  );
}
