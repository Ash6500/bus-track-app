import React from 'react';
import { Alert, AlertTitle, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const OperationDetails = ({ message, severity = 'success', open, onClose }) => {
  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Collapse in={open}>
        <Alert
          severity={severity}
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </AlertTitle>
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default OperationDetails;
