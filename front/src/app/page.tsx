import styles from './page.module.css';
import { Button } from "../components/ui/button";

export default function Page() {
  return (
    <main className={styles.page}>
      <h1>Hola</h1>
      <Button>Hola</Button>
    </main>
  );
}
