# Find chats that contain messages similar to query

with 
    user := (select User filter .name = <str>$username),
    chats := (select ChatHistory filter .<chats[is User] = user)

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

