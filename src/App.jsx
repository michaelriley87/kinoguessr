import "./App.css";
import React, { useEffect, useRef, useState } from "react";
import { toTitleCase, shuffleArray, getImageFilename, sanitizeText } from "./utilities";
import FlipCard from "./components/FlipCard.jsx";
import InstructionsCard from "./components/InstructionsCard.jsx";
import ControlsCard from "./components/ControlsCard.jsx";
import headerImage from "/images/header.png";
import actorCardReverse from "/images/actor-card-reverse.png";
import posterCardReverse from "/images/poster-card-reverse.png";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [filmNames, setFilmNames] = useState([]);
  const [filmData, setFilmData] = useState([]);
  const [filmTitle, setFilmTitle] = useState("");
  const [filmCount, setFilmCount] = useState(0);
  const [actorImages, setActorImages] = useState([]);
  const [posterImage, setPosterImage] = useState("");
  const autocompleteRef = useRef(null);

  // Load film data from `films.json`
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}films.json`)
      .then((response) => response.json())
      .then((data) => {
        setFilmData(data);
        setFilmNames(data.map(film => film.title));
        setFilmCount(data.length);
      })
      .catch((error) => console.error("Error loading film data:", error));
  }, []);

  // Start a new game by selecting a random film and loading its images
  const startGame = () => {
    if (filmData.length === 0) return;
    setGameStarted(false);
    setActorImages([]); 
    setPosterImage("");
  
    const randomFilm = filmData[Math.floor(Math.random() * filmData.length)];
    setFilmTitle(randomFilm.title);
  
    const actorSources = shuffleArray(randomFilm.actors.map(actor => ({
      name: actor,
      src: getImageFilename(actor)
    })));
  
    const posterSource = {
      name: randomFilm.title,
      src: getImageFilename(randomFilm.title)
    };
  
    Promise.all([...actorSources, posterSource].map(img => 
      new Promise(resolve => {
        const preloader = new Image();
        preloader.src = img.src;
        preloader.onload = resolve;
        preloader.onerror = resolve;
      })
    )).then(() => {
      setActorImages(actorSources);
      setPosterImage(posterSource);
      setGameStarted(true);
    });
  };
  
  // Handle user guesses
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!gameStarted || isCorrect || attempts >= 5) return;

    const newAttemptNumber = attempts + 1;
    setAttempts(newAttemptNumber);
    let guess = userGuess.trim() === "" ? "*Pass*" : toTitleCase(userGuess);

    if (sanitizeText(guess) === sanitizeText(filmTitle)) {
      setIsCorrect(true);
      setMessage(prev => prev + `\n${newAttemptNumber}. ${guess} - Correct!`);
    } else {
      setMessage(prev => prev + `\n${newAttemptNumber}. ${guess}`);
    }

    setUserGuess("");

    if (newAttemptNumber === 1) {
        setFilmData(prevFilms => prevFilms.filter(film => film.title !== filmTitle));
        setFilmCount(prevCount => prevCount - 1);
    }

    if (autocompleteRef.current) {
      const input = autocompleteRef.current.querySelector("input");
      if (input) input.focus();
    }
  };

  // Reset the game
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
        <FlipCard isFlipped={gameStarted} frontImage={actorCardReverse} backImage={actorImages[0]?.src || actorCardReverse} altText="Actor 1" title={actorImages[0]?.name || "Unknown Actor"} />
        <FlipCard isFlipped={isCorrect || attempts > 0} frontImage={actorCardReverse} backImage={actorImages[1]?.src || actorCardReverse} altText="Actor 2" title={actorImages[1]?.name || "Unknown Actor"} />
        <FlipCard isFlipped={isCorrect || attempts > 1} frontImage={actorCardReverse} backImage={actorImages[2]?.src || actorCardReverse} altText="Actor 3" title={actorImages[2]?.name || "Unknown Actor"} />
        <InstructionsCard />
        <FlipCard isFlipped={isCorrect || attempts > 2} frontImage={actorCardReverse} backImage={actorImages[3]?.src || actorCardReverse} altText="Actor 4" title={actorImages[3]?.name || "Unknown Actor"} />
        <FlipCard isFlipped={isCorrect || attempts > 3} frontImage={actorCardReverse} backImage={actorImages[4]?.src || actorCardReverse} altText="Actor 5" title={actorImages[4]?.name || "Unknown Actor"} />
        <FlipCard isFlipped={isCorrect || attempts > 4} frontImage={posterCardReverse} backImage={posterImage?.src || posterCardReverse} altText="Poster" title={posterImage?.name || "Unknown Poster"} />
        <ControlsCard
          gameStarted={gameStarted}
          userGuess={userGuess}
          setUserGuess={setUserGuess}
          attempts={attempts}
          isCorrect={isCorrect}
          filmNames={filmNames}
          filmCount={filmCount}
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
