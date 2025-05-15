# Code

This section describes how to build Gel locally, how to use its internal tools, and how to contribute to it.

## Building Locally

The following instructions should be used to create a “dev” build on Linux or macOS.  Windows is not currently supported.

On Ubuntu 24.04, these can be installed by running:

```bash
$ apt install make gcc rust-all autotools-dev python3.12-dev \
  python3.12-venv bison flex libreadline-dev perl zlib1g-dev \
  uuid-dev nodejs npm
$ npm i -g corepack
$ corepack enable && corepack prepare yarn@stable --activate
```

On macOS, these can be installed by running:

```bash
$ brew install rustup autoconf libtool python@3.12 readline zlib nodejs icu4c
```

To build Postgres on macOS, you’ll need to set PKG_CONFIG_PATH so it can find the icu4c libraries. This can be done manually each time you rebuild Postgres, or set in your .profile or virtual environment.

```bash
$ export PKG_CONFIG_PATH="$(brew --prefix icu4c)/lib/pkgconfig"
```

A Nix shell with all dependencies and a Python virtual environment can be built with the following shell.nix file.

```default
with import <nixpkgs> {};
pkgs.mkShell {
    name = "gel dev shell";
    venvDir = "./venv";

    buildInputs = with pkgs; [
        python312Packages.python
        python312Packages.venvShellHook
        rustup
        autoconf
        automake
        bison
        flex
        perl
        zlib
        readline
        libuuid
        nodejs
        yarn
        openssl
        pkg-config
        icu
        protobuf
        protobufc
    ];
    LD_LIBRARY_PATH = lib.makeLibraryPath [ pkgs.stdenv.cc.cc ];
    LIBCLANG_PATH = "${llvmPackages.libclang.lib}/lib";

    # If you are using NixOS:
    # Postgres configure script uses /bin/pwd,
    # which does not exist on NixOS.
    #
    # I had a workaround for replacing /bin/pwd with pwd,
    # but it was annoying that postgres/ was dirty.
    # So my fix now is:
    # $ sudo sh -c "echo 'pwd' > /bin/pwd"
    # $ sudo chmod +x /bin/pwd
}
```

The easiest way to set up a development environment is to create a Python “venv” with all dependencies and commands installed into it.

The new virtual environment is now ready for development and can be activated at any time.

## Running Tests

To run all Gel tests simply use the $ edb test command without arguments.

The command also supports running a few selected tests.  To run all tests in a test case file:

```bash
$ edb test tests/test_edgeql_calls.py

# or run two files:
$ edb test tests/test_edgeql_calls.py tests/test_edgeql_for.py
```

To pattern-match a test by its name:

```bash
$ edb test -k test_edgeql_calls_01

# or run all tests that contain "test_edgeql_calls":
$ edb test -k test_edgeql_calls
```

See $ edb test --help for more options.

## Dev Server

Use the $ edb server command to start the development server.

You can then use another terminal to open a REPL to the server using the gel command, or connect to it using one of the language bindings.

## Test Branches

Use the $ edb inittestdb command to create and populate branches that are used by unit tests.

