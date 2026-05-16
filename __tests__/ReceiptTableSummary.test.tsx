import { render, screen } from '@testing-library/react';
import ReceiptTableSummary from '@/components/ReceiptTableSummary';
import { ReceiptItem } from '@/components/types';

const mockItems: ReceiptItem[] = [
  { item: 'Pizza', price: 15.0, who: ['Alice', 'Bob'] },
  { item: 'Soda', price: 5.0, who: ['Charlie'] },
];

describe('ReceiptTableSummary', () => {
  it('calculates and displays the split summary correctly', () => {
    render(<ReceiptTableSummary tableItems={mockItems} />);
    
    expect(screen.getByText('Split Summary')).toBeInTheDocument();
    
    // Alice and Bob split 15.00 -> 7.50 each
    expect(screen.getAllByText('$7.50')).toHaveLength(2);
    
    // Charlie owes 5.00
    expect(screen.getByText('$5.00')).toBeInTheDocument();
  });

  it('handles unassigned items correctly', () => {
    const items: ReceiptItem[] = [
      { item: 'Pizza', price: 10.0, who: [] },
    ];
    render(<ReceiptTableSummary tableItems={items} />);
    
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('renders nothing if items array is empty', () => {
    const { container } = render(<ReceiptTableSummary tableItems={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
