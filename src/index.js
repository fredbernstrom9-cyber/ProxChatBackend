const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());

const { LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;

app.get('/api/token', async (req, res) => {
  const { room, user } = req.query;
  if (!room || !user) return res.status(400).json({ error: 'room and user required' });

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: user,
    ttl: '1h',
  });
  token.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

  res.json({ token: await token.toJwt() });
});

app.listen(3000, () => console.log('ProxChat backend running on :3000'));
