import streamlit as st
import httpx
import uuid


API_URL = "http://127.0.0.1:8000"


if "messages" not in st.session_state:
    st.session_state.messages = []

if "is_new_chat" not in st.session_state:
    st.session_state.is_new_chat = True

if "chat_id" not in st.session_state:
    st.session_state.chat_id = None

if not st.session_state.is_new_chat:
    assert st.session_state.chat_id is not None
    chat = httpx.get(f"{API_URL}/chat/{st.session_state.chat_id}").json()

    st.session_state.messages = [
        {
            "role": message["role"],
            "content": message["content"],
            "is_evicted": message["is_evicted"],
        }
        for message in chat["archive"]
    ]
else:
    st.session_state.messages = []


st.title("Simple chat")

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        if message["is_evicted"]:
            content = f":grey[{message['content']}]"
        else:
            content = message["content"]
        st.markdown(content)

if prompt := st.chat_input("What is up?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    if st.session_state.is_new_chat:
        st.session_state.chat_id = httpx.post(f"{API_URL}/chat").text[1:-1]
        st.session_state.is_new_chat = False

    with st.chat_message("assistant"):
        with httpx.stream(
            "POST",
            f"{API_URL}/message",
            json={
                "chat_id": st.session_state.chat_id,
                "message": {"role": "user", "content": prompt},
            },
        ) as response:
            answer = st.write_stream(response.iter_text())
    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": answer,
            "is_evicted": False,
        }
    )


chats = httpx.get(f"{API_URL}/chats").json()


def set_chat(chat_id: uuid.UUID | None = None):
    st.session_state.chat_id = chat_id
    st.session_state.is_new_chat = chat_id is None


with st.sidebar:
    st.button(
        "New chat",
        on_click=set_chat,
        kwargs={"chat_id": None},
        key="button_new_chat",
        type="secondary",
        use_container_width=True,
    )

    for chat in chats:
        st.button(
            chat["title"][:21] + "..." if len(chat["title"]) > 21 else chat["title"],
            on_click=set_chat,
            kwargs={"chat_id": chat["id"]},
            key=f"button_chat_{chat['id']}",
            type="tertiary",
        )
