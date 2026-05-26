export function letClockTick(state$) {
  setInterval(() => state$.next((data) => data.clock.counter++), 10000);
}
