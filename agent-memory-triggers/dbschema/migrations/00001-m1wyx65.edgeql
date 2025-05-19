CREATE MIGRATION m1wyx65gw3ka2vs56xqr7ruxy54ibdwbtvlun2rmbjuqjksv4xfjza
    ONTO initial
{
  CREATE EXTENSION pgvector VERSION '0.7';
  CREATE EXTENSION ai VERSION '1.0';
  CREATE TYPE default::Message {
      CREATE PROPERTY is_evicted: std::bool {
          SET default := false;
      };
      CREATE PROPERTY body: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY llm_role: std::str;
      CREATE PROPERTY tool_args: std::json;
      CREATE PROPERTY tool_name: std::str;
  };
  CREATE TYPE default::Chat {
      CREATE MULTI LINK archive: default::Message;
      CREATE MULTI LINK history := (SELECT
          .archive
      FILTER
          NOT (.is_evicted)
      );
      CREATE PROPERTY title: std::str {
          SET default := 'Untitled';
      };
      CREATE TRIGGER get_title
          AFTER UPDATE 
          FOR EACH DO (WITH
              messages := 
                  (SELECT
                      __new__.history
                  ORDER BY
                      .created_at ASC
                  )
              ,
              messages_body := 
                  std::array_agg((SELECT
                      messages.body
                  ORDER BY
                      messages.created_at ASC
                  ))
          SELECT
              (std::net::http::schedule_request('http://127.0.0.1:8000/get_title', method := std::net::http::Method.POST, headers := [('Content-Type', 'application/json')], body := std::to_bytes(std::to_str(std::json_object_pack({('chat_id', <std::json>__new__.id), ('messages', <std::json>messages_body)})))) IF (__new__.title = 'Untitled') ELSE {})
          );
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE TRIGGER extract
          AFTER UPDATE 
          FOR EACH DO (SELECT
              std::net::http::schedule_request('http://127.0.0.1:8000/extract', method := std::net::http::Method.POST, headers := [('Content-Type', 'application/json')], body := std::to_bytes(std::to_str(std::json_object_pack({('chat_id', <std::json>__new__.id)}))))
          );
  };
  CREATE FUNCTION default::request_summary(chat_id: std::uuid, cutoff: std::datetime) ->  std::net::http::ScheduledRequest USING (WITH
      chat := 
          std::assert_exists((SELECT
              default::Chat
          FILTER
              (.id = chat_id)
          ))
      ,
      messages := 
          (SELECT
              chat.history
          FILTER
              (.created_at < cutoff)
          )
      ,
      summary_datetime := 
          (SELECT
              messages.created_at ORDER BY
                  messages.created_at DESC
          LIMIT
              1
          )
      ,
      messages_body := 
          std::array_agg((SELECT
              messages.body
          ORDER BY
              messages.created_at ASC
          ))
  SELECT
      std::net::http::schedule_request('http://127.0.0.1:8000/summarize', method := std::net::http::Method.POST, headers := [('Content-Type', 'application/json')], body := std::to_bytes(std::to_str(std::json_object_pack({('chat_id', <std::json>chat_id), ('messages', <std::json>messages_body), ('cutoff', <std::json>cutoff), ('summary_datetime', <std::json>summary_datetime)}))))
  );
  CREATE GLOBAL default::num_messages_to_leave -> std::int64 {
      SET default := 2;
  };
  CREATE GLOBAL default::summary_threshold -> std::int64 {
      SET default := 5;
  };
  CREATE FUNCTION default::insert_summary(chat_id: std::uuid, cutoff: std::datetime, summary: std::str, summary_datetime: std::datetime) ->  default::Chat USING (WITH
      chat := 
          std::assert_exists((SELECT
              default::Chat
          FILTER
              (.id = chat_id)
          ))
      ,
      evicted_messages := 
          (UPDATE
              chat.archive
          FILTER
              (.created_at < cutoff)
          SET {
              is_evicted := true
          })
      ,
      summary_message := 
          (INSERT
              default::Message
              {
                  llm_role := 'system',
                  body := summary,
                  created_at := summary_datetime
              })
  UPDATE
      chat
  SET {
      archive := DISTINCT ((.archive UNION summary_message))
  });
  ALTER TYPE default::Chat {
      CREATE TRIGGER summarize
          AFTER UPDATE, INSERT 
          FOR EACH DO (WITH
              remaining_messages := 
                  (SELECT
                      __new__.history ORDER BY
                          .created_at DESC
                  LIMIT
                      GLOBAL default::num_messages_to_leave
                  )
              ,
              last_message := 
                  (SELECT
                      remaining_messages ORDER BY
                          .created_at DESC
                  LIMIT
                      1
                  )
              ,
              cutoff_message := 
                  (SELECT
                      remaining_messages ORDER BY
                          .created_at ASC
                  LIMIT
                      1
                  )
          SELECT
              (default::request_summary(__new__.id, std::assert_exists(cutoff_message.created_at)) IF ((std::count(__new__.history) > GLOBAL default::summary_threshold) AND (last_message.llm_role = 'assistant')) ELSE {})
          );
  };
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::Fact {
      CREATE PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY value: std::str;
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (((.key ++ ': ') ++ .value));
      CREATE LINK from_message: default::Message;
      CREATE PROPERTY body := (((.key ++ ': ') ++ .value));
  };
  CREATE TYPE default::Prompt {
      CREATE LINK from_message: default::Message;
      CREATE PROPERTY key: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY value: std::str;
      CREATE PROPERTY body := (((.key ++ ': ') ++ .value));
  };
  CREATE TYPE default::Resource {
      CREATE PROPERTY body: std::str;
      CREATE DEFERRED INDEX ext::ai::index(embedding_model := 'text-embedding-3-small') ON (.body);
  };
};
