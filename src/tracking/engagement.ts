export type EngagementClock = {
  marksMs?: number[];
  onMark: (seconds: number) => void;
  isVisible: () => boolean;
  now: () => number;
  schedule: (fn: () => void, ms: number) => number;
  cancel: (id: number) => void;
};

/** Conta só o tempo com a aba visível e dispara cada marco uma vez. */
export function createEngagement(options: EngagementClock): { stop: () => void; sync: () => void } {
  const marks = [...(options.marksMs ?? [30_000, 60_000])].sort((a, b) => a - b);
  const fired = new Set<number>();
  let accumulated = 0;
  let visibleSince = 0;
  let running = false;
  let timer: number | null = null;

  const clear = () => {
    if (timer === null) return;
    options.cancel(timer);
    timer = null;
  };

  const elapsed = () => accumulated + (running ? Math.max(0, options.now() - visibleSince) : 0);

  const flushDue = () => {
    const current = elapsed();
    for (const mark of marks) {
      if (fired.has(mark) || current + 20 < mark) continue;
      fired.add(mark);
      try {
        options.onMark(mark / 1000);
      } catch {
        // o próximo marco continua
      }
    }
  };

  const arm = () => {
    clear();
    flushDue();
    if (!running) return;
    const next = marks.find((mark) => !fired.has(mark));
    if (!next) return;
    const wait = Math.max(0, next - elapsed());
    timer = options.schedule(() => {
      timer = null;
      flushDue();
      arm();
    }, wait);
  };

  return {
    sync() {
      if (!options.isVisible()) {
        if (running) {
          accumulated += Math.max(0, options.now() - visibleSince);
          running = false;
        }
        clear();
        return;
      }
      if (!running) {
        visibleSince = options.now();
        running = true;
      }
      arm();
    },
    stop() {
      if (running) {
        accumulated += Math.max(0, options.now() - visibleSince);
        running = false;
      }
      clear();
    },
  };
}
