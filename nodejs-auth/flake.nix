{
  description = "A Nix-flake-based Node.js development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/master";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
      edgedb-dev = pkgs.edgedb.overrideAttrs (oldAttrs: rec {
        version = "4.0.0-alpha.1+ddfbe70";
        src = pkgs.fetchFromGitHub {
          owner = "edgedb";
          repo = "edgedb-cli";
          rev = "243f510575f7d3fce8d1964c964dd5fdbf510299";
          sha256 = "sha256-1G7Ci7iI8IbgWRUDPBhW9hVDR6l/VbrLJEkKzyQpIkw=";
          fetchSubmodules = true;
        };
        cargoDeps = pkgs.rustPlatform.importCargoLock {
          lockFile = src + "/Cargo.lock";
          outputHashes = {
            "edgedb-derive-0.5.1" = "sha256-9NhfmtuZcDG+ouDeUKM8HpboJYU8rT8Own5M13PrDU8=";
            "edgeql-parser-0.1.0" = "sha256-c5xBuW47xXgy8VLR/P7DvVhLBd0rvI6P9w82IPPsTwo=";
            "rexpect-0.5.0" = "sha256-vstAL/fJWWx7WbmRxNItKpzvgGF3SvJDs5isq9ym/OA=";
            "rustyline-8.0.0" = "sha256-CrICwQbHPzS4QdVIEHxt2euX+g+0pFYe84NfMp1daEc=";
            "serde_str-1.0.0" = "sha256-CMBh5lxdQb2085y0jc/DrV6B8iiXvVO2aoZH/lFFjak=";
            "indexmap-2.0.0-pre" = "sha256-QMOmoUHE1F/sp+NeDpgRGqqacWLHWG02YgZc5vAdXZY=";
          };
        };
      });
    in {
      devShell = pkgs.mkShell {
        packages = [
          (pkgs.nodejs_20.override {enableNpm = false;})
          pkgs.nodePackages.npm
          edgedb-dev
          pkgs.httpie
        ];

        shellHook = ''
          echo "`${edgedb-dev}/bin/edgedb --version`"
          echo "npm `${pkgs.nodePackages.npm}/bin/npm --version`"
          echo "node `${pkgs.nodejs_20}/bin/node --version`"
        '';
      };
    });
}
