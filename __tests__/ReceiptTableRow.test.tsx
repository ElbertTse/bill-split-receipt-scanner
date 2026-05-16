import { render, screen, fireEvent } from '@testing-library/react';
import ReceiptTableRow from '@/components/ReceiptTableRow';
import { ReceiptItem } from '@/components/types';

const mockItem: ReceiptItem = { item: 'Soda', price: 5.0, who: ['Charlie'] };

describe('ReceiptTableRow', () => {
  it('renders correctly when not editing', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(
      <table><tbody>
        <ReceiptTableRow 
          item={mockItem} 
          isEditing={false} 
          allUniqueNames={['Alice', 'Bob', 'Charlie']}
          onEdit={onEdit} 
          onDelete={onDelete} 
          onSave={jest.fn()} 
          onCancel={jest.fn()} 
        />
      </tbody></table>
    );
    
    expect(screen.getByText('Soda')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when editing and allows saving changes', () => {
    const onSave = jest.fn();
    render(
      <table><tbody>
        <ReceiptTableRow 
          item={mockItem} 
          isEditing={true} 
          allUniqueNames={['Alice', 'Bob', 'Charlie']}
          onEdit={jest.fn()} 
          onDelete={jest.fn()} 
          onSave={onSave} 
          onCancel={jest.fn()} 
        />
      </tbody></table>
    );
    
    const itemInput = screen.getByDisplayValue('Soda');
    const priceInput = screen.getByDisplayValue('5');
    
    fireEvent.change(itemInput, { target: { value: 'Large Soda' } });
    fireEvent.change(priceInput, { target: { value: '7.5' } });
    
    fireEvent.click(screen.getByText('Save'));
    expect(onSave).toHaveBeenCalledWith({ item: 'Large Soda', price: 7.5, who: ['Charlie'] });
  });

  it('allows canceling edits', () => {
    const onCancel = jest.fn();
    render(
      <table><tbody>
        <ReceiptTableRow 
          item={mockItem} 
          isEditing={true} 
          allUniqueNames={['Alice', 'Bob', 'Charlie']}
          onEdit={jest.fn()} 
          onDelete={jest.fn()} 
          onSave={jest.fn()} 
          onCancel={onCancel} 
        />
      </tbody></table>
    );
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('allows adding and removing tags', () => {
    render(
      <table><tbody>
        <ReceiptTableRow 
          item={mockItem} 
          isEditing={true} 
          allUniqueNames={['Alice', 'Bob', 'Charlie', 'Dave']}
          onEdit={jest.fn()} 
          onDelete={jest.fn()} 
          onSave={jest.fn()} 
          onCancel={jest.fn()} 
        />
      </tbody></table>
    );
    
    const tagInput = screen.getByPlaceholderText('Type a name & press Enter');
    fireEvent.change(tagInput, { target: { value: 'Dave' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    
    expect(screen.getByText('Dave')).toBeInTheDocument();

    const removeBtns = screen.getAllByText('×');
    fireEvent.click(removeBtns[0]); // Removes first tag (Charlie)
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('adds all previously existing names to a row', () => {
    const onSave = jest.fn();
    render(
      <table><tbody>
        <ReceiptTableRow 
          item={mockItem} 
          isEditing={true} 
          allUniqueNames={['Alice', 'Bob', 'Charlie']}
          onEdit={jest.fn()} 
          onDelete={jest.fn()} 
          onSave={onSave} 
          onCancel={jest.fn()} 
        />
      </tbody></table>
    );
    
    const addAllBtn = screen.getByText('Add All');
    fireEvent.click(addAllBtn);
    
    fireEvent.click(screen.getByText('Save'));
    // Should append the names that are not already in 'who'
    expect(onSave).toHaveBeenCalledWith({ item: 'Soda', price: 5, who: ['Charlie', 'Alice', 'Bob'] });
  });
});
