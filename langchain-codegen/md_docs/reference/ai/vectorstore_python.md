# Vectorstore Python API

## Core Classes

Type: class
Domain: py
Summary: 
Signature: class GelVectorstore


A framework-agnostic interface for interacting with Gel’s ext::vectorstore.

This class provides methods for storing, retrieving, and searching vector embeddings. It follows vector database conventions and supports different embedding models.

Args:

Type: method
Domain: py
Summary: 
Signature: add_itemsselfitems: list[InsertItem]


Add multiple items to the vector store in a single transaction. Embeddings will be generated and stored for all items.

Args:

Returns:

Type: method
Domain: py
Summary: 
Signature: add_vectorsselfrecords: list[InsertRecord]


Add pre-computed vector embeddings to the store. Use this method when you have already generated embeddings and want to store them directly without re-computing them.

Args:

Returns:

Type: method
Domain: py
Summary: 
Signature: deleteselfids: list[uuid.UUID]


Delete records from the vector store by their IDs.

Args:

Returns:

Type: method
Domain: py
Summary: 
Signature: get_by_idsselfids: list[uuid.UUID]list[Record]


Retrieve specific records by their IDs.

Args:

Returns:

Type: method
Domain: py
Summary: 
Signature: search_by_itemselfitem: Anyfilters: Optional[CompositeFilter] = Nonelimit: Optional[int] = 4list[SearchResult]


Search for similar items in the vector store.

This method:

Args:

Returns:

Type: method
Domain: py
Summary: 
Signature: search_by_vectorselfvector: list[float]filter_expression: str = ''limit: Optional[int] = 4list[SearchResult]


Search using a pre-computed vector embedding. Useful when you have already computed the embedding or want to search with a modified/combined embedding vector.

Args:

Returns:

Type: method
Domain: py
Summary: 
Signature: update_recordselfrecord: RecordOptional[uuid.UUID]


Update an existing record in the vector store. Only specified fields will be updated. If text is provided but not embedding, a new embedding will be automatically generated.

Args:

Returns:

Raises:

Type: class
Domain: py
Summary: 
Signature: class BaseEmbeddingModel


Abstract base class for embedding models. Any embedding model used with GelVectorstore must implement this interface. The model is expected to convert input data (text, images, etc.) into a numerical vector representation.

## Data Classes

Type: class
Domain: py
Summary: 
Signature: class InsertItem


An item whose embedding will be created and stored alongside the item in the vector store.

Args:

Type: class
Domain: py
Summary: 
Signature: class InsertRecord


A record to be added to the vector store with embedding pre-computed.

Args:

Type: class
Domain: py
Summary: 
Signature: class Record


A record retrieved from the vector store, or an update record. Custom __init__ so we can detect which fields the user passed (even if they pass None or {}).

Args:

Type: class
Domain: py
Summary: 
Signature: class SearchResult


A search result from the vector store.

Inherits from Record

Args:

## Metadata Filtering

Type: class
Domain: py
Summary: 
Signature: class FilterOperator


Enumeration of supported filter operators for metadata filtering.

Values:

Type: class
Domain: py
Summary: 
Signature: class FilterCondition


Enumeration of conditions for combining multiple filters.

Values:

Type: class
Domain: py
Summary: 
Signature: class MetadataFilter


Represents a single metadata filter condition.

Args:

Type: class
Domain: py
Summary: 
Signature: class CompositeFilter


Allows grouping multiple MetadataFilter instances using AND/OR conditions.

Args:

Type: function
Domain: py
Summary: 
Signature: get_filter_clausefilters: CompositeFilterstr


Get the filter clause for a given CompositeFilter.

Args:

Returns:

Raises:

