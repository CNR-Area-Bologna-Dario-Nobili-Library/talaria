import Echo from 'laravel-echo';
import io from 'socket.io-client';

const wsScheme = (location.protocol === 'https:') ? 'wss' : 'ws';
const echoHost = `${wsScheme}://${location.hostname}:6001`;

const echo = new Echo({
  broadcaster: 'socket.io',
  host: echoHost,
  client: io,
  transports: ['websocket', 'polling'],   // add fallback
  encrypted: true,
});

window.Echo = echo;

// Helpful connection logs (keep for debugging)
const s = echo.connector.socket;
s.on('connect',      () => console.log('WS connected:', s.id));
s.on('connect_error',(e)=> console.error('WS connect_error:', e));
s.on('reconnect',    (n)=> console.log('WS reconnected attempt', n));
s.on('reconnect_error',(e)=> console.error('WS reconnect_error:', e));

export default echo;


//redis-cli MONITOR | grep -E "BRPOPLPUSH|PUBLISH|RPUSH|LPUSH|lpush|publish"
//docker exec -it talaria_laravel_1 php artisan tinker
// event(new App\Events\BorrowRequestEvent([
//  'borrower' => ' Student A',
//  'item' => 'General Physics Vol.1',
//  'status' => '101242requested',
//]));
//laravel-echo-server start --debug
