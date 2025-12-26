from gel.ai import Vectorstore

client_config = {
    "host": "localhost",
    "port": 5656,
    "user": "edgedb",
    "database": "main",
    "tls_security": "insecure",
}

vector_store = Vectorstore(
    embedding_model=None,
    record_type="Image",
    collection_name="images",
    client_config=client_config,
)
