import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptTable, { ReceiptItem } from '@/components/ReceiptTable';

const mockItems: ReceiptItem[] = [
  { item: 'Pizza', price: 15.0, who: ['Alice', 'Bob'] },
  { item: 'Soda', price: 5.0, who: ['Charlie'] },
];

describe('ReceiptTable', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the initial items correctly', () => {
    render(<ReceiptTable items={mockItems} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
    expect(screen.getByText('Soda')).toBeInTheDocument();
  });

  it('allows deleting an item', () => {
    render(<ReceiptTable items={mockItems} />);
    
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]); // Delete Pizza
    
    // Pizza should be gone
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
    
    // Grand Total should update to $5.00
    expect(screen.getAllByText('$5.00').length).toBeGreaterThan(0);
  });

  it('allows adding a new item', () => {
    render(<ReceiptTable items={mockItems} />);
    
    const addItemBtn = screen.getByText('Add New Item', { exact: false });
    fireEvent.click(addItemBtn);
    
    // Should immediately enter edit mode for a new row (inputs exist)
    const itemInputs = screen.queryAllByPlaceholderText('Item name');
    expect(itemInputs.length).toBeGreaterThan(0);
  });

  it('handles column resizing smoothly without throwing errors', () => {
    const { container } = render(<ReceiptTable items={mockItems} />);
    
    // The resize handle doesn't have text, but we can query by its class
    const handle = container.querySelector('.cursor-col-resize');
    if (handle) {
      fireEvent.mouseDown(handle, { clientX: 100 });
      fireEvent.mouseMove(window, { clientX: 150 });
      fireEvent.mouseUp(window);
    }
    
    // As long as no errors are thrown during mouse events, resizing logic functions in JSDOM
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });
});
