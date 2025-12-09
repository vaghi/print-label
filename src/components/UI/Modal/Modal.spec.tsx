import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Modal Component', () => {
    it('should not render content when isOpen is false', () => {
        render(
            <Modal isOpen={false}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('should render content when isOpen is true', () => {
        render(
            <Modal isOpen={true}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        const handleClose = jest.fn();
        render(
            <Modal isOpen={true} onClose={handleClose}>
                <div>Modal Content</div>
            </Modal>
        );
        
        const closeButton = screen.getByRole('button', { name: /×/i }); 
        // Note: The close button in Modal.tsx renders "&times;" which is often interpreted visually, 
        // accessible name might be tricky depending on how RTL queries it. 
        // If it fails, I'll adjust to getByText('×') or add aria-label.
        fireEvent.click(closeButton);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
