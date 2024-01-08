import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Button, TextField } from '@mui/material';
import axios from "axios";
import headerImage from "./images/header.png";
import actorCardReverse from "./images/actor-card-reverse.png";
import posterCardReverse from "./images/poster-card-reverse.png";

//transform answers to title-case to display
function toTitleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

//randomize the order of actors
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//extract title from file name
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

  //retrieve film names/ids for guess autocomplete and film data retrieval
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
    let guess = userGuess.trim() === "" ? "*Pass*" : toTitleCase(userGuess);

    if (guess.toLowerCase() !== filmTitle.toLowerCase() && guess.length > 21) {
      guess = guess.substring(0, 21) + "...";
    }

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
      <img src={headerImage} alt="Header" className="header-image" />
      <div className="card-container">
          <div className={`flip-card ${gameStarted ? 'flip' : ''}`}>
            <img src={actorCardReverse} alt="Actor " className="card flip-card-front"/>
            <img src={actorImages[0]} alt={getFilenameFromUrl(actorImages[0])} title={getFilenameFromUrl(actorImages[0])} className="card flip-card-back"/>
          </div>
          <div className={`flip-card ${isCorrect || attempts > 0 ? 'flip' : ''}`}>
            <img src={actorCardReverse} alt="Actor 2" className="card flip-card-front"/>
            <img src={actorImages[1]} alt={getFilenameFromUrl(actorImages[1])} title={getFilenameFromUrl(actorImages[1])} className="card flip-card-back"/>
          </div>
          <div className={`flip-card ${isCorrect || attempts > 1 ? 'flip' : ''}`}>
            <img src={actorCardReverse} alt="Actor 3" className="card flip-card-front"/>
            <img src={actorImages[2]} alt={getFilenameFromUrl(actorImages[2])} title={getFilenameFromUrl(actorImages[2])} className="card flip-card-back"/>
          </div>
          <div className="card" id="instructions">
            <div className="text-card">
              <div className="text-card-header">
                Instructions
              </div>
              <div className="text-card-line">
                1. Guess the film by its actors.
              </div>
              <div className="text-card-line">
                2. After every wrong answer a new actor will be revealed.
              </div>
              <div className="text-card-line">
                3. You have 5 chances to guess the film correctly.
              </div>
            </div>
          </div>
          <div className={`flip-card ${isCorrect || attempts > 2 ? 'flip' : ''}`}>
            <img src={actorCardReverse} alt="Actor 4" className="card flip-card-front"/>
            <img src={actorImages[3]} alt={getFilenameFromUrl(actorImages[3])} title={getFilenameFromUrl(actorImages[3])} className="card flip-card-back"/>
          </div>
          <div className={`flip-card ${isCorrect || attempts > 3 ? 'flip' : ''}`}>
            <img src={actorCardReverse} alt="Actor 5" className="card flip-card-front"/>
            <img src={actorImages[4]} alt={getFilenameFromUrl(actorImages[4])} title={getFilenameFromUrl(actorImages[4])} className="card flip-card-back"/>
          </div>
          <div className={`flip-card ${isCorrect || attempts > 4 ? 'flip' : ''}`}>
            <img src={posterCardReverse} alt="Poster" className="card flip-card-front"/>
            <img src={posterImage} alt={getFilenameFromUrl(posterImage)} title={getFilenameFromUrl(posterImage)} className="card flip-card-back"/>
          </div>
          <div className="card" id="controls">
            <div className="text-card">
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
                    <Button type="submit" className="button" disabled={attempts >= 5 || isCorrect}>Submit</Button>
                  </form>
                  <div className="text-card-line">
                    {message.split("\n").map((line, i) => (
                      <div key={i} style={{color: line.includes("Correct!") ? "green" : "red"}}>
                        {line}
                      </div>
                    ))}
                  </div>
                  {(isCorrect || attempts >= 5) &&
                    (filmIDs.length > 0 ? (
                      <Button className="button" onClick={handleReset}>New Game</Button>
                    ) : (
                      <div className="text-card-line">
                        No more new games
                      </div>
                    ))}
                </>
              ) : (
                <Button className="button" onClick={startGame}>Start</Button>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;
