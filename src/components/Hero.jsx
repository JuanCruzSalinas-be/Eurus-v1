import React from "react";

export default function Hero({ hero }) {
  return (
    <section className="hero" style={{ padding: 0, border: "none", marginTop: "-1px" }}>
      <img src={hero.image} alt={hero.alt} />
      <div className="card-copy" />
    </section>
  );
}
