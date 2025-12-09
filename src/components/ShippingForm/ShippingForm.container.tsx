"use client";

import React, { useState } from 'react';
import ShippingForm, { ShippingFormProps } from './ShippingForm';

const ShippingFormContainer: React.FC = () => {
    const [formData, setFormData] = useState({
        from_street: '', from_apt: '', from_city: '', from_state: '', from_zip: '',
        to_street: '', to_apt: '', to_city: '', to_state: '', to_zip: '',
        weight: '', length: '', width: '', height: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateZip = (zip: string) => {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return zipRegex.test(zip);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let { name, value } = e.target;

        // Restrict Zip Code input to numbers and hyphens
        if (name === 'from_zip' || name === 'to_zip') {
            value = value.replace(/[^0-9-]/g, '');
        }

        setFormData({ ...formData, [name]: value });

        // Validate Zip Codes on change
        if (name === 'from_zip' || name === 'to_zip') {
            if (value && !validateZip(value)) {
                setErrors(prev => ({ ...prev, [name]: 'Must be a valid US Zip Code (e.g. 10001)' }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    const validateForm = () => {
        // Check required fields - everything except apt/suite
        const required = [
            'from_street', 'from_city', 'from_state', 'from_zip',
            'to_street', 'to_city', 'to_state', 'to_zip',
            'weight', 'length', 'width', 'height'
        ];
        
        // Check empty fields
        for (const field of required) {
            if (!(formData as any)[field]) return false;
        }

        // Check validation errors
        if (Object.keys(errors).length > 0) return false;

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!validateForm()) {
            setError("Please correct errors and fill in all required fields.");
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);
        setIsModalOpen(true);

        try {
            const payload = {
                from: {
                    street1: formData.from_street,
                    street2: formData.from_apt,
                    city: formData.from_city,
                    state: formData.from_state,
                    zip: formData.from_zip,
                    country: 'US',
                },
                to: {
                    street1: formData.to_street,
                    street2: formData.to_apt,
                    city: formData.to_city,
                    state: formData.to_state,
                    zip: formData.to_zip,
                    country: 'US',
                },
                parcel: {
                    weight: parseFloat(formData.weight),
                    length: parseFloat(formData.length),
                    width: parseFloat(formData.width),
                    height: parseFloat(formData.height),
                }
            };

            const response = await fetch('/api/create-label', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create label');
            }

            setResult(data);
            
            // Clear form on success
            setFormData({
                from_street: '', from_apt: '', from_city: '', from_state: '', from_zip: '',
                to_street: '', to_apt: '', to_city: '', to_state: '', to_zip: '',
                weight: '', length: '', width: '', height: ''
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    const isFormValid = validateForm();

    const props: ShippingFormProps = {
        formData,
        handleChange,
        handleSubmit,
        isLoading,
        isModalOpen,
        result,
        error,
        errors,
        closeModal,
        isFormValid
    };

  return <ShippingForm {...props} />;
};

export default ShippingFormContainer;
