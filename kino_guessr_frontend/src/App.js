import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toTitleCase, shuffleArray, getFilenameFromUrl } from "./utilities";
import FlipCard from "./components/FlipCard";
import InstructionsCard from "./components/InstructionsCard";
import ControlsCard from "./components/ControlsCard";
import headerImage from "./images/header.png";
import actorCardReverse from "./images/actor-card-reverse.png";
import posterCardReverse from "./images/poster-card-reverse.png";

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
        <FlipCard
          isFlipped={gameStarted}
          frontImage={actorCardReverse}
          backImage={actorImages[0]}
          altText="Actor 1"
          title={getFilenameFromUrl(actorImages[0])}
        />
        <FlipCard
          isFlipped={isCorrect || attempts > 0}
          frontImage={actorCardReverse}
          backImage={actorImages[1]}
          altText="Actor 2"
          title={getFilenameFromUrl(actorImages[1])}
        />
        <FlipCard
          isFlipped={isCorrect || attempts > 1}
          frontImage={actorCardReverse}
          backImage={actorImages[2]}
          altText="Actor 3"
          title={getFilenameFromUrl(actorImages[2])}
        />
        <InstructionsCard />
        <FlipCard
          isFlipped={isCorrect || attempts > 2}
          frontImage={actorCardReverse}
          backImage={actorImages[3]}
          altText="Actor 4"
          title={getFilenameFromUrl(actorImages[3])}
        />
        <FlipCard
          isFlipped={isCorrect || attempts > 3}
          frontImage={actorCardReverse}
          backImage={actorImages[4]}
          altText="Actor 5"
          title={getFilenameFromUrl(actorImages[4])}
        />
        <FlipCard
          isFlipped={isCorrect || attempts > 4}
          frontImage={posterCardReverse}
          backImage={posterImage}
          altText="Poster"
          title={getFilenameFromUrl(posterImage)}
        />
        <ControlsCard
          gameStarted={gameStarted}
          userGuess={userGuess}
          setUserGuess={setUserGuess}
          attempts={attempts}
          isCorrect={isCorrect}
          filmNames={filmNames}
          filmIDs={filmIDs}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          startGame={startGame}
          message={message}
          autocompleteRef={autocompleteRef}
        />
      </div>
    </div>
  );
}

export default App;
