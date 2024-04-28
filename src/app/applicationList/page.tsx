"use client"
import React, { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Select,SelectChangeEvent,  MenuItem,InputLabel ,NativeSelect, Modal, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import NextLink from 'next/link';
import Copyright from '@/components/Copyright';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import { useRouter } from 'next/navigation';
import {useCandAppStore} from './../../store/CandApplicationStore'
import {CandApplication} from './../../model/CandApplication'
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import TextField from '@mui/material/TextField';

export default function ApplicationList() {

  const router = useRouter()


  const getCandAppStore = useCandAppStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    appNo: '',
    progCode: '',
  }); 

  async function handleSubmit(event: FormEvent)  {

    setOpen(true);
    setLoading(true);
    console.log(formValues);
    try {
      
      const email = formValues.email as string; 
      const appNo = formValues.appNo  as string;      
      const progCode = formValues.progCode  as string;      

      
      await getCandAppStore.searchApp(email,appNo, progCode);        
      console.log("cand App  ",getCandAppStore.listCandApp);
      console.log(getCandAppStore.error)
      if (getCandAppStore.error != null) {
        console.log("error handling")
        console.log(getCandAppStore.error);
      } 
      console.log("end of searching")
    } catch (error) {
      console.log('error searching', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleInputValue= (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const id = event.target.id;
    console.log(event);
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSelectValue= (event: SelectChangeEvent<string>) => {
    const {name, value } = event.target as HTMLSelectElement;    
    console.log(event);
    setFormValues((prevValues) => ({
      ...prevValues,
      ['progCode']: value,
    }));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'appNo', headerName: 'App No', width: 200 },
    { field: 'surname', headerName: 'Surname', width: 80 },
    { field: 'givenName', headerName: 'Given Name', width: 100 },
    { field: 'programName',
      headerName: 'Program Name',
      width: 180,
    },
    { field: 'programProvider',
      headerName: 'Program Provider',
      width: 180,
    },
    { field: 'status', headerName: 'Status', width: 200 },
  ];

  const handleSelectionModelChange = (params: GridRowSelectionModel) => {
    let id =  params.at(0);
    let selectedCand : CandApplication | undefined;
    //console.log("row selcetion 2" , id);
    selectedCand = getCandAppStore.listCandApp.find(app => app.id === id )
    if (selectedCand) {
      getCandAppStore.setApp(selectedCand)
      router.push("/application");
      //console.log(getCandAppStore.curApp)
    }    
  };

  return (
    <Container   sx={{
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto' 
    }}>
      <Box 
        sx={{
          //my: 4,
           maxWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ResponsiveAppBar></ResponsiveAppBar>

        <Modal
            open={open}
            onClose={() => setOpen(false)}
          >
          <div 
              style={{
                width: '100%',
                height: '100%',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center' 
              }}
            >
          <CircularProgress />
          </div>
        </Modal>

         <Box sx={{ maxWidth: 'sm' }}>
            <Box height={100} />
            < Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              Application Search
            </Typography>
            
         </Box>

         <Box 
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <Box display="grid" gridTemplateColumns="repeat(4, 1fr)"
>
                  <Box>
                    <TextField size="small"
                      label="Email"
                      name="email"
                      id="email"
                      value={formValues.email}
                      onChange={handleInputValue} 
                    />
                  </Box>
                  <Box>
                    <TextField size="small"
                      label="App Number" 
                      name="appNo" 
                      id="appNo" 
                      value={formValues.appNo}
                      onChange={handleInputValue} 
                    />
                  </Box>
                  <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',  
                      }}>       
                    
                    <Select size="small"
                      labelId="demo-simple-select-helper-label"
                      id="progCode"
                      name="progCode"
                      label="Programme"
                      defaultValue="-"
                      
                      style={{                        
                        color: 'grey',  
                      }} 
                      onChange={handleSelectValue}
                      >                        
                      <MenuItem  key="-" value="-">
                        Programme         
                      </MenuItem>
                      <MenuItem  value="UWL-BS">Business Administration</MenuItem>
                      <MenuItem  value="UWL-CF">Criminology</MenuItem>
                      <MenuItem  value="UWL-CS">Cyber Security</MenuItem>
                    </Select>
                  </Box>

                  <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                    <Button variant="contained" onClick={handleSubmit}>
                      Search
                    </Button>
                  </Box>   
              </Box>
              <Box height={10} />
              <Divider />
              
                <DataGrid autoHeight
                style={{ width: '100%' }}
                  rows={getCandAppStore.listCandApp}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  onRowSelectionModelChange={handleSelectionModelChange}
                />
              



              <Box height={25} />  
            </Box>
        <Copyright />
      </Box>
    </Container>
  );
}
