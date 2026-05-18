import { FinishMarketModal } from "@/shared/ui/finish-market-modal";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

describe("FinishMarketModal Component", () => {
  const mockOnConfirm = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly when open", () => {
    render(
      <FinishMarketModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText("Compra Concluída!")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor Total Gasto (R$)")).toBeInTheDocument();
  });

  it("should format currency correctly as user types", () => {
    render(
      <FinishMarketModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const input = screen.getByLabelText("Valor Total Gasto (R$)") as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: "1234" } });
    expect(input.value).toBe("12,34");

    fireEvent.change(input, { target: { value: "5" } });
    expect(input.value).toBe("0,05");
  });

  it("should call onConfirm with the correct number value", async () => {
    render(
      <FinishMarketModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const input = screen.getByLabelText("Valor Total Gasto (R$)");
    fireEvent.change(input, { target: { value: "15050" } }); // 150,50
    
    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith(150.5);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should call onConfirm with zero if input is empty", async () => {
    render(
      <FinishMarketModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith(0);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should show loading state when isLoading is true", () => {
    render(
      <FinishMarketModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />
    );

    expect(screen.getByText("Salvando...")).toBeInTheDocument();
    expect(screen.getByText("Salvando...")).toBeDisabled();
  });
});
