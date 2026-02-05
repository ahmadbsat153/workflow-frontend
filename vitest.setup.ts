import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: (props: React.ComponentProps<"img">) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement("img", props);
  },
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement("a", { href, ...props }, children),
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock("framer-motion", () => {
  const createMotionComponent = (tag: string) => {
    return React.forwardRef((props: Record<string, unknown>, ref) => {
      const { children, ...rest } = props;
      // Filter out framer-motion specific props
      const filteredProps = Object.keys(rest).reduce(
        (acc, key) => {
          if (
            ![
              "initial",
              "animate",
              "exit",
              "variants",
              "transition",
              "whileHover",
              "whileTap",
              "whileFocus",
              "whileInView",
              "viewport",
              "onAnimationStart",
              "onAnimationComplete",
            ].includes(key)
          ) {
            acc[key] = rest[key];
          }
          return acc;
        },
        {} as Record<string, unknown>
      );
      return React.createElement(tag, { ...filteredProps, ref }, children as React.ReactNode);
    });
  };

  return {
    motion: {
      div: createMotionComponent("div"),
      span: createMotionComponent("span"),
      button: createMotionComponent("button"),
      ul: createMotionComponent("ul"),
      li: createMotionComponent("li"),
      p: createMotionComponent("p"),
      nav: createMotionComponent("nav"),
      section: createMotionComponent("section"),
      article: createMotionComponent("article"),
      aside: createMotionComponent("aside"),
      header: createMotionComponent("header"),
      footer: createMotionComponent("footer"),
      main: createMotionComponent("main"),
      form: createMotionComponent("form"),
      input: createMotionComponent("input"),
      a: createMotionComponent("a"),
      img: createMotionComponent("img"),
      svg: createMotionComponent("svg"),
      path: createMotionComponent("path"),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useInView: () => true,
    useMotionValue: (initial: number) => ({ get: () => initial, set: vi.fn() }),
    useTransform: () => ({ get: () => 0 }),
    useSpring: () => ({ get: () => 0 }),
    useReducedMotion: () => false,
  };
});

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
