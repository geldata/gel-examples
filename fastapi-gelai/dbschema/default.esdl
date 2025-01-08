module default {
    type Message {
        role: str;
        body: str;
        timestamp: datetime {
            default := datetime_current();
        }
        multi sources: str;
    }

    type ChatHistory {
        multi messages: Message;
        summary: str;
    }

    type User {
        name: str {
            constraint exclusive;
        }
        multi chats: ChatHistory;
        facts: str;
    }
}
