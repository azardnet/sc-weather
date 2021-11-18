import fetch from 'node-fetch';
import express from 'express';
import cors from "cors";

const api = () => {
  const app = express()
  app.use(cors());
  const port = 3701;
  app.get('/api/ip', cors({ origin: false }), (req, res) => {
    (async () => {
        const response = await fetch('http://ip-api.com/json');
        const data = await response.json();
        const result = data;
        delete result.status;
        res.send(result);
      })();
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
};

api();

export default api;