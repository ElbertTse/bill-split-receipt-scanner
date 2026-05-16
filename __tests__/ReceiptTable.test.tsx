import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptTable, { ReceiptItem } from '@/components/ReceiptTable';

const mockItems: ReceiptItem[] = [
  { item: 'Pizza', price: 15.0, who: ['Alice', 'Bob'] },
  { item: 'Soda', price: 5.0, who: ['Charlie'] },
];

describe('ReceiptTable', () => {
  it('renders the initial items correctly', () => {
    render(<ReceiptTable items={mockItems} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('$15.00')).toBeInTheDocument();
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
    expect(screen.getByText('Soda')).toBeInTheDocument();
  });

  it('enters edit mode and allows saving changes', () => {
    render(<ReceiptTable items={mockItems} />);
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    
    const itemInput = screen.getByDisplayValue('Pizza');
    const priceInput = screen.getByDisplayValue('15');
    
    fireEvent.change(itemInput, { target: { value: 'Large Pizza' } });
    fireEvent.change(priceInput, { target: { value: '20' } });
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(screen.queryByDisplayValue('Large Pizza')).not.toBeInTheDocument();
    expect(screen.getByText('Large Pizza')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  it('allows adding and removing tags in edit mode', () => {
    render(<ReceiptTable items={mockItems} />);
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]); // Edit "Soda" row
    
    expect(screen.getAllByText('Charlie').length).toBeGreaterThan(0);
    
    const tagInput = screen.getByPlaceholderText('Type a name & press Enter');
    fireEvent.change(tagInput, { target: { value: 'Dave' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    
    expect(screen.getAllByText('Dave').length).toBeGreaterThan(0);
    
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getAllByText('Dave').length).toBeGreaterThan(0);
  });

  it('calculates and displays the grand total and split summary correctly', () => {
    render(<ReceiptTable items={mockItems} />);
    
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();

    expect(screen.getByText('Split Summary')).toBeInTheDocument();

    expect(screen.getAllByText('$7.50')).toHaveLength(2); // Alice and Bob
    expect(screen.getAllByText('$5.00')).toHaveLength(2); // Charlie owes $5, and the Soda item costs $5
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

  it('allows adding all previously existing names to a row', () => {
    render(<ReceiptTable items={mockItems} />);
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]); // Edit "Soda" row
    
    const addAllBtn = screen.getByText('Add All');
    fireEvent.click(addAllBtn);
    
    // Soda row originally just had Charlie. Now it should have Alice and Bob as well.
    fireEvent.click(screen.getByText('Save'));
    
    // Bob should have $7.50 from Pizza + ($5.00 / 3) = $1.66 from Soda
    // Since we're just checking the DOM, we can check if Bob and Alice exist in the summary
    // and if there are more Bob/Alice tags than before.
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(2); 
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(2);
  });
});
