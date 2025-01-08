select ChatHistory {
    messages,
    summary,
    user := .<chats[is User],
} filter .user.name = <str>$username and .id = <uuid>$chat_id;
