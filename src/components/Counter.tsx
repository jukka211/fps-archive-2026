import styles from './Counter.module.css'

/**
 * The giant “FPS23” behind the home and About pages: FPS, then `value`. On
 * phones it stays in the centre of the screen.
 */
export function Counter({value, dimmed}: {value: string; dimmed: boolean}) {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.counter} data-dimmed={dimmed} data-final-one={value.endsWith('1')}>
        <span>FPS</span>
        <span>{value}</span>
      </div>
    </div>
  )
}
