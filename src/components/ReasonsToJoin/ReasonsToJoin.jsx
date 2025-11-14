import React from "react";
import "./ReasonsToJoin.css";

const reasons = [
  {
    title: "Enjoy on your TV",
    description:
      "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
    icon: "../tv-icon.png",
  },
  {
    title: "Download your shows to watch offline",
    description:
      "Save your favourites easily and always have something to watch.",
    icon: "../download-icon.png",
  },
  {
    title: "Watch everywhere",
    description:
      "Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.",
    icon: "../telescope-icon.png",
  },
  {
    title: "Create profiles for kids",
    description:
      "Send kids on adventures with their favourite characters in a space made just for them — free with your membership.",
    icon: "../kids-icon.png",
  },
];

const ReasonsToJoin = () => {
  return (
    <section className="reasons-section">
      <h2>More reasons to join</h2>
      <div className="reasons-grid">
        {reasons.map((reason, index) => (
          <div className="reason-card" key={index}>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
            <img src={reason.icon} alt={reason.title} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReasonsToJoin;
