// import * as React from 'react';
'use client';
import { useRouter } from 'next/navigation'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import Copyright from '@/components/Copyright';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { CircularProgress , Backdrop, Modal} from '@mui/material'
import {useUserStore} from '../store/UserStore';
import {LoadingModal, LoadingModalProps} from "./../components/LoadingModal";
import Image from 'next/image'
import banner from 'public/images/Scolaire-Ledger-horizontal-backend.png'

export default function Home() {

  const router = useRouter()
 

  const getUserStore = useUserStore();
  const [loading, setLoading] = useState(false);
  //const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    password: '',
    username: ''
  }); 

  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  const handleCloseModal = () => {
      setOpenLoadingModal(false);
  };

  async function handleSubmit(event: FormEvent)  {
    setOpenLoadingModal(true);
    setLoading(true);
    console.log(formValues);
    try {
      
      const username = formValues.username as string; 
      const password = formValues.password  as string;      

      
      await getUserStore.login(username,password);
      console.log("user name: ",getUserStore.curUser?.surname);
      console.log("user  ",getUserStore.curUser);
      console.log(getUserStore.error)
      if (getUserStore.error != null) {
        console.log("error handling")
        console.log(getUserStore.error);
      } else {
        console.log("start routing to Main")
        router.push('/main')

      }
      console.log("end of signin")
    } catch (error) {
      setLoading(false);
      setOpenLoadingModal(false);
      console.log('error signing in', error);
    }
  };

  const handleInputValue= (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    //console.log(event);
    const id = event.target.id;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={banner}
          width={400}
          alt="Picture of the author"
        />  
        <LoadingModal  openLoadingModal={openLoadingModal} setOpenLoadingModal={handleCloseModal}></LoadingModal>
        <Box 
        //  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          //onSubmit={handleSubmit}
        >

          <div>
            <TextField
              
              error = {false}
              id="username"
              label="Username"  
              onChange={handleInputValue}            
            />
          
          </div>
          <div>
            <TextField
              error = {false}
              id="password" 
              type="password"
              label="Password"
              variant="filled"
              onChange={ handleInputValue}  
            />
           
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button  variant="contained" color="primary"
            onClick={handleSubmit}>
              Login
            </Button>   
          </div>
        </Box>
        <Box marginTop={5} />
        <Copyright />
      </Box>
    </Container>
  );
}

