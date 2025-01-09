with new_chat := (insert ChatHistory)
select (
    update User filter .name = <str>$username
    set {
        chats := assert_distinct(.chats union new_chat)
    }
) {
    new_chat_id := new_chat.id
}



    
