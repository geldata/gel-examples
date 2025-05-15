from llama_index.core import SimpleDirectoryReader, StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.gel import GelVectorStore
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


DOCS_PATH = Path("md_docs/").resolve()
print(DOCS_PATH)

documents = SimpleDirectoryReader(DOCS_PATH.as_posix(), recursive=True).load_data()
vector_store = GelVectorStore()

storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context, show_progress=True
)
