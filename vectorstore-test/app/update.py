from vector_store import vector_store
from gel.ai import Record


def update():
    # vector_store.update_vector(
    #     Record(
    #         id="fd30cae4-f036-11ef-ba1b-ff2bf8d044e4",
    #         metadata=None,
    #         # embedding=None,
    #         text=None,
    #     )
    # )

    vector_store.delete("d6db8e6a-f036-11ef-ba1b-97a7df5519fb")


if __name__ == "__main__":
    update()
