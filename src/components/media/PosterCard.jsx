import { Badge } from "react-bootstrap";

export default function PosterCard({ item, onClick }) {
  return (
    <button
      onClick={() => onClick?.(item)}
      className="p-0 border border-secondary bg-dark"
      style={{
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ aspectRatio: "2 / 3", width: "100%" }}>
          <img
            src={item.poster}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          {item.isNew && <Badge bg="success">New</Badge>}
          {item.isPremium && <Badge bg="warning" text="dark">Premium</Badge>}
        </div>

        {/* hover overlay (simple) */}
        <div
          className="poster-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.10))",
            opacity: 0,
            transition: "opacity .2s ease",
          }}
        />
      </div>
    </button>
  );
}
