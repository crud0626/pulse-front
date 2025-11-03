import { css } from "styled-system/css";

export default function HomePage() {
  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'light', bg: 'red.500' })}>Welcome to the MY PAGE!</h1>
    </div>
  )
}