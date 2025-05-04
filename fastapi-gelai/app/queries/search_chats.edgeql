with
    user := (select User filter .name = <str>$username),
    chats := (
        select Chat 
        filter .<chats[is User] = user 
               and .id != <uuid>$current_chat_id
    )

select chats {
    distance := min(
        ext::ai::search(
            .messages,
            <array<float32>>$embedding,
        ).distance,
    ),
    messages: {
        role, body, sources
    }
}

order by .distance
limit <int64>$limit;

