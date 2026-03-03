// Tests for type contracts
import { describe, it, expect } from "vitest";
import { NUDGE_LABELS } from "../../extension/src/types";

describe("types", () => {
  it("should have labels for all nudge types", () => {
    expect(Object.keys(NUDGE_LABELS)).toHaveLength(5);
    expect(NUDGE_LABELS.lets_lock_in).toBe("Let's lock in!");
  });
});
