// Re-export the canonical, clamped helper from the package. The old local copy
// read `?display_precision` without clamping, so an out-of-range value reached
// `toFixed()` and threw — the shared one clamps to a safe range.
export { getDisplayPrecision } from '@10gzv/crash-core';
