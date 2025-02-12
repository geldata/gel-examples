select Chat {
    messages: { role, body, sources },
    user := .<chats[is User],
} filter .user.name = <str>$username;
