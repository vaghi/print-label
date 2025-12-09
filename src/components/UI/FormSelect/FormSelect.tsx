import React from 'react';
import styles from './styles.module.scss';

export interface SelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    error?: string;
    required?: boolean;
    fullWidth?: boolean;
    placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label, id, name, value, onChange, options, error, required, fullWidth, placeholder = "Select an option"
}) => {
    return (
        <div className={styles.field} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
            <label htmlFor={id} className={styles.label}>
                {label} {required && '*'}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={styles.select}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default FormSelect;
