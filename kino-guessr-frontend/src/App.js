import './App.css';
import React, { useState } from 'react';
import { Box, Container, Grid, Paper, TextField, Button } from '@mui/material';
import headerImage from './images/header.png';
import blankImage from './images/blank.png';
import blankImage2 from './images/blank2.png';

function App() {
  return (
    <div style={{ backgroundColor: '#8eb7d4', height: '100vh' }}>
      <Box display="flex" justifyContent="center" alignItems="center" padding={1} >
        <img src={headerImage} alt="Header" style={{ maxWidth: '100%', width: '40vw', height: 'auto' }} />
      </Box>
      <Container maxWidth="md">
      <Grid container spacing={1} justifyContent="center">
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={4} key={index}>
            <Paper elevation={3} style={{ padding: '5px' }}>
              <img 
                src={index === 5 ? blankImage2 : blankImage}
                alt={`Actor ${index + 1}`} 
                style={{ width: '100%', height: 'auto' }} 
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
      </Container>

    </div>
  );
}

export default App;
