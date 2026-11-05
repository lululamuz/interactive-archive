import { useEffect, useRef, useState } from "react";

// A large custom arrow: white fill, black outline.
// Over anything clickable it grows and turns half-transparent so it never hides the text.
// On touch screens (no mouse) it is not shown at all and the system cursor/taps work as usual.
const INTERACTIVE = "a, button, [role='button'], input, select, label, [data-cursor='grow']";

export default function Cursor({ size = 56, grow = 1.6, hoverOpacity = 0.5 }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [overInteractive, setOverInteractive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor", enabled);
    if (!enabled) return undefined;

    const move = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${e.clientX - size * 0.06}px, ${e.clientY - size * 0.06}px, 0)`;
      }
      setVisible(true);
    };
    const over = (e) => setOverInteractive(Boolean(e.target.closest?.(INTERACTIVE)));
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, size]);

  if (!enabled) return null;

  return (
    <div ref={ref} className="cursor" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
      <svg
        viewBox="0 0 28 38"
        width={Math.round((size * 28) / 38)}
        height={size}
        className="cursor__arrow"
        style={{
          transform: `scale(${overInteractive ? grow : 1})`,
          opacity: overInteractive ? hoverOpacity : 1,
        }}
      >
        <path
          d="M3 3 L3 30 L10 23.5 L14.5 34 L19.5 31.8 L15 21.5 L24.5 21.5 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
