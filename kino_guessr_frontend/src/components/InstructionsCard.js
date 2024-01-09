import React from 'react';

function InstructionsCard() {
  return (
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
  );
}

export default InstructionsCard;
