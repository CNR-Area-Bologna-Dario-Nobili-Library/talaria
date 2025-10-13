import Echo from 'laravel-echo';
import io from 'socket.io-client';

const echo = new Echo({
  broadcaster: 'socket.io',
  host: 'https://talaria.local:6001',
  client: io,
  transports: ['websocket'], // 👈 forces WebSocket only
  encrypted: true,
  rejectUnauthorized: false, // 👈 if using self-signed cert
});

window.Echo = echo;


export default echo;


//redis-cli MONITOR | grep -E "BRPOPLPUSH|PUBLISH|RPUSH|LPUSH|lpush|publish"
//docker exec -it talaria_laravel_1 php artisan tinker
// event(new App\Events\BorrowRequestEvent([
//  'borrower' => ' Student A',
//  'item' => 'General Physics Vol.1',
//  'status' => '101242requested',
//]));
//laravel-echo-server start --debug
