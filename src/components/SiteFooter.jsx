import React from "react";

export default function SiteFooter({ footer }) {
  return (
    <footer className="band-ink">
      <div className="wrap" style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
        <div className="cta-mark" style={{ maxWidth: "420px" }}>
          <img src={footer.mark} alt={footer.alt} />
        </div>
      </div>
    </footer>
  );
}
