/**
 * Formats a duration in seconds as `mm':ss"` or `hh:mm':ss"` when at least one hour.
 * @param {number} timeInSeconds total seconds
 * @returns {string} formatted time string
 */
export default function getFormattedTime(timeInSeconds: number): string {
  const seconds = timeInSeconds % 60;
  let minutes = Math.floor(timeInSeconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}':${String(seconds).padStart(2, '0')}"`;
  } else {
    return `${String(minutes).padStart(2, '0')}':${String(seconds).padStart(2, '0')}"`;
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it('formats under one hour as mm\':ss"', () => {
    expect(getFormattedTime(0)).toBe('00\':00"');
    expect(getFormattedTime(65)).toBe('01\':05"');
    expect(getFormattedTime(3599)).toBe('59\':59"');
  });

  it('formats one hour or more as hh:mm\':ss"', () => {
    expect(getFormattedTime(3600)).toBe('01:00\':00"');
    expect(getFormattedTime(3661)).toBe('01:01\':01"');
  });
}
