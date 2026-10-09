import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { screenshots } from "./content";

export interface ViewerHandle {
  open: (index: number, trigger: HTMLElement) => void;
}
export const ImageViewer = forwardRef<ViewerHandle>(
  function ImageViewer(_, ref) {
    const dialog = useRef<HTMLDialogElement>(null);
    const trigger = useRef<HTMLElement | null>(null);
    const stage = useRef<HTMLDivElement>(null);
    const previousOverflow = useRef("");
    const [index, setIndex] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [failed, setFailed] = useState(false);
    const shot = index === null ? null : screenshots[index];
    function fit() {
      setZoom(1);
      stage.current?.scrollTo(0, 0);
    }
    function change(direction: number) {
      setIndex(
        (current) =>
          ((current ?? 0) + direction + screenshots.length) %
          screenshots.length,
      );
      setFailed(false);
      fit();
    }
    useImperativeHandle(ref, () => ({
      open(next, source) {
        trigger.current = source;
        setIndex(next);
        setFailed(false);
        fit();
        previousOverflow.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.current?.showModal();
      },
    }));
    function onClose() {
      document.body.style.overflow = previousOverflow.current;
      trigger.current?.focus({ preventScroll: true });
      setIndex(null);
    }
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Home") {
        event.preventDefault();
        fit();
      }
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      )
        return;
      event.preventDefault();
      if (zoom === 1) {
        if (event.key === "ArrowLeft") change(-1);
        if (event.key === "ArrowRight") change(1);
      } else
        stage.current?.scrollBy({
          left:
            event.key === "ArrowLeft"
              ? -40
              : event.key === "ArrowRight"
                ? 40
                : 0,
          top:
            event.key === "ArrowUp" ? -40 : event.key === "ArrowDown" ? 40 : 0,
        });
    }
    return (
      <dialog
        ref={dialog}
        className="image-viewer"
        aria-labelledby="viewer-title"
        aria-describedby="viewer-help"
        onClose={onClose}
        onKeyDown={keyboard}
      >
        <div className="viewer-header">
          <h2 id="viewer-title">{shot?.caption ?? "Project screenshot"}</h2>
          <button autoFocus onClick={() => dialog.current?.close()}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <p id="viewer-help" className="viewer-help">
          Arrow keys: change image, or pan when zoomed. Home: fit image. Escape:
          close.
        </p>
        <div
          className="viewer-stage"
          ref={stage}
          tabIndex={0}
          aria-label="Screenshot viewing area"
        >
          {shot &&
            (failed ? (
              <p>
                Image could not be loaded.{" "}
                <a href={shot.src}>Open the original image</a>.
              </p>
            ) : (
              <div
                className="zoom-surface"
                style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  onError={() => setFailed(true)}
                />
              </div>
            ))}
        </div>
        <div className="viewer-controls">
          <div className="viewer-paging">
            <button aria-label="Previous screenshot" onClick={() => change(-1)}>
              ←
            </button>
            <span aria-live="polite">
              {(index ?? 0) + 1} of {screenshots.length}
            </span>
            <button aria-label="Next screenshot" onClick={() => change(1)}>
              →
            </button>
          </div>
          <div className="viewer-zoom">
            <button
              aria-label="Zoom out"
              disabled={zoom <= 1}
              onClick={() => setZoom((value) => Math.max(1, value - 0.5))}
            >
              −
            </button>
            <button onClick={fit}>Fit image</button>
            <button
              aria-label="Zoom in"
              disabled={zoom >= 3}
              onClick={() => setZoom((value) => Math.min(3, value + 0.5))}
            >
              +
            </button>
          </div>
        </div>
      </dialog>
    );
  },
);
