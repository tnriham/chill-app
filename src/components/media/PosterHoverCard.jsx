import { useMemo, useState } from "react";
import { Badge, Button } from "react-bootstrap";

export default function PosterHoverCard({ item, progress, onPlay, onInfo }) {
  if (!item) return null;

  const showProgress = typeof progress === "number";

  // (2) sound icon + mute fake
  const [muted, setMuted] = useState(true);

  // (3) preview episode (series)
  const episodes = useMemo(() => item.episodes || [], [item]);
  const isSeries = item.type === "series";
  const [epIndex, setEpIndex] = useState(0);

  const currentEp = isSeries ? episodes[Math.min(epIndex, Math.max(0, episodes.length - 1))] : null;

  const nextEp = () => {
    if (!episodes.length) return;
    setEpIndex((i) => (i + 1) % episodes.length);
  };

  const prevEp = () => {
    if (!episodes.length) return;
    setEpIndex((i) => (i - 1 + episodes.length) % episodes.length);
  };

  return (
    <div className="nfc">
      {/* POSTER */}
      <div className="nfc-poster">
        <img src={item.poster} alt={item.title} className="nfc-img" />

        <div className="nfc-badges">
          {item.age && <Badge bg="secondary">{item.age}</Badge>}
          {item.isPremium && (
            <Badge bg="warning" text="dark">
              Premium
            </Badge>
          )}
        </div>

        {showProgress && (
          <div className="nfc-progress-wrap">
            <div
              className="nfc-progress-bar"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* EXPANDED CARD (HOVER) */}
      <div className="nfc-expand">
        {/* FAKE TRAILER AREA */}
        <div className="nfc-trailer">
          <img
            src={item.hero || item.poster}
            alt={item.title}
            className="nfc-trailer-img"
          />
          <div className="nfc-trailer-glow" />

          {/* (2) Sound toggle */}
          <button
            className="nfc-sound"
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
            aria-label="Toggle mute"
            title={muted ? "Unmute (fake)" : "Mute (fake)"}
          >
            <i className={`bi ${muted ? "bi-volume-mute-fill" : "bi-volume-up-fill"}`} />
          </button>
        </div>

        <div className="nfc-expand-content">
          <div className="nfc-title">{item.title}</div>

          <div className="nfc-meta">
            {item.year && <span>{item.year}</span>}
            {item.duration && <span> • {item.duration}</span>}
            {isSeries && currentEp?.no && <span> • Ep {currentEp.no}</span>}
          </div>

          <div className="nfc-actions">
            <Button
              size="sm"
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                onPlay?.(item);
              }}
            >
              <i className="bi bi-play-fill me-1" />
              Putar
            </Button>

            <Button
              size="sm"
              variant="outline-light"
              onClick={(e) => {
                e.stopPropagation();
                onInfo?.(item);
              }}
            >
              <i className="bi bi-info-circle me-1" />
              Info
            </Button>
          </div>

          {/* (3) Preview episode untuk series */}
          {isSeries && (
            <div className="nfc-episode">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="nfc-episode-title">Preview Episode</div>

                {episodes.length > 1 && (
                  <div className="d-flex gap-2">
                    <button
                      className="nfc-ep-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevEp();
                      }}
                      title="Sebelumnya"
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                    <button
                      className="nfc-ep-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextEp();
                      }}
                      title="Berikutnya"
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                )}
              </div>

              {currentEp ? (
                <div className="nfc-episode-card">
                  <div className="nfc-ep-line">
                    <span className="nfc-ep-chip">Ep {currentEp.no}</span>
                    <span className="nfc-ep-name">{currentEp.title}</span>
                  </div>
                  <div className="nfc-ep-sub">
                    Durasi: {currentEp.duration || "-"} • Audio:{" "}
                    {muted ? "Muted (fake)" : "On (fake)"}
                  </div>
                </div>
              ) : (
                <div className="text-secondary small">Episode belum diisi di catalog.</div>
              )}
            </div>
          )}

          {item.genres?.length ? (
            <div className="nfc-genres">{item.genres.slice(0, 3).join(" • ")}</div>
          ) : null}
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .nfc{
          width: 160px;
          height: 240px;
          position: relative;
        }

        .nfc-poster{
          width: 160px;
          height: 240px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #2f2f2f;
          background: #111;
        }

        .nfc-img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .nfc-badges{
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          gap: 6px;
          z-index: 2;
        }

        .nfc-progress-wrap{
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 6px;
          background: rgba(255,255,255,.15);
          z-index: 2;
        }
        .nfc-progress-bar{
          height: 6px;
          background: #3254FF;
        }

        /* expand */
        .nfc-expand{
          position: absolute;
          top: -40px;
          left: 0;
          width: 320px;
          height: 460px;
          border-radius: 14px;
          background: #0b0b0b;
          box-shadow: 0 20px 40px rgba(0,0,0,.6);
          overflow: hidden;
          opacity: 0;
          transform: scale(0.96);
          pointer-events: none;
          transition: all .18s ease;
          z-index: 50;
        }
        .nfc:hover .nfc-expand{
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        /* trailer */
        .nfc-trailer{
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #000;
        }
        .nfc-trailer-img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .nfc-trailer-glow{
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.85), rgba(0,0,0,.2));
        }

        /* sound btn */
        .nfc-sound{
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.35);
          background: rgba(0,0,0,.45);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
        }
        .nfc-sound:hover{
          border-color: rgba(255,255,255,.65);
          background: rgba(0,0,0,.6);
        }

        .nfc-expand-content{
          padding: 12px;
        }

        .nfc-title{
          font-weight: 800;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .nfc-meta{
          color: rgba(255,255,255,.7);
          font-size: 12px;
          margin-bottom: 10px;
        }

        .nfc-actions{
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        /* episode preview */
        .nfc-episode{
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          padding: 10px;
          background: rgba(255,255,255,.04);
          margin-bottom: 10px;
        }

        .nfc-episode-title{
          font-weight: 700;
          font-size: 12px;
          color: rgba(255,255,255,.9);
        }

        .nfc-ep-btn{
          width: 30px;
          height: 30px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(0,0,0,.25);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .nfc-ep-btn:hover{
          background: rgba(0,0,0,.45);
          border-color: rgba(255,255,255,.35);
        }

        .nfc-episode-card{
          margin-top: 6px;
        }
        .nfc-ep-line{
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .nfc-ep-chip{
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(50,84,255,.25);
          border: 1px solid rgba(50,84,255,.55);
        }
        .nfc-ep-name{
          font-weight: 700;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nfc-ep-sub{
          font-size: 11px;
          color: rgba(255,255,255,.65);
        }

        .nfc-genres{
          font-size: 11px;
          color: rgba(255,255,255,.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
