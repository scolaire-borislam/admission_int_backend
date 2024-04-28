'use client'
import * as React from 'react';
import {useEffect,useState, useRef} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {TextField,Snackbar ,Alert, AlertColor, InputLabel,FormLabel,Modal, TextareaAutosize , Select, MenuItem } from '@mui/material';

import NextLink from 'next/link';
import Copyright from '@/components/Copyright';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import {useCandAppStore} from './../../store/CandApplicationStore'
import {CandApplication,candApptoJson} from './../../model/CandApplication'
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/navigation';
import { grey } from '@mui/material/colors';
import { makeStyles } from '@mui/material/styles';
import {getDocFileUrl} from "./../../util/CommonUtil";
import {LoadingModal, LoadingModalProps} from "./../../components/LoadingModal";


const labelStyle = {
  color: 'blue',
  fontSize: '0.9rem',
  fontWeight: 'bold',
}

const inputStyle = {
  fontSize: '0.8rem',
}

const imagModalstyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center'
};

interface Message {
  severity : AlertColor;
  message: string;
}



export default function Application() {
  
  const router = useRouter()
  const getCandAppStore = useCandAppStore();
  const candApp= getCandAppStore.curApp;
  const [value, setValue] = useState<string>('');

  const [openImg, setOpenImg] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | undefined>('');
  
  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  const handleCloseModal = () => {
      setOpenLoadingModal(false);
  };


  const handleOpenImg = () => {
    setOpenImg(true);
  };

  const handleCloseImg = () => {
    setOpenImg(false);
  };

  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState<Message>({
    severity: 'info',
    message: ''  
  });

  const prompMessage = (message : Message) => {
    setMessage(message);
    setOpenMessage(true);
  }
  const handleCloseMessage = () => {
    setOpenMessage(false); 
  };

  const  viewFile = async (fileKey : string) => {
     
     let fileUrl  = await getDocFileUrl(fileKey,"get_object");
     console.log(fileUrl)
     setImgUrl(fileUrl)
     setOpenImg(true);
  }; 
  
  const approvedAppliaction = async () => {
      let candApp = getCandAppStore.curApp;
      try {
        setOpenLoadingModal(true);
        if (candApp) {     
          
          let updateCandInfoJson  = candApptoJson(candApp);
          updateCandInfoJson.status = "APPROVED"   
          console.log(updateCandInfoJson)
          await getCandAppStore.updateApp(updateCandInfoJson);
          await getCandAppStore.retreiveApp(candApp.email, candApp.appNo);
        }
        setOpenLoadingModal(false);
        prompMessage({
          'severity': 'success',
          'message' :'Application Approved',
        })
      } catch (err ) {
        setOpenLoadingModal(false);
        prompMessage({
          'severity': 'error',
          'message' :'Error in Appliaction Approval',
        })
      }      
  }

  const rejectAppliaction = async () => {
    let candApp = getCandAppStore.curApp;
    try {
      setOpenLoadingModal(true);
      if (candApp) {     
        
        let updateCandInfoJson  = candApptoJson(candApp);
        updateCandInfoJson.status ="REJECTED"
        console.log(updateCandInfoJson)
        await getCandAppStore.updateApp(updateCandInfoJson);
        await getCandAppStore.retreiveApp(candApp.email, candApp.appNo);
      }
      setOpenLoadingModal(false);
      prompMessage({
        'severity': 'warning',
        'message' :'Application Rejected',
      })
    } catch (err ) {
      setOpenLoadingModal(false);
      prompMessage({
        'severity': 'error',
        'message' :'Error in Appliaction Approval',
      })
    }      
}

const issueCard = async (institutionCode : string) => {
  let candApp = getCandAppStore.curApp;
  let candMaster = getCandAppStore.curCandMaster;

  try {
    setOpenLoadingModal(true);
    console.log(candApp?.uid)

    if (candApp) {     
      
      getCandAppStore.retreiveCandMaster(candApp?.uid );
      console.log('after retreive cand master and wallet')
      if (candMaster?.walletAddress == null ||
          candMaster?.walletAddress == undefined )
          {
            prompMessage({
              'severity': 'error',
              'message' :'Candidate did not setup wallet!',
            })
            setOpenLoadingModal(false);
            return;
          }
          else {
            let paramJson  = { 'uid': candMaster?.uid,'to_addr': candMaster?.walletAddress , 'app_no': candApp.appNo , 'email':candApp.email, 'institution':institutionCode}  ; 
            console.log(paramJson)
            
            await getCandAppStore.issueCard(paramJson);

  
            await getCandAppStore.retreiveApp(candApp.email, candApp.appNo);

          }

    }
    setOpenLoadingModal(false);
    prompMessage({
      'severity': 'success',
      'message' :'Card Issued Successfully',
    })
  } catch (err ) {
    setOpenLoadingModal(false);
    prompMessage({
      'severity': 'error',
      'message' :'Error in Card Issue',
    })
  }      
}



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
        <LoadingModal  openLoadingModal={openLoadingModal} setOpenLoadingModal={handleCloseModal}></LoadingModal>
        <Modal 
          open={openImg}
          onClose={handleCloseImg}
         >
            <Box sx={imagModalstyle}>
              <img 
                src={imgUrl} 
                alt="Image preview"
                width="70%"
              />
            </Box>
        </Modal>
        <Snackbar 
          open={openMessage}
          autoHideDuration={6000}
          onClose={handleCloseMessage}   
          >       
          <Alert
            onClose={handleCloseMessage}
            severity={message.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message.message}
          </Alert>
        </Snackbar>
        <Box sx={{ maxWidth: 'sm' }}>
            <Box height={100} />
            < Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              Application Detail
            </Typography>
            
         </Box>
          <Box component="form" >
            <Box
              sx={{  minWidth: 1024, borderRadius: '10px', border: '2px solid grey' }} >
                  <Box margin={1}>
                     <FormLabel style={{color: 'grey',  fontWeight: 'bold'}}>Application No: </FormLabel>
                     <FormLabel style={{color: 'red',  fontWeight: 'bold'}}>{candApp?.appNo}</FormLabel>
                  </Box>
                  <Box  display="grid" gridTemplateColumns="50% 50%"
                  >
                        {/* 1st column */}
                        <Box  display="grid"
                          gridTemplateColumns='30% 70%'   
                        >
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>Surname : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.surname}
                            </Typography>
                          </Box>
                          <Box  margin={1}>
                            <FormLabel style={labelStyle}>Given Name : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>                    
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                                {candApp?.givenName}
                              </Typography>
                          </Box>
                          <Box   margin={1}>
                            <FormLabel style={labelStyle}>Email : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                                  {candApp?.email}
                                </Typography>
                          </Box>     
                          <Box   margin={1}>
                            <FormLabel style={labelStyle}>ID No. (1st 4 Character): &nbsp;</FormLabel>
                          </Box>
                          <Box   margin={1}>  
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                                  {candApp?.idDocNo}
                            </Typography>
                          </Box>     
                          <Box margin={1}             
                            sx={{                        
                              display: 'flex', alignItems: 'flex-start'                         
                            }}>
                          <FormLabel style={labelStyle}>Address : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>  
                            <Typography variant="subtitle2" component="pre" sx={{ mb: 2 }}>
                                  {candApp?.address}
                            </Typography>
                          </Box>
                          <Box  margin={1}>
                            <FormLabel style={labelStyle}>Gender : &nbsp;</FormLabel>
                          </Box>          
                          <Box margin={1}>
                            <Typography variant="subtitle2" component="pre" sx={{ mb: 2 }}>
                                  {candApp?.gender}
                            </Typography>
                          </Box>   
                          <Box  margin={1}>
                            <FormLabel style={labelStyle}>DOB : &nbsp;</FormLabel>
                          </Box>          
                          <Box margin={1}>
                            <Typography variant="subtitle2" component="pre" sx={{ mb: 2 }}>
                              {candApp?.dateOfBirth.toLocaleDateString('en-CA', {
                                year: 'numeric', 
                                month: '2-digit',
                                day: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>SEN Student? : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.sen.toString()}
                            </Typography>
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>SEN Details : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.senDetail}
                            </Typography>
                          </Box>   
                        </Box>
                        {/* 2nd column */}
                        <Box  display="grid" 
                          gridTemplateColumns='40% 60%'   
                        >
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>Application Status : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.status}
                            </Typography>

                            {candApp?.hkitScardPath &&
                              <Button variant="text" onClick={() => viewFile(candApp?.hkitScardPath)}>HKIT STUDENT CARD</Button>
                            }
                            {candApp?.uwlScardPath &&
                              <Button variant="text" onClick={() => viewFile(candApp?.uwlScardPath)}>UWL STUDENT CARD</Button>
                            }
                          </Box>  
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>Programme Provider : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.programName}
                            </Typography>
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>Programme Name : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.programProvider}
                            </Typography>
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>Entry Year : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.entryYear}
                            </Typography>
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}>Mode of study : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            <Typography variant="subtitle2"  sx={{ mb: 2 }}>
                              {candApp?.modeOfStudy}
                            </Typography>
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}> Photo : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                             {candApp?.photoPath &&
                              <Button variant="text" onClick={() => viewFile(candApp?.photoPath)}>View File</Button>
                             }
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}> Education Qualification : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                             {candApp?.educationQualification1 &&
                              <Button variant="text" onClick={() => viewFile(candApp?.educationQualification1)}>View File1</Button>
                             }
                             {candApp?.educationQualification2 &&
                              <Button variant="text" onClick={() => viewFile(candApp?.educationQualification2)}>View File2</Button>
                             }
                             {candApp?.educationQualification3 &&
                              <Button variant="text" onClick={() => viewFile(candApp?.educationQualification3)}>View File3</Button>
                             }
                          </Box>
                          <Box margin={1}>
                            <FormLabel style={labelStyle}> Professional Qualification : &nbsp;</FormLabel>
                          </Box>
                          <Box margin={1}>
                            {candApp?.professionalQualification1 &&
                              <Button variant="text" onClick={() => viewFile(candApp?.professionalQualification1)}>View File1</Button>
                            }
                            {candApp?.professionalQualification2 &&
                              <Button variant="text" onClick={() => viewFile(candApp?.professionalQualification2)}>View File2</Button>
                            }
                            {candApp?.professionalQualification2 &&
                              <Button variant="text" onClick={() => viewFile(candApp?.professionalQualification3)}>View File3</Button>
                            }
                          </Box>
                        </Box>  
                  </Box>
                  <Box  margin={2} gap={1} display="grid" gridTemplateColumns="repeat(3, 1fr)">
                    {(candApp?.status !== 'APPROVED' && candApp?.status !== 'REJECTED' && candApp?.status !== 'APPROVED-CARD-ISSUED') && (
                      <Button sx={{bgcolor : 'green'}} variant="contained" onClick={approvedAppliaction}>Approved Application</Button>                    
                    )}
                    {(candApp?.status !== 'APPROVED' && candApp?.status !== 'REJECTED' && candApp?.status !== 'APPROVED-CARD-ISSUED') &&
                      <Button sx={{bgcolor : 'red'}} variant="contained" onClick={rejectAppliaction}>Rejected Application</Button>
                    }
                    {candApp?.status === 'APPROVED' &&
                      <Button sx={{bgcolor : 'blue'}} variant="contained" onClick={() => issueCard('HKIT')}>Issue Student Card (HKIT)</Button>
                    }
                     {candApp?.status === 'APPROVED' &&
                      <Button sx={{bgcolor : 'PURPLE'}} variant="contained"  onClick={() => issueCard('UWL')}>Issue Student Card (UWL)</Button>
                    }
                     {(candApp?.status === 'APPROVED-CARD-ISSUED' ) && (
                      <Button sx={{bgcolor : 'blue'}} variant="contained" onClick={() => issueCard('HKIT')}>Re-Issue Student Card (HKIT)</Button>
                    )}
                     {(candApp?.status === 'APPROVED-CARD-ISSUED' ) && (
                      <Button sx={{bgcolor : 'PURPLE'}} variant="contained"  onClick={() => issueCard('UWL')}>Re-Issue Student Card (UWL)</Button>
                    )}
                  </Box>
            </Box>
         </Box>
         <Box margin={1}/> 
        <Copyright />
      </Box>
    </Container>
  );
}
