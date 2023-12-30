import './App.css';
import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import headerImage from './images/header.png';
import blankImage from './images/blank.png';

function App() {
  return (
    <div style={{ backgroundColor: '#8eb7d4', height: '100vh' }}>
      <Box display="flex" justifyContent="center" alignItems="center" padding={2} >
        <img src={headerImage} alt="Header" style={{ maxWidth: '100%', width: '40vw', height: 'auto' }} />
      </Box>
      
      <Grid container spacing={1} justifyContent="center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Grid item xs={2} key={index}>
            <Paper elevation={3} style={{ padding: '5px' }}>
              <img src={blankImage} 
              alt={`Actor ${index + 1}`} 
              style={{ width: '100%', height: 'auto' }} 
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default App;
