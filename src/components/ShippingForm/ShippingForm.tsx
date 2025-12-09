import React, { useState } from 'react';
import styles from './styles.module.scss';
import Modal, { Spinner } from '../UI/Modal/Modal';
import FormField from '../UI/FormField/FormField';
import FormSelect from '../UI/FormSelect/FormSelect';
import { US_STATES } from '../../constants/states';

export interface ShippingFormProps {
    formData: {
        from_street: string; from_apt: string; from_city: string; from_state: string; from_zip: string;
        to_street: string; to_apt: string; to_city: string; to_state: string; to_zip: string;
        weight: string; length: string; width: string; height: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    isModalOpen: boolean;
    result: any;
    error: string | null;
    errors?: Record<string, string>;
    closeModal: () => void;
    isFormValid: boolean;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
    formData, handleChange, handleSubmit, isLoading, isModalOpen, result, error, errors, closeModal, isFormValid
}) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Shipping Label</h1>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>From Address</h2>
          <div className={styles.grid}>
             <FormField 
                id="from_street" name="from_street" label="Street Address" 
                value={formData.from_street} onChange={handleChange} 
                placeholder="123 Main St" required fullWidth 
             />
             <FormField 
                id="from_apt" name="from_apt" label="Apt / Suite" 
                value={formData.from_apt} onChange={handleChange} 
                placeholder="Apt 4B" fullWidth 
             />
             <FormField 
                id="from_city" name="from_city" label="City" 
                value={formData.from_city} onChange={handleChange} 
                placeholder="New York" required 
             />
             <FormSelect
                id="from_state" name="from_state" label="State"
                value={formData.from_state} onChange={handleChange as any}
                options={US_STATES} required placeholder="Select State"
             />
             <FormField 
                id="from_zip" name="from_zip" label="ZIP Code" 
                value={formData.from_zip} onChange={handleChange} 
                placeholder="10001" required error={errors?.from_zip}
                inputMode="numeric"
             />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Destination Address</h2>
           <div className={styles.grid}>
             <FormField 
                id="to_street" name="to_street" label="Street Address" 
                value={formData.to_street} onChange={handleChange} 
                placeholder="456 Elm St" required fullWidth 
             />
             <FormField 
                id="to_apt" name="to_apt" label="Apt / Suite" 
                value={formData.to_apt} onChange={handleChange} 
                placeholder="Suite 200" fullWidth 
             />
             <FormField 
                id="to_city" name="to_city" label="City" 
                value={formData.to_city} onChange={handleChange} 
                placeholder="Los Angeles" required 
             />
             <FormSelect
                id="to_state" name="to_state" label="State"
                value={formData.to_state} onChange={handleChange as any}
                options={US_STATES} required placeholder="Select State"
             />
             <FormField 
                id="to_zip" name="to_zip" label="ZIP Code" 
                value={formData.to_zip} onChange={handleChange} 
                placeholder="90001" required error={errors?.to_zip}
                inputMode="numeric"
             />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Package Details</h2>
          <div className={styles.grid}>
            <FormField id="weight" name="weight" label="Weight" value={formData.weight} onChange={handleChange} required>
               <div className={styles.inputGroup}>
                 <input 
                     id="weight"
                     name="weight" value={formData.weight} onChange={handleChange}
                     type="number" className={styles.input} placeholder="0" />
                 <span className={styles.unit}>oz</span>
               </div>
            </FormField>
            <FormField id="length" name="length" label="Length" value={formData.length} onChange={handleChange} required>
                <div className={styles.inputGroup}>
                    <input 
                        id="length"
                        name="length" value={formData.length} onChange={handleChange}
                        type="number" className={styles.input} placeholder="0" />
                    <span className={styles.unit}>in</span>
                </div>
            </FormField>
            <FormField id="width" name="width" label="Width" value={formData.width} onChange={handleChange} required>
                <div className={styles.inputGroup}>
                    <input 
                        id="width"
                        name="width" value={formData.width} onChange={handleChange}
                        type="number" className={styles.input} placeholder="0" />
                    <span className={styles.unit}>in</span>
                </div>
            </FormField>
            <FormField id="height" name="height" label="Height" value={formData.height} onChange={handleChange} required>
                <div className={styles.inputGroup}>
                    <input 
                        id="height"
                        name="height" value={formData.height} onChange={handleChange}
                        type="number" className={styles.input} placeholder="0" />
                    <span className={styles.unit}>in</span>
                </div>
            </FormField>
          </div>
        </section>

        <button type="submit" className={styles.button} disabled={isLoading || !isFormValid}>
            {isLoading ? 'Creating Label...' : 'Create Label'}
        </button>
      </form>

      <Modal isOpen={isModalOpen} onClose={!isLoading ? closeModal : undefined}>
        {isLoading && <Spinner />}
        {!isLoading && error && (
            <div className={styles.errorResult}>
                <h3>Error Creating Label</h3>
                <p>{error}</p>
                <button className={styles.secondaryButton} onClick={closeModal}>Close</button>
            </div>
        )}
        {!isLoading && result && (
            <div className={styles.successResult}>
                <h3>Label Created Successfully!</h3>
                <p>Carrier: <strong>{result.carrier} {result.service}</strong></p>
                <p>Rate: <strong>{result.rate} {result.currency}</strong></p>
                
                {/* Result.labelUrl is usually an image (PNG) or PDF. 
                    If it's a PDF, this might show a broken image, but for default test carrier it's often PNG. */}
                <div className={styles.imageWrapper} key={result.labelUrl}>
                    {!isImageLoaded && (
                        <div className={styles.imagePlaceholder} data-testid="image-placeholder">
                            <Spinner />
                        </div>
                    )}
                    <img 
                        src={result.labelUrl} 
                        alt="Shipping Label" 
                        className={styles.labelImage} 
                        onLoad={() => setIsImageLoaded(true)}
                        style={{ opacity: isImageLoaded ? 1 : 0 }}
                    />
                </div>
                
                <div className={styles.actionButtons}>
                    <a href={result.labelUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
                        Open Label
                    </a>
                    <button 
                        className={styles.printButton} 
                        onClick={() => {
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            document.body.appendChild(iframe);
                            
                            const content = `
                                <html>
                                    <head>
                                        <style>
                                            body { margin: 0; display: flex; justify-content: center; align-items: center; }
                                            img { max-width: 100%; height: auto; }
                                            @media print {
                                                @page { size: auto; margin: 0mm; }
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <img src="${result.labelUrl}" onload="window.print();" />
                                    </body>
                                </html>
                            `;
                            
                            if (iframe.contentWindow) {
                                iframe.contentWindow.document.open();
                                iframe.contentWindow.document.write(content);
                                iframe.contentWindow.document.close();
                            }

                            // Cleanup
                            setTimeout(() => {
                                document.body.removeChild(iframe);
                            }, 5000);
                        }}
                        aria-label="Print Label"
                    >
                       🖨️
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default ShippingForm;
