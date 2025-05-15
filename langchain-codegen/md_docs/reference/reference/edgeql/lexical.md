# Lexical structure

Every EdgeQL command is composed of a sequence of tokens, terminated by a semicolon (;).  The types of valid tokens as well as their order is determined by the syntax of the particular command.

EdgeQL is case sensistive except for keywords (in the examples the keywords are written in upper case as a matter of convention).

There are several kinds of tokens: keywords, identifiers, literals (constants) and symbols (operators and punctuation).

Tokens are normally separated by whitespace (space, tab, newline) or comments.

## Identifiers

There are two ways of writing identifiers in EdgeQL: plain and quoted. The plain identifiers are similar to many other languages, they are alphanumeric with underscores and cannot start with a digit. The quoted identifiers start and end with a backtick `quoted.identifier` and can contain any characters inside with a few exceptions. They must not start with an ampersand (@) or contain a double colon (::). If there’s a need to include a backtick character as part of the identifier name a double-backtick sequence (``) should be used: `quoted``identifier` will result in the actual identifier being quoted`identifier.

Quoted identifiers are usually needed to represent module names that contain a dot (.) or to distinguish names from reserved keywords (for instance to allow referring to a link named “order” as `order`).

## Names and keywords

There are a number of reserved and unreserved keywords in EdgeQL. Every identifier that is not a reserved keyword is a valid name. Names are used to refer to concepts, links, link properties, etc.

Fully-qualified names consist of a module, ::, and a short name. They can be used in most places where a short name can appear (such as paths and shapes).

## Constants

A number of scalar types have literal constant expressions.

## Punctuation

EdgeQL uses ; as a statement separator. It is idempotent, so multiple repetitions of ; don’t have any additional effect.

## Comments

Comments start with a # character that is not otherwise part of a string literal and end at the end of line. Semantically, a comment is equivalent to whitespace.

## Operators

EdgeQL operators listed in order of precedence from lowest to highest:

| operator |
| --- |
| union |
| if..else |
| or |
| and |
| not |
| =, !=, ?=, ?!= |
| <, >, <=, >= |
| like, ilike |
| in, not in |
| is, is not |
| +, -, ++ |
| *, /, //, % |
| ?? |
| distinct, unary - |
| ^ |
| type cast |
| array[], str[], json[], bytes[] |
| detached |

