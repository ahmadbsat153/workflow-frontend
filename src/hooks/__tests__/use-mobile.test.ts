import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../use-mobile";

describe("useIsMobile", () => {
  const MOBILE_BREAKPOINT = 768;

  // Store original values
  let originalInnerWidth: number;
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let changeHandler: (() => void) | null = null;

  beforeEach(() => {
    // Store original
    originalInnerWidth = window.innerWidth;

    // Create mock matchMedia
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: window.innerWidth < MOBILE_BREAKPOINT,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === "change") {
          changeHandler = handler;
        }
      }),
      removeEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === "change" && changeHandler === handler) {
          changeHandler = null;
        }
      }),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    // Restore original
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    changeHandler = null;
    vi.clearAllMocks();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  it("should return false for desktop width", () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true for mobile width", () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should return false for width exactly at breakpoint", () => {
    setWindowWidth(MOBILE_BREAKPOINT);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true for width just below breakpoint", () => {
    setWindowWidth(MOBILE_BREAKPOINT - 1);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should call matchMedia with correct query", () => {
    setWindowWidth(1024);
    renderHook(() => useIsMobile());
    expect(mockMatchMedia).toHaveBeenCalledWith(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );
  });

  it("should add event listener on mount", () => {
    setWindowWidth(1024);
    renderHook(() => useIsMobile());

    const mockMediaQueryList = mockMatchMedia.mock.results[0].value;
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should remove event listener on unmount", () => {
    setWindowWidth(1024);
    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    const mockMediaQueryList = mockMatchMedia.mock.results[0].value;
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should update when window is resized to mobile", () => {
    setWindowWidth(1024);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      setWindowWidth(375);
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(true);
  });

  it("should update when window is resized to desktop", () => {
    setWindowWidth(375);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    // Simulate resize to desktop
    act(() => {
      setWindowWidth(1024);
      if (changeHandler) {
        changeHandler();
      }
    });

    expect(result.current).toBe(false);
  });

  it("should handle tablet width as non-mobile", () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should handle very small mobile width", () => {
    setWindowWidth(320);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should handle large desktop width", () => {
    setWindowWidth(1920);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
