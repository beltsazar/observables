export function letClockTick(state$) {
  setInterval(() => state$.next((data) => data.clock.counter++), 1000);
}
