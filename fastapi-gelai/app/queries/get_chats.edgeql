select Chat {
    messages,
    user := .<chats[is User],
} filter .user.name = <str>$username;
