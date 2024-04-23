import './app.css'
import Index from './index.svelte';

let app = new Index({
    target: document.getElementById('app')!
});

export default app
