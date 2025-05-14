# Mutations

Gel provides GraphQL mutations to perform delete, insert and update operations.

## Delete

The “delete” mutation is very similar in structure to a query. Basically, it works the same way as a query, using the filter, order, and various pagination parameters to define a set of objects to be deleted. These objects are also returned as the result of the delete mutation. Each object type has a corresponding delete_<type> mutation:

| GraphQL | EdgeQL equivalent |
| --- | --- |
| mutation delete_all_books {     delete_Book {         title         synopsis         author {             name         }     } } | select (     delete Book ) {     title,     synopsis,     author: {         name     } }; |
| mutation delete_book_spam {     delete_Book(         filter: {             title: {                 eq: "Spam"             }         }     ) {         title         synopsis     } } | select (     delete Book     filter         Book.title = 'Spam' ) {     title,     synopsis }; |
| mutation delete_one_book {     delete_Book(         filter: {             author: {                 name: {                     eq:             "Lewis Carroll"                 }             }         },         order: {             title: {                 dir: ASC             }         },         first: 1     ) {         title         synopsis     } } | select (     delete Book     filter         Book.author.name =             'Lewis Carroll'     order by         Book.title ASC     limit 1 ) {     title,     synopsis }; |

## Insert

The “insert” mutation exists for every object type. It allows creating new objects and supports nested insertions, too. The objects to be inserted are specified via the data parameter, which takes a list of specifications. Each such specification has the same structure as the object being inserted with required and optional fields (although if a field is required in the object but has a default, it’s optional in the insert specification):

| GraphQL | EdgeQL equivalent |
| --- | --- |
| mutation insert_books {     insert_Book(         data: [{             title: "One"         }, {             title: "Two"         }]     ) {         id         title     } } | select {     (insert Book {         title := "One"     }),     (insert Book {         title := "Two"     }) } {     id,     title }; |

It’s possible to insert a nested structure all at once (e.g., a new book and a new author):

| GraphQL | EdgeQL equivalent |
| --- | --- |
| mutation insert_books {     insert_Book(         data: [{             title: "Three",             author: {                 data: {                     name:                 "Unknown"                 }             }         }]     ) {         id         title     } } | select (     insert Book {         title := "Three",         author := (             insert Author {                 name :=                 "Unknown"             }         )    } ) {     id,     title }; |

It’s also possible to insert a new object that’s connected to an existing object (e.g. a new book by an existing author). In this case the nested object is specified using filter, order, and various pagination parameters to define a set of objects to be connected:

| GraphQL | EdgeQL equivalent |
| --- | --- |
| mutation insert_book {     insert_Book(         data: [{             title: "Four",             author: {                 filter: {     name: {eq: "Unknown"}                 }             }         }]     ) {         id         title     } } | select (     insert Book {         title := "Four",         author := (             select Author             filter             Author.name =                 "Unknown"         )     } ) {     id,     title }; |

## Update

The “update” mutation has features that are similar to both an “insert” mutation and a query. On one hand, the mutation takes filter, order, and various pagination parameters to define a set of objects to be updated. On the other hand, the data parameter is used to specify what and how should be updated.

The data parameter contains the fields that should be altered as well as what type of update operation must be performed (set, increment, append, etc.). The particular operations available depend on the type of field being updated.

| GraphQL | EdgeQL equivalent |
| --- | --- |
| mutation update_book {     update_Book(         filter: {             title: {                 eq: "One"             }         }         data: {             synopsis: {                 set: "TBD"             }             author: {                 set: {         filter: {             name: {                 eq:                 "Unknown"             }         }                 }             }         }     ) {         id         title     } } | with     Upd := (         update Book         filter             Book.title =                 "One"         set {             synopsis :=                 "TBD",             author := (             select Author             filter             Author.name =                 "Unknown"             )         }     ) select Upd {     id,     title }; |

