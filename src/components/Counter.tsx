import styles from './Counter.module.css'

/**
 * The giant “23FPS” behind the home and About pages: `value`, then FPS. On
 * phones it stays in the centre of the screen.
 */
export function Counter({value, dimmed}: {value: string; dimmed: boolean}) {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.counter} data-dimmed={dimmed}>
        <span>{value}</span>
        <span>FPS</span>
      </div>
    </div>
  )
}
