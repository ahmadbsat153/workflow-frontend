import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory } from "../useHistory";

describe("useHistory", () => {
  describe("initialization", () => {
    it("should initialize with the provided initial state", () => {
      const { result } = renderHook(() => useHistory("initial"));
      expect(result.current.state).toBe("initial");
    });

    it("should initialize with canUndo as false", () => {
      const { result } = renderHook(() => useHistory("initial"));
      expect(result.current.canUndo).toBe(false);
    });

    it("should initialize with canRedo as false", () => {
      const { result } = renderHook(() => useHistory("initial"));
      expect(result.current.canRedo).toBe(false);
    });

    it("should work with object state", () => {
      const initialState = { count: 0, name: "test" };
      const { result } = renderHook(() => useHistory(initialState));
      expect(result.current.state).toEqual(initialState);
    });

    it("should work with array state", () => {
      const initialState = [1, 2, 3];
      const { result } = renderHook(() => useHistory(initialState));
      expect(result.current.state).toEqual(initialState);
    });
  });

  describe("set", () => {
    it("should update the state", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });

      expect(result.current.state).toBe("updated");
    });

    it("should enable undo after setting state", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });

      expect(result.current.canUndo).toBe(true);
    });

    it("should clear future history when setting new state", () => {
      const { result } = renderHook(() => useHistory("initial"));

      // Set state, undo, then set new state
      act(() => {
        result.current.set("second");
      });
      act(() => {
        result.current.undo();
      });
      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.set("new");
      });
      expect(result.current.canRedo).toBe(false);
    });

    it("should maintain history of multiple changes", () => {
      const { result } = renderHook(() => useHistory(0));

      act(() => {
        result.current.set(1);
      });
      act(() => {
        result.current.set(2);
      });
      act(() => {
        result.current.set(3);
      });

      expect(result.current.state).toBe(3);
      expect(result.current.canUndo).toBe(true);

      // Undo all the way back
      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toBe(2);

      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toBe(1);

      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toBe(0);
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe("undo", () => {
    it("should restore the previous state", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });
      act(() => {
        result.current.undo();
      });

      expect(result.current.state).toBe("initial");
    });

    it("should enable redo after undo", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });
      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);
    });

    it("should do nothing when there is no history to undo", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.undo();
      });

      expect(result.current.state).toBe("initial");
      expect(result.current.canUndo).toBe(false);
    });

    it("should work with multiple undos", () => {
      const { result } = renderHook(() => useHistory("a"));

      act(() => {
        result.current.set("b");
      });
      act(() => {
        result.current.set("c");
      });

      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toBe("b");

      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toBe("a");
    });
  });

  describe("redo", () => {
    it("should restore the next state after undo", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });
      act(() => {
        result.current.undo();
      });
      act(() => {
        result.current.redo();
      });

      expect(result.current.state).toBe("updated");
    });

    it("should disable redo after all future states are restored", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });
      act(() => {
        result.current.undo();
      });
      act(() => {
        result.current.redo();
      });

      expect(result.current.canRedo).toBe(false);
    });

    it("should do nothing when there is no future history", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.redo();
      });

      expect(result.current.state).toBe("initial");
    });

    it("should work with multiple redos", () => {
      const { result } = renderHook(() => useHistory("a"));

      act(() => {
        result.current.set("b");
      });
      act(() => {
        result.current.set("c");
      });
      act(() => {
        result.current.undo();
      });
      act(() => {
        result.current.undo();
      });

      act(() => {
        result.current.redo();
      });
      expect(result.current.state).toBe("b");

      act(() => {
        result.current.redo();
      });
      expect(result.current.state).toBe("c");
    });
  });

  describe("reset", () => {
    it("should reset state to new value", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("updated");
      });
      act(() => {
        result.current.reset("reset-value");
      });

      expect(result.current.state).toBe("reset-value");
    });

    it("should clear all history", () => {
      const { result } = renderHook(() => useHistory("initial"));

      act(() => {
        result.current.set("a");
      });
      act(() => {
        result.current.set("b");
      });
      act(() => {
        result.current.undo();
      });

      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.reset("fresh");
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });
  });

  describe("complex scenarios", () => {
    it("should handle undo-redo-set sequence correctly", () => {
      const { result } = renderHook(() => useHistory(0));

      // Build up history
      act(() => result.current.set(1));
      act(() => result.current.set(2));
      act(() => result.current.set(3));

      // Undo twice
      act(() => result.current.undo());
      act(() => result.current.undo());
      expect(result.current.state).toBe(1);

      // Redo once
      act(() => result.current.redo());
      expect(result.current.state).toBe(2);

      // Set new state - should clear future
      act(() => result.current.set(10));
      expect(result.current.state).toBe(10);
      expect(result.current.canRedo).toBe(false);

      // Undo should go back to 2
      act(() => result.current.undo());
      expect(result.current.state).toBe(2);
    });

    it("should work with object mutations", () => {
      const { result } = renderHook(() =>
        useHistory({ count: 0, items: [] as string[] })
      );

      act(() => {
        result.current.set({ count: 1, items: ["a"] });
      });
      act(() => {
        result.current.set({ count: 2, items: ["a", "b"] });
      });

      expect(result.current.state).toEqual({ count: 2, items: ["a", "b"] });

      act(() => {
        result.current.undo();
      });
      expect(result.current.state).toEqual({ count: 1, items: ["a"] });
    });
  });
});
