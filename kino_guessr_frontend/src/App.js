import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import axios from "axios";
import headerImage from "./images/header.png";
import actorCardReverse from "./images/actor-card-reverse.png";
import posterCardReverse from "./images/poster-card-reverse.png";

//function to transform answers to title-case pre-display
function toTitleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

//function for randomizing the order of actors
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//function to extract actor name from file name
function getFilenameFromUrl(url) {
  if (!url) {return ''}
  const match = url.match(/([^\/]+)(?=\.\w+$)/);
  return match ? match[0].replace(/_/g, ' ') : '';
}

function App() {
  //game state variables
  const [gameStarted, setGameStarted] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [filmNames, setFilmNames] = useState([]);
  const [filmIDs, setFilmIDs] = useState({});
  const [filmTitle, setFilmTitle] = useState("");
  const [actorImages, setActorImages] = useState([]);
  const [posterImage, setPosterImage] = useState("");
  const autocompleteRef = useRef(null);

  //retrieve film names/ids for autocomplete and data retrieval
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/get_film_names/")
      .then((response) => {
        setFilmNames(response.data);
      })
      .catch((error) => console.error("Error fetching film names:", error));
    axios
      .get("http://localhost:8000/api/get_film_indexes/")
      .then((response) => {
        setFilmIDs(response.data);
      })
      .catch((error) => console.error("Error fetching film names:", error));
  }, []);

  //retrieve film data from id
  const fetchFilmDetailsById = async (filmId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/get_film_details/${filmId}`
      );
      const data = response.data;
      setFilmTitle(data.title);
      const actorImgUrls = data.actors.map(
        (actorImageUrl) => "http://localhost:8000" + actorImageUrl
      );
      setActorImages(shuffleArray(actorImgUrls));
      setPosterImage("http://localhost:8000" + data.poster);
    } catch (error) {
      console.error("Error fetching film details by ID:", error);
    }
  };

  //start game on 'Start' button click, select random film and remove from pool
  const startGame = () => {
    const randomIndex = Math.floor(Math.random() * filmIDs.length);
    const selectedFilmId = filmIDs[randomIndex];
    setFilmIDs((currentIDs) =>
      currentIDs.filter((id) => id !== selectedFilmId)
    );
    fetchFilmDetailsById(selectedFilmId).then(() => {
      setGameStarted(true);
    });
  };

  //process guesses on 'submit' button click / return
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!gameStarted || isCorrect || attempts >= 5) return;

    const newAttemptNumber = attempts + 1;
    setAttempts(newAttemptNumber);
    const guess = userGuess.trim() === "" ? "*Pass*" : toTitleCase(userGuess);

    if (guess.toLowerCase() === filmTitle.toLowerCase()) {
      setIsCorrect(true);
      setMessage(
        (previousMessage) =>
          previousMessage + `\n${newAttemptNumber}. ${guess} - Correct!`
      );
    } else {
      setMessage(
        (previousMessage) => previousMessage + `\n${newAttemptNumber}. ${guess}`
      );
    }
    setUserGuess("");

    if (autocompleteRef.current) {
      const input = autocompleteRef.current.querySelector("input");
      if (input) {
        input.focus();
      }
    }
  };

  //reset game on 'new game' button click
  const handleReset = () => {
    setUserGuess("");
    setAttempts(0);
    setMessage("");
    setIsCorrect(false);
    setGameStarted(false);
    setFilmTitle("");
  };

  return (
    <div className="app-container">
      <Box className="header-box">
        <img src={headerImage} alt="Header" className="header-image" />
      </Box>
      <Container maxWidth="md">
        <Grid container spacing={2.5} justifyContent="center">
          <Grid item xs={3}>
            <div className="flip-card">
              <div className={`flip-card-inner ${gameStarted ? 'flip' : ''}`}>
                <div className="flip-card-front">
                  <img src={actorCardReverse} alt="Actor 1" className="grid-item"/>
                </div>
                <div className="flip-card-back">
                  <img src={actorImages[0]} alt={getFilenameFromUrl(actorImages[0])} title={getFilenameFromUrl(actorImages[0])} className="grid-item"/>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="flip-card">
              <div className={`flip-card-inner ${isCorrect || attempts > 0 ? 'flip' : ''}`}>
                <div className="flip-card-front">
                  <img src={actorCardReverse} alt="Actor 2" className="grid-item"/>
                </div>
                <div className="flip-card-back">
                  <img src={actorImages[1]} alt={getFilenameFromUrl(actorImages[1])} title={getFilenameFromUrl(actorImages[1])} className="grid-item"/>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="flip-card">
              <div className={`flip-card-inner ${isCorrect || attempts > 1 ? 'flip' : ''}`}>
                <div className="flip-card-front">
                  <img src={actorCardReverse} alt="Actor 3" className="grid-item"/>
                </div>
                <div className="flip-card-back">
                  <img src={actorImages[2]} alt={getFilenameFromUrl(actorImages[2])} title={getFilenameFromUrl(actorImages[2])} className="grid-item"/>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Card className="grid-item">
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
            <div className="flip-card">
              <div className={`flip-card-inner ${isCorrect || attempts > 2 ? 'flip' : ''}`}>
                <div className="flip-card-front">
                  <img src={actorCardReverse} alt="Actor 4" className="grid-item"/>
                </div>
                <div className="flip-card-back">
                  <img src={actorImages[3]} alt={getFilenameFromUrl(actorImages[3])} title={getFilenameFromUrl(actorImages[3])} className="grid-item"/>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="flip-card">
              <div className={`flip-card-inner ${isCorrect || attempts > 3 ? 'flip' : ''}`}>
                <div className="flip-card-front">
                  <img src={actorCardReverse} alt="Actor 5" className="grid-item"/>
                </div>
                <div className="flip-card-back">
                  <img src={actorImages[4]} alt={getFilenameFromUrl(actorImages[4])} title={getFilenameFromUrl(actorImages[4])} className="grid-item"/>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className="flip-card">
              <div className={`flip-card-inner ${isCorrect || attempts > 4 ? 'flip' : ''}`}>
                <div className="flip-card-front">
                  <img src={posterCardReverse} alt="Poster" className="grid-item"/>
                </div>
                <div className="flip-card-back">
                  <img src={posterImage} alt={getFilenameFromUrl(posterImage)} title={getFilenameFromUrl(posterImage)} className="grid-item"/>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Card className="grid-item">
              {gameStarted ? (
                <>
                  <form onSubmit={handleSubmit}>
                    <Autocomplete
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Guess"
                          variant="standard"
                          autoFocus
                          autoComplete="off"
                          spellCheck="false"
                          inputProps={{ ...params.inputProps, maxLength: 40 }}
                          sx={{ width: "auto", minWidth: 190 }}
                        />
                      )}
                      ref={autocompleteRef}
                      freeSolo
                      options={userGuess.length > 0 ? filmNames.filter(name => name.toLowerCase().startsWith(userGuess.toLowerCase())).slice(0, 5) : []}
                      value={userGuess}
                      clearIcon={null}
                      onInputChange={(event, newInputValue) => {setUserGuess(newInputValue);}}
                      disabled={attempts >= 5 || isCorrect}
                    />
                    <Button type="submit" disabled={attempts >= 5 || isCorrect}>
                      Submit
                    </Button>
                  </form>
                  <div className="answers">
                    {message.split("\n").map((line, i) => (
                      <Typography key={i} style={{color: line.includes("Correct!") ? "green" : "red"}}>
                        {line}
                      </Typography>
                    ))}
                  </div>
                  {(isCorrect || attempts >= 5) &&
                    (filmIDs.length > 0 ? (
                      <Button onClick={handleReset} className="button">New Game</Button>
                    ) : (
                      <div className="finished-message">No more new games</div>
                    ))}
                </>
              ) : (
                <Button onClick={startGame} className="button">Start</Button>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
