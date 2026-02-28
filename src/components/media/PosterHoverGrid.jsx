import PosterHoverCard from "./PosterHoverCard.jsx";

export default function PosterHoverGrid({
  items = [],
  onPlay,
  onInfo,
  progressMap,
}) {
  return (
    <div
      className="poster-hover-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 16,
      }}
    >
      {items.map((it) => (
        <div
          key={it.id}
          className="poster-hover-grid-item"
          style={{
            position: "relative",
            transition: "transform .15s ease",
          }}
        >
          <PosterHoverCard
            item={it}
            progress={
              typeof progressMap?.[it.id] === "number"
                ? progressMap[it.id]
                : undefined
            }
            onPlay={onPlay}
            onInfo={onInfo}
          />
        </div>
      ))}

      <style>{`
        .poster-hover-grid-item:hover{
          transform: translateY(-6px) scale(1.02);
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
