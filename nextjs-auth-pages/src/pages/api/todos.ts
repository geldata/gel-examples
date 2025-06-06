import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/edgedb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = auth.getSession(req);

  switch (req.method) {
    case "GET":
      res.json(
        await session.client.query(
          `select Todo {id, content, completed, created_on}
        order by .created_on desc`
        )
      );
      break;
    case "POST":
      res.status(201).json(
        await session.client
          // workaround for this bug: https://github.com/edgedb/edgedb/issues/6535
          .withConfig({ apply_access_policies: false })
          .querySingle(
            `
            select (insert Todo {
              content := <str>$content
            }) {id, content, completed, created_on}`,
            { content: req.body.content }
          )
      );
      break;
    case "PATCH":
      res.json(
        await session.client.querySingle(
          `
            select (update Todo
            filter .id = <uuid>$id
            set {
              content := <optional str>$content ?? .content,
              completed := <optional bool>$completed ?? .completed,
            }) {id, content, completed, created_on}`,
          req.body
        )
      );
      break;
    case "DELETE":
      res.json(
        await session.client.querySingle(
          `
            delete Todo
            filter .id = <uuid>$id`,
          { id: req.body.id }
        )
      );
      break;
    default:
      res.status(405).send(`unsupported method ${req.method}`);
  }
}
