export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    const errorMsg = `[Assertion Failed]: ${message || "A logic constraint was violated."}`;
    console.error(errorMsg);
    
    throw new Error(errorMsg);
  }
}
