// Progress tracker: fills a star for each correct answer.

type Props = {
  count: number;
  total: number;
};

export default function StarBar({ count, total }: Props) {
  return (
    <div
      className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
      role="img"
      aria-label={`${count} of ${total} stars`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < count;
        const newest = i === count - 1;
        return (
          <span
            key={i}
            className={`text-2xl leading-none drop-shadow-sm transition-transform sm:text-3xl ${
              filled ? (newest ? "animate-star-pop" : "") : "opacity-30 grayscale"
            }`}
          >
            ⭐
          </span>
        );
      })}
    </div>
  );
}
