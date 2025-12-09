import React from 'react';
import styles from './styles.module.scss';

interface FormFieldProps {
    label: string;
    id: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    fullWidth?: boolean;
    inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    children?: React.ReactNode; // For Select or other custom inputs if needed
}

const FormField: React.FC<FormFieldProps> = ({
    label, id, name, value, onChange, type = 'text', placeholder, error, required, fullWidth, inputMode, children
}) => {
    return (
        <div className={styles.field} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <label htmlFor={id} className={styles.label}>
                {label} {required && '*'}
            </label>
            {children ? (
                children
            ) : (
                <input
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={type}
                    inputMode={inputMode}
                    className={styles.input}
                    placeholder={placeholder}
                />
            )}
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default FormField;
