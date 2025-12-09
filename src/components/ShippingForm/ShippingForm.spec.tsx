import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShippingForm, { ShippingFormProps } from './ShippingForm';

// Mock Modal to simplify testing
jest.mock('../UI/Modal/Modal', () => {
    return {
        __esModule: true,
        default: ({ isOpen, children }: any) => isOpen ? <div data-testid="modal">{children}</div> : null,
        Spinner: () => <div>Loading...</div>
    };
});

const defaultProps: ShippingFormProps = {
    formData: {
        from_street: '', from_apt: '', from_city: '', from_state: '', from_zip: '',
        to_street: '', to_apt: '', to_city: '', to_state: '', to_zip: '',
        weight: '', length: '', width: '', height: ''
    },
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    isModalOpen: false,
    result: null,
    error: null,
    closeModal: jest.fn(),
    isFormValid: true // Default to valid for most tests
};

describe('ShippingForm Component', () => {
    it('should render form fields', () => {
        render(<ShippingForm {...defaultProps} />);
        expect(screen.getByText(/From Address/i)).toBeInTheDocument();
        expect(screen.getAllByText('Street Address *').length).toBeGreaterThan(0);
        // Just checking a few to ensure asterisks are present
        expect(screen.getByText('Weight *')).toBeInTheDocument();
    });

    it('should call handleChange when input changes', () => {
        render(<ShippingForm {...defaultProps} />);
        const input = screen.getByPlaceholderText('123 Main St');
        fireEvent.change(input, { target: { value: 'New Street' } });
        expect(defaultProps.handleChange).toHaveBeenCalled();
    });

    it('should call handleSubmit when Create Label button is clicked', () => {
        render(<ShippingForm {...defaultProps} />);
        const button = screen.getByRole('button', { name: /Create Label/i });
        fireEvent.click(button);
        expect(defaultProps.handleSubmit).toHaveBeenCalled();
    });

    it('should disable button and show loading text when isLoading is true', () => {
        render(<ShippingForm {...defaultProps} isLoading={true} />);
        const button = screen.getByRole('button', { name: /Creating Label.../i });
        expect(button).toBeDisabled();
    });

    it('should disable button when form is invalid', () => {
        render(<ShippingForm {...defaultProps} isFormValid={false} />);
        const button = screen.getByRole('button', { name: /Create Label/i });
        expect(button).toBeDisabled();
    });

    it('should display result in modal when provided', () => {
        const resultProps = {
            ...defaultProps,
            isModalOpen: true,
            result: {
                carrier: 'USPS',
                service: 'Priority',
                rate: '10.00',
                currency: 'USD',
                labelUrl: 'http://example.com/label.png'
            }
        };
        render(<ShippingForm {...resultProps} />);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Label Created Successfully!')).toBeInTheDocument();
    });

    it('should trigger print logic via iframe when print button is clicked', () => {
        const resultProps = {
            ...defaultProps,
            isModalOpen: true,
            result: {
                carrier: 'USPS',
                service: 'Priority',
                rate: '10.00',
                currency: 'USD',
                labelUrl: 'http://example.com/label.png'
            }
        };
        render(<ShippingForm {...resultProps} />);
        
        const appendChildSpy = jest.spyOn(document.body, 'appendChild');
        
        // Find print button by aria-label since it's icon-only now
        const printButton = screen.getByLabelText('Print Label');
        fireEvent.click(printButton);
        
        expect(appendChildSpy).toHaveBeenCalled();
        const appendedNode = appendChildSpy.mock.calls[0][0] as HTMLElement;
        expect(appendedNode.tagName).toBe('IFRAME');
        
        appendChildSpy.mockRestore();
    });

    it('should show spinner while image is loading and hide it when loaded', () => {
        const resultProps = {
            ...defaultProps,
            isModalOpen: true,
            result: {
                carrier: 'USPS',
                service: 'Priority',
                rate: '10.00',
                currency: 'USD',
                labelUrl: 'http://example.com/label.png'
            }
        };
        render(<ShippingForm {...resultProps} />);
        
        // Initial state: Placeholder visible, Image hidden (opacity 0)
        const placeholder = screen.getByTestId('image-placeholder');
        const image = screen.getByAltText('Shipping Label');
        
        expect(placeholder).toBeInTheDocument();
        expect(image).toHaveStyle({ opacity: '0' });
        
        // Simulate image load
        fireEvent.load(image);
        
        // Loaded state: Placeholder removed, Image visible
        expect(screen.queryByTestId('image-placeholder')).not.toBeInTheDocument();
        expect(image).toHaveStyle({ opacity: '1' });
    });
});
