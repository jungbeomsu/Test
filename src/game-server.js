import gameServer from './gameServer';

const {PORT} = process.env;
const port = PORT || 4000;

gameServer.listen(port, () => {
  console.log('[GameServer] Listening');
});
