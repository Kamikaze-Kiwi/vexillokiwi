import './app.css'
import Game from './endpoints/Game.svelte'
import Statistics from './endpoints/Statistics.svelte';

const path = new URL(window.location.href).pathname;
const appTarget = document.getElementById('app')!;
let app;

if (path === '/stats' || path === '/statistics') {
  app = new Statistics({
    target: appTarget
  });
} else {
  app = new Game({
    target: appTarget
  })
}

export default app
