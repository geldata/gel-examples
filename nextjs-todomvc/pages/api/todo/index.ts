import { NextApiRequest, NextApiResponse } from 'next';

import { usePool } from '../../../utils/usePool';
import { Task } from '../../[filter]';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const pool = await usePool();

  // GET /api/todo
  if (req.method === 'GET') {
    const result = await pool.queryJSON(
      'SELECT Task { id, text, completed } ORDER BY .id;'
    );
    const data = JSON.parse(result) as Task[];
    return res.status(200).json(data);
  }
  `update User { 
    posts += (insert BlogPost { 
      title := 'On Edgedb', 
      published := false
 }) } filter .id = <uuid>'af512f80-9d33-11eb-9a94-eb1b8a4d31ed';`;

  // POST /api/todo
  // expects { text: string }
  if (req.method === 'POST') {
    await pool.queryJSON('INSERT Task { text := <str>$text };', {
      text: req.body.text,
    });
    return res.status(200).send('Success');
  }

  return res.status(400);
};

export default handler;
