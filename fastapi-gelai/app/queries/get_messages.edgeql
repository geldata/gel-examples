with
    user := (select User filter .name = <str>$username),
    chat := (
        select ChatHistory filter .<chats[is User] = user and .id = <uuid>$chat_id
    )
select Message {
    role,
    body,
    sources,
    chat := .<messages[is ChatHistory]
} filter .chat = chat;

