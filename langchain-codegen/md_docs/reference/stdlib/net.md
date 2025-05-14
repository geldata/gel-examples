# Net

The net module provides an interface for performing network-related operations directly from Gel. It is useful for integrating with external services, fetching data from APIs, or triggering webhooks as part of your database logic.

| --- | --- |
| net::RequestState | An enum representing the state of a network request. |
| net::RequestFailureKind | An enum representing the kind of failure that occurred for a network request. |
| net::http::Method | An enum representing HTTP methods. |
| net::http::Response | A type representing an HTTP response. |
| net::http::ScheduledRequest | A type representing a scheduled HTTP request. |

Type: type
Domain: eql
Summary: An enumeration of possible states for a network request.
Signature: type net::RequestState


An enumeration of possible states for a network request.

Possible values are:

Type: type
Domain: eql
Summary: An enumeration of possible failure kinds for a network request.
Signature: type net::RequestFailureKind


An enumeration of possible failure kinds for a network request.

Possible values are:

## HTTP Submodule

The net::http submodule provides types and functions for making HTTP requests.

