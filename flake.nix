{
  description = "Adwaita Pinentry — GJS + Libadwaita";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      # ---- Buildable package ----
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        pname = "pinentry-adw-wrapped";
        version = "0.1.0";
        src = ./.;

        nativeBuildInputs = [
          pkgs.meson
          pkgs.ninja
          pkgs.pkg-config
          pkgs.blueprint-compiler
          pkgs.typescript
          pkgs.desktop-file-utils
          pkgs.wrapGAppsHook4
        ];

        buildInputs = [
          pkgs.gjs
          pkgs.libadwaita
        ];
      };

      # ---- Dev shell ----
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.git
          pkgs.pkg-config
          pkgs.gobject-introspection
          pkgs.gtk4
          pkgs.libadwaita
          pkgs.meson
          pkgs.ninja
          pkgs.gjs
          pkgs.typescript
          pkgs.desktop-file-utils
          pkgs.librsvg
          pkgs.blueprint-compiler
        ];
      };
    };
}