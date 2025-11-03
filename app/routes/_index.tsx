import type { Route } from './+types/_index';
import { css } from 'styled-system/css';
 
export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}
 
export default function HomePage() {
  return (
    <div>
      <h1 className={css({ fontSize: '2xl', fontWeight: 'light', bg: 'red.500' })}>Welcome to the home page</h1>
    </div>
  )
}