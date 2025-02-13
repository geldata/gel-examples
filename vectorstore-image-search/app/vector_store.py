from gel.ai import GelVectorstore

client_config = {
    "host": "localhost",
    "port": 5656,
    "user": "edgedb",
    "database": "main",
    "tls_security": "insecure",
}

vector_store = GelVectorstore(
    embedding_model=None,
    record_type="Image",
    collection_name="images",
    client_config=client_config,
)
