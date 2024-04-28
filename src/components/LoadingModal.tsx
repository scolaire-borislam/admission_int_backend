'use client'
import React, {  useState, forwardRef ,Ref,RefObject, } from 'react';
import {Modal,ModalProps } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress' ;


export interface LoadingModalProps{
    openLoadingModal: boolean;    
    setOpenLoadingModal: (open: boolean) => void;
}

//export const LoadingModal : React.FC<LoadingModalProps> = ({ openLoadingModal, setOpenLoadingModal }) => {
//const LoadingModal = forwardRef<LoadingModalProps, {openLoadingModal: () => void}>((props, ref) => {   
//const LoadingModal = forwardRef<HTMLDivElement, LoadingModalProps>((props, ref) => (
//export const LoadingModal = forwardRef<HTMLDivElement, LoadingModalProps>((props, ref) => {

export const LoadingModal = (props: LoadingModalProps ) => {

    return (
        <Modal
            open={props.openLoadingModal}
            onClose={props.setOpenLoadingModal}           
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
    );
}
//export default LoadingModal;