using extension ai;

module default {
    type Message {
        role: str;
        body: str;
        timestamp: datetime {
            default := datetime_current();
        }
        multi sources: str;

        deferred index ext::ai::index(embedding_model := 'text-embedding-3-small')
            on (.body);

    }

    type Chat {
        multi messages: Message;
    }

    type User {
        name: str {
            constraint exclusive;
        }
        multi chats: Chat;
    }
}
