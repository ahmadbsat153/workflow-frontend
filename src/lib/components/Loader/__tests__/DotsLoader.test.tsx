import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DotsLoader from "../DotsLoader";

describe("DotsLoader", () => {
  it("should render without crashing", () => {
    const { container } = render(<DotsLoader />);
    const loader = container.querySelector('[data-title="dot-overtaking"]');
    expect(loader).toBeInTheDocument();
  });

  it("should render the loader structure", () => {
    const { container } = render(<DotsLoader />);

    // Check for snippet wrapper
    const snippet = container.querySelector(".snippet");
    expect(snippet).toBeInTheDocument();
    expect(snippet).toHaveAttribute("data-title", "dot-overtaking");

    // Check for stage with filter
    const stage = container.querySelector(".stage.filter-contrast");
    expect(stage).toBeInTheDocument();

    // Check for the animation element
    const windmill = container.querySelector(".dot-windmill");
    expect(windmill).toBeInTheDocument();
  });

  it("should have the correct class hierarchy", () => {
    const { container } = render(<DotsLoader />);

    const snippet = container.querySelector(".snippet");
    const stage = snippet?.querySelector(".stage");
    const windmill = stage?.querySelector(".dot-windmill");

    expect(snippet).toContainElement(stage as HTMLElement);
    expect(stage).toContainElement(windmill as HTMLElement);
  });
});
