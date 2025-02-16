import React from 'react';
import { Autocomplete, Button, TextField } from '@mui/material';

function GameControls({ 
    gameStarted, 
    userGuess, 
    setUserGuess, 
    attempts, 
    isCorrect, 
    filmNames, 
    filmCount,
    handleSubmit, 
    handleReset, 
    startGame, 
    message,
    autocompleteRef
}) {
  return (
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
            {(isCorrect || attempts >= 5) && (
              filmCount > 0 ? (
                <Button className="button" onClick={handleReset}>New Game</Button>
              ) : (
                <div className="text-card-line">No more new games</div>
              )
            )}
          </>
        ) : (
          <Button className="button" onClick={startGame}>Start</Button>
        )}
      </div>
    </div>
  );
}

export default GameControls;
