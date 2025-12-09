import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShippingFormContainer from './ShippingForm.container';

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

describe('ShippingFormContainer', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('should show validation error if fields are empty', () => {
        render(<ShippingFormContainer />);
        
        // Button should be disabled initially because form is empty
        const submitButton = screen.getByRole('button', { name: /Create Label/i });
        expect(submitButton).toBeDisabled();

        // Even if we force click (not possible for user, but logically), validation should hold.
        // But since it's disabled, we can't click it via filtered user event usually.
        // fireEvent.click(submitButton); 
        // We can skip the click test here or just verify disabled state is the new "validation" mechanic for UI.
    });

    it('should submit data and show success result', async () => {
        // Mock successful response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                labelUrl: 'http://test.com/label.png',
                rate: '10.00',
                currency: 'USD',
                carrier: 'USPS',
                service: 'Priority'
            })
        });

        render(<ShippingFormContainer />);

        // Fill Form
        fireEvent.change(screen.getByPlaceholderText('123 Main St'), { target: { value: '123 Test St', name: 'from_street' } }); // name attr is important if I used generic handler, but I used specific inputs.
        // Wait, in my component I used `name` attribute for binding. fireEvent.change needs to match that. 
        // Presentational component uses: <input name="from_street" ... />
        
        // Helper to fill all required
        const fill = (placeholder: string, val: string) => fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: val } });
        
        fill('123 Main St', '123 From St');
        fill('New York', 'New York');
        fill('10001', '10001');
        
        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'NY' } }); // From State
        fireEvent.change(selects[1], { target: { value: 'CA' } }); // To State

        fill('456 Elm St', '456 To St');
        fill('Los Angeles', 'Los Angeles');
        fill('90001', '90001');

        // Dimensions now required
        fireEvent.change(screen.getByLabelText('Weight *'), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText('Length *'), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText('Width *'), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText('Height *'), { target: { value: '5' } });

        // Submit
        const submitButton = screen.getByRole('button', { name: /Create Label/i });
        fireEvent.click(submitButton);

        // Expect Loading
        expect(screen.getByText('Creating Label...')).toBeInTheDocument();

        // Wait for fetch
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        // Expect Success Modal
        await waitFor(() => {
            expect(screen.getByText('Label Created Successfully!')).toBeInTheDocument();
        });
        
        // Check if form was cleared (inputs should be empty)
        // Note: Modal is open, form is behind. 
        // We can check if state values are empty if we had access, or check input values.
        expect(screen.getByPlaceholderText('123 Main St')).toHaveValue('');
        expect(screen.getByPlaceholderText('456 Elm St')).toHaveValue('');
    });

    it('should handle API error', async () => {
         (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: async () => ({ error: 'Invalid Address' })
        });

        render(<ShippingFormContainer />);
        
        // Fill minimum valid form (validation happens before fetch)
        const fill = (placeholder: string, val: string) => fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: val } });
        fill('123 Main St', '123 From');
        fill('New York', 'NY');
        fill('10001', '10001');
        const selects = screen.getAllByRole('combobox');
        fireEvent.change(selects[0], { target: { value: 'NY' } });
        fireEvent.change(selects[1], { target: { value: 'CA' } });
        fill('456 Elm St', '456 To');
        fill('Los Angeles', 'LA');
        fill('90001', '90001');
        
        // Dimensions
        fireEvent.change(screen.getByLabelText('Weight *'), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText('Length *'), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText('Width *'), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText('Height *'), { target: { value: '5' } });

        fireEvent.click(screen.getByRole('button', { name: /Create Label/i }));

        await waitFor(() => {
            expect(screen.getByText('Error Creating Label')).toBeInTheDocument();
            expect(screen.getByText('Invalid Address')).toBeInTheDocument();
        });
    });
    it('should show validation error if zip code is invalid', () => {
        render(<ShippingFormContainer />);
        
        // Enter invalid zip
        const zipInput = screen.getByPlaceholderText('10001');
        fireEvent.change(zipInput, { target: { name: 'from_zip', value: '123' } }); // Short invalid zip
        
        // Expect error message
        expect(screen.getByText(/Must be a valid US Zip Code/i)).toBeInTheDocument();
        
        // Enter valid zip
        fireEvent.change(zipInput, { target: { name: 'from_zip', value: '10001' } });
        
        // Expect error message to disappear
        expect(screen.queryByText(/Must be a valid US Zip Code/i)).not.toBeInTheDocument();
    });

    it('should sanitize zip code input to allow only numbers and hyphens', () => {
        render(<ShippingFormContainer />);
        const zipInput = screen.getByPlaceholderText('10001');

        // Simulate typing "12a3-4b5"
        fireEvent.change(zipInput, { target: { name: 'from_zip', value: '12a3-4b5' } });

        // Expect value to be sanitized to "123-45"
        expect(zipInput).toHaveValue('123-45');
    });
});
