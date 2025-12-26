from vector_store import vector_store
from gel.ai import Record


def update():
    vector_store.update_record(
        Record(
            id="6daf6f6a-ef05-11ef-a303-3ba5f49a88d2",
            # metadata={"test": "test"},
            # embedding=None,
            text=None,
        )
    )


if __name__ == "__main__":
    update()
