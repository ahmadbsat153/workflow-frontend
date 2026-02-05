import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetricCard } from "../MetricCard";
import { Users, TrendingUp, Activity } from "lucide-react";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Users: ({ className }: { className?: string }) => (
    <svg data-testid="users-icon" className={className} />
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg data-testid="trending-up-icon" className={className} />
  ),
  TrendingDown: ({ className }: { className?: string }) => (
    <svg data-testid="trending-down-icon" className={className} />
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg data-testid="activity-icon" className={className} />
  ),
  ArrowUp: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-up-icon" className={className} />
  ),
  ArrowDown: ({ className }: { className?: string }) => (
    <svg data-testid="arrow-down-icon" className={className} />
  ),
}));

describe("MetricCard", () => {
  const defaultProps = {
    title: "Total Users",
    value: 1234,
    icon: Users,
  };

  it("should render with required props", () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
  });

  it("should render string values", () => {
    render(<MetricCard {...defaultProps} value="$5,432" />);
    expect(screen.getByText("$5,432")).toBeInTheDocument();
  });

  it("should render trend text when provided", () => {
    render(<MetricCard {...defaultProps} trend="+12% from last month" />);
    expect(screen.getByText("+12% from last month")).toBeInTheDocument();
  });

  it("should render upward trend arrow when trendDirection is up", () => {
    render(
      <MetricCard {...defaultProps} trend="+15%" trendDirection="up" />
    );
    expect(screen.getByTestId("arrow-up-icon")).toBeInTheDocument();
    expect(screen.getByText("+15%")).toBeInTheDocument();
  });

  it("should render downward trend arrow when trendDirection is down", () => {
    render(
      <MetricCard {...defaultProps} trend="-8%" trendDirection="down" />
    );
    expect(screen.getByTestId("arrow-down-icon")).toBeInTheDocument();
    expect(screen.getByText("-8%")).toBeInTheDocument();
  });

  it("should not render trend arrows when trendDirection is neutral", () => {
    render(
      <MetricCard {...defaultProps} trend="0%" trendDirection="neutral" />
    );
    expect(screen.queryByTestId("arrow-up-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("arrow-down-icon")).not.toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should not render trend section when trend is not provided", () => {
    render(<MetricCard {...defaultProps} />);
    // The trend section has mt-1 class, so we check it doesn't exist
    expect(screen.queryByText("+")).not.toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <MetricCard {...defaultProps} className="custom-class" />
    );

    // The Card component should have the custom class
    const card = container.querySelector("[data-slot='card']");
    expect(card).toHaveClass("custom-class");
  });

  it("should render different icons", () => {
    const { rerender } = render(
      <MetricCard title="Revenue" value="$10K" icon={TrendingUp} />
    );
    expect(screen.getByTestId("trending-up-icon")).toBeInTheDocument();

    rerender(<MetricCard title="Activity" value={42} icon={Activity} />);
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
  });

  it("should have proper heading structure", () => {
    render(<MetricCard {...defaultProps} />);

    // Title should be in an h3
    const title = screen.getByRole("heading", { level: 3 });
    expect(title).toHaveTextContent("Total Users");
  });

  it("should format large numbers correctly", () => {
    render(<MetricCard {...defaultProps} value={1000000} />);
    expect(screen.getByText("1000000")).toBeInTheDocument();
  });
});
