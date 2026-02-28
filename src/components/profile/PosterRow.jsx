export default function PosterRow({ items, onClick }) {
  return (
    <div className="d-flex gap-3 overflow-auto pb-2">
      {(items || []).map((it) => (
        <button
          key={it.id}
          onClick={() => onClick?.(it)}
          className="border border-secondary bg-dark p-0"
          style={{
            borderRadius: 12,
            overflow: "hidden",
            minWidth: 140,
          }}
        >
          <div style={{ width: 140, height: 210 }}>
            <img
              src={it.poster}
              alt={it.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
