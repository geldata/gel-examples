import os
import glob

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_gel import GelVectorStore
from dotenv import load_dotenv


load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
# vector_store = GelVectorStore(
#     embeddings=embeddings,
# )


def load_markdown_files(docs_dir: str = "md_docs") -> list[Document]:
    """Load markdown files from directory as Document objects."""
    docs = []
    for file_path in glob.glob(os.path.join(docs_dir, "**/*.md"), recursive=True):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Create metadata with path relative to docs_dir
            relative_path = os.path.relpath(file_path, docs_dir)
            metadata = {
                "source": relative_path,
                "path": file_path,
            }
            
            # Create Document object
            doc = Document(page_content=content, metadata=metadata)
            docs.append(doc)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
    
    return docs


def create_vectorstore(
    docs_dir: str = "md_docs/intro",
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> InMemoryVectorStore:
    """Create and populate a vector store with document chunks."""
    # Load docs
    docs = load_markdown_files(docs_dir)
    
    # Split documents
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n## ", "\n### ", "\n#### ", "\n", " ", ""],
    )
    chunks = splitter.split_documents(docs)
    
    # Create vectorstore
    vectorstore = GelVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
    )
    
    return vectorstore

def load_vectorstore():
    vector_store = GelVectorStore(
        embeddings=embeddings,
    )
    
    return vector_store

if __name__ == "__main__":
    # vector_store = create_vectorstore()

    vector_store = load_vectorstore()
    results = vector_store.similarity_search("How to install Gel?")
    print(results)