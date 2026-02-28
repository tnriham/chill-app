import PosterCard from "./PosterCard.jsx";

export default function PosterGrid({ items, onCardClick }) {
  return (
    <div className="row g-3">
      {items.map((it) => (
        <div key={it.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="poster-overlay-parent">
            <PosterCard item={it} onClick={onCardClick} />
          </div>
        </div>
      ))}
    </div>
  );
}
