import { ShoppingItemRow } from "@/app/(protected)/lista/[id]/components/ShoppingItemRow";
import { fireEvent, render, screen } from "@testing-library/react";

const defaultItem = {
  id: "1",
  name: "Arroz",
  quantity: 2,
  unit: "pct",
  isPicked: false,
  category: "Alimentos" as const,
};

describe("ShoppingItemRow", () => {
  const defaultProps = {
    item: defaultItem,
    isAtMarket: false,
    onToggle: jest.fn(),
    onQuantityChange: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should Render item name and quantity", () => {
    render(<ShoppingItemRow {...defaultProps} />);
    
    expect(screen.getByText("Arroz")).toBeInTheDocument();
    expect(screen.getByText("2 pct")).toBeInTheDocument();
  });

  it("should Call onToggle when checkbox is clicked", () => {
    render(<ShoppingItemRow {...defaultProps} />);
    
    const button = screen.getByRole("button", { name: /marcar como pego/i });
    fireEvent.click(button);
    
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("should Show checked icon when item is picked", () => {
    render(<ShoppingItemRow {...defaultProps} item={{ ...defaultItem, isPicked: true }} />);
    
    const checkedIcon = screen.getByRole("button", { name: /marcar como não pego/i });
    expect(checkedIcon).toBeInTheDocument();
  });

  it("should Show quantity controls when not in market mode", () => {
    render(<ShoppingItemRow {...defaultProps} />);
    
    const increaseButton = screen.getByRole("button", { name: /aumentar quantidade/i });
    const decreaseButton = screen.getByRole("button", { name: /diminuir quantidade/i });
    
    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toBeInTheDocument();
  });

  it("should Not show quantity controls in market mode", () => {
    render(<ShoppingItemRow {...defaultProps} isAtMarket={true} />);
    
    const increaseButton = screen.queryByRole("button", { name: /aumentar quantidade/i });
    const decreaseButton = screen.queryByRole("button", { name: /diminuir quantidade/i });
    
    expect(increaseButton).not.toBeInTheDocument();
    expect(decreaseButton).not.toBeInTheDocument();
  });

  it("should Call onQuantityChange when increase button is clicked", () => {
    render(<ShoppingItemRow {...defaultProps} />);
    
    const increaseButton = screen.getByRole("button", { name: /aumentar quantidade/i });
    fireEvent.click(increaseButton);
    
    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith(3);
  });

  it("should Call onQuantityChange when decrease button is clicked", () => {
    render(<ShoppingItemRow {...defaultProps} item={{ ...defaultItem, quantity: 3 }} />);
    
    const decreaseButton = screen.getByRole("button", { name: /diminuir quantidade/i });
    fireEvent.click(decreaseButton);
    
    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith(2);
  });

  it("should Not decrease quantity below 1", () => {
    render(<ShoppingItemRow {...defaultProps} />);
    
    const decreaseButton = screen.getByRole("button", { name: /diminuir quantidade/i });
    fireEvent.click(decreaseButton);
    
    expect(defaultProps.onQuantityChange).toHaveBeenCalledWith(1);
  });

  it("should Show Falta badge in market mode for unpicked items", () => {
    render(<ShoppingItemRow {...defaultProps} isAtMarket={true} />);
    
    expect(screen.getByText("Falta")).toBeInTheDocument();
  });

  it("should Not show Falta badge for picked items", () => {
    render(<ShoppingItemRow {...defaultProps} item={{ ...defaultItem, isPicked: true }} isAtMarket={true} />);
    
    expect(screen.queryByText("Falta")).not.toBeInTheDocument();
  });

  it("should Apply strikethrough style for picked items", () => {
    render(<ShoppingItemRow {...defaultProps} item={{ ...defaultItem, isPicked: true }} />);
    
    const nameElement = screen.getByText("Arroz");
    expect(nameElement).toHaveClass("line-through");
  });
});
