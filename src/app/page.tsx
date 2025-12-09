import ShippingFormContainer from "@/components/ShippingForm/ShippingForm.container";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ShippingFormContainer />
      </main>
    </div>
  );
}
