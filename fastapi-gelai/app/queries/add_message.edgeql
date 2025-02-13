with
    user := (select User filter .name = <str>$username),
update Chat
filter .id = <uuid>$chat_id and .<chats[is User] = user
set {
    messages := assert_distinct(.messages union (
        insert Message {
            role := <str>$message_role,
            body := <str>$message_body,
            sources := array_unpack(<array<str>>$sources)
        }
    ))
}
