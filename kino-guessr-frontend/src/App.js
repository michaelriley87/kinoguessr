import './App.css';
import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import headerImage from './images/header.png';
import blankImage from './images/blank.png';
import blankImage2 from './images/blank2.png';

//test case images before backend is built
import test1 from './images/test1.png';
import test2 from './images/test2.png';
import test3 from './images/test3.png';
import test4 from './images/test4.png';
import test5 from './images/test5.png';
import test6 from './images/test6.png';

//function to transform answers to title case pre-display
function toTitleCase(str) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function App() {
  //game state variables
  const [gameStarted, setGameStarted] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  //test case answer before backend is built
  const correctAnswer = "Pulp Fiction";

  //refocus the input box on button clicks
  const inputRef = useRef(null);
  const focusInput = () => {
    const input = inputRef.current?.querySelector('input');
    if (input) {
      input.focus();
    }
  };

  //start game on 'Start' button click
  const startGame = () => {
    setGameStarted(true);
    setTimeout(focusInput, 100);
  };

  //process guesses on 'submit' button click / return
  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!gameStarted || isCorrect || attempts >= 5) return;
  
    const newAttemptNumber = attempts + 1;
    setAttempts(newAttemptNumber);
    
    const guess = userGuess.trim() === '' ? '*Pass*' : toTitleCase(userGuess);

    if (guess.toLowerCase() === correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      setMessage(previousMessage => previousMessage + `\n${newAttemptNumber}. ${guess} - Correct!`);
    } else {
      setMessage(previousMessage => previousMessage + `\n${newAttemptNumber}. ${guess}`);
    }
    setUserGuess('');
    setTimeout(focusInput, 100);
  };

  //reset game on 'new game' button click
  const handleReset = () => {
    setUserGuess('');
    setAttempts(0);
    setMessage('');
    setIsCorrect(false);
    setGameStarted(false);
  };

  //grid element styling
  const gridItemStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    borderRadius: '10px',
    border: '5px solid white',
    backgroundColor: '#f5eedc',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)'
  };

  return (
    <div style={{ backgroundColor: '#8eb7d4', height: '100vh' }}>
      <Box display="flex" justifyContent="center" alignItems="center" padding={1}>
        <img src={headerImage} alt="Header" style={{ maxWidth: '100%', width: '40vw', height: 'auto', borderRadius: '10px' }} />
      </Box>
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={3}>
            <img src={gameStarted ? test1 : blankImage} alt="Actor 1" style={gridItemStyle} />
          </Grid>
          <Grid item xs={3}>
            <img src={isCorrect || attempts > 0 ? test2 : blankImage} alt="Actor 2" style={gridItemStyle} />
          </Grid>
          <Grid item xs={3}>
            <img src={isCorrect || attempts > 1 ? test3 : blankImage} alt="Actor 3" style={gridItemStyle} />
          </Grid>
          <Grid item xs={3}>
            <Card  style={gridItemStyle}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Instructions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1. Guess the film by its actors.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  2. After every wrong answer a new actor will be revealed.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3. You have 5 chances to guess the film correctly.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <img src={isCorrect || attempts > 2 ? test4 : blankImage} alt="Actor 5" style={gridItemStyle} />
          </Grid>
          <Grid item xs={3}>
            <img src={isCorrect || attempts > 3 ? test5 : blankImage} alt="Actor 6" style={gridItemStyle} />
          </Grid>
          <Grid item xs={3}>
            <img src={isCorrect || attempts >= 5 ? test6 : blankImage2} alt="Actor 7" style={gridItemStyle} />
          </Grid>
          <Grid item xs={3}>
            <Card style={gridItemStyle}>
              {gameStarted ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <TextField label="Guess"
                      variant="standard"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value)}
                      disabled={attempts >= 5 || isCorrect}
                      inputProps={{ maxLength: 40 }}
                      ref={inputRef}
                    />
                    <Button type="submit" disabled={attempts >= 5 || isCorrect}>Submit</Button>
                  </form>
                  <div style={{ textAlign: 'left', width: '100%' }}>
                    {message.split('\n').map((line, i) => (
                      <Typography key={i} style={{ color: line.includes('Correct!') ? 'green' : 'red' }}>
                        {line}
                      </Typography>
                    ))}
                  </div>
                  {(isCorrect || attempts >= 5) && (
                    <Button onClick={handleReset} style={{ marginTop: '10px' }}>New Game</Button>
                  )}
                </>
              ) : (
                <Button onClick={startGame} style={{ height: '40px' }}>Start</Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;