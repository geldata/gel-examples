# Documentation

We pride ourselves on having some of the best documentation around, but we want you to help us make it even better. Documentation is a great way to get started contributing to Gel. Improvements to our documentation create a better experience for every developer coming through the door behind you.

Follow our general and style guidelines to make for a smooth contributing exprience, both for us and for you. You may notice that the existing documentation doesn’t always follow the guidelines laid out here. They are aspirational, so there are times when we intentionally break with them. Other times, bits of documentation may not be touched for a while and so may not reflect our current guidelines. These are great “low-hanging fruit” opportunities for your contributions!

## Guidelines

## Style

## Where to Find It

Most of our documentation (including this guide) lives in the geldata repository in the docs directory.

## How to Build It

## Sphinx and reStructuredText

Our documentation is first built through Sphinx and is written in reStructuredText. If you’re unfamiliar with reStructuredText, the official primer is a good place to start. The official cheatsheet serves as a great companion reference while you write. Sphinx also offers their own reStructuredText primer.

Sphinx not only builds the documentation but also extends reStructuredText to allow for a more ergonomic experience when crafting docs.

ReStructuredText is an easy-to-learn markup language built for documentation. Here are the most commonly used elements across our documentation.

## Rendering Code

Use these tools to render code in your documentation contribution.

## Documenting EdgeQL

Tools to help document EdgeQL are in the :eql: domain.

## Documenting the EdgeQL CLI

## Substitutions

There’s a few substitutions and ReST toles that are useful when documenting certain terms and concepts:

| --- | --- |
| ReST markup | Description |
| |gelcmd| and :gelcmd:`blah` | Renders to $ gel and $ gel blah, with a context tooltip explaining that the CLI command used to be called edgedb. |
| |geluri| and :geluri:`u:p@h:p/b` | Renders to gel:// and gel://u:p@h:p/b, with a context tooltip explaining that the URI used to be edgedb://. |
| |Gel| and |Gel's| | Renders to “Gel” and “Gel’s”, with a context tooltip explaining that the Gel used to be called “EdgeDB”. |
| |branch| and |branches| | Renders to “branch” and “branches”, with a context tooltip explaining that the term used to be called “database” in EdgeDB < 5. |
| |EdgeDB| | Renders to “EdgeDB”, with a context tooltip explaining that EdgeDB was renamed to Gel. |
| |.gel| | Renders to .gel, with a context tooltip explaining that the file extension used to be .esdl. |
| :dotgel:`foo` | Renders to foo.gel, with a context tooltip explaining that the file extension used to be .esdl. |
| :gelenv:`BLAH` | Renders to GEL_BLAH, with a context tooltip explaining that this environment variable used to be EDGEDB_BLAH. |
| |gel.toml| | Renders to gel.toml, with a context tooltip explaining that this file used to be called edgedb.toml. |
| |gel-server| | Renders to $ gel-server, with a context tooltip explaining that this command used to be called edgedb-server. |
| |admin| | Renders to admin, with a context tooltip explaining that this username used to be called edgedb. |
| |main| | Renders to main, with a context tooltip explaining that this branch used to be called edgedb. |

## Documentation Versioning

Since Gel functionality is mostly consistent across versions, we offer a simple method of versioning documentation using two directives.

## Other Useful Tricks

