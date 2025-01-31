with
    user := (select User filter .name = <str>$username),
    chat := (
        select Chat filter .<chats[is User] = user and .id = <uuid>$chat_id
    )
select Message {
    role,
    body,
    sources,
    chat := .<messages[is Chat]
} filter .chat = chat;
