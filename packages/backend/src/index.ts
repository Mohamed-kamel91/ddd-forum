import server from './bootstrap';

const PORT: number = Number(process.env.PORT || 3000);

server.start(PORT);
