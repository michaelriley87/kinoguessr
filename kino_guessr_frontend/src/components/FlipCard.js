import React from 'react';

function FlipCard({ isFlipped, frontImage, backImage, altText, title }) {
  return (
    <div className={`flip-card ${isFlipped ? 'flip' : ''}`}>
      <img src={frontImage} alt={altText} className="card flip-card-front"/>
      <img src={backImage} alt={title} title={title} className="card flip-card-back"/>
    </div>
  );
}

export default FlipCard;
