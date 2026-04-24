/**
 * Character-staggered text, ported from osmo.supply demo.
 * Wrap in an element with class "stagger-btn" to trigger on hover/focus.
 *
 *   <button className="... stagger-btn"><StaggerText>Add bot</StaggerText></button>
 *
 * Pure CSS — no JS. Characters wrap in <span>s with a per-index transition-delay,
 * and a text-shadow creates a ghost copy 1.3em below that slides into place
 * when the originals translate up by the same distance.
 */
export function StaggerText({ text }: { text: string }) {
  return (
    <span className="stagger-wrap" aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="stagger-char"
          style={{ transitionDelay: `${i * 10}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
