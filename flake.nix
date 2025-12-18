{
  description = "Adwaita Pinentry — GJS + Libadwaita";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs =
    { self, nixpkgs }:
    let
      overlay = final: prev: {
        kibadda = (prev.kibadda or { }) // {
          pinentry-adw-wrapped = final.pkgs.stdenv.mkDerivation {
            pname = "pinentry-adw-wrapped";
            version = "0.1.0";
            src = ./.;

            nativeBuildInputs = with final.pkgs; [
              meson
              ninja
              pkg-config
              blueprint-compiler
              typescript
              desktop-file-utils
              wrapGAppsHook4
            ];

            buildInputs = with final.pkgs; [
              gjs
              libadwaita
            ];
          };
        };
      };

      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ overlay ];
      };
    in
    {
      packages.${system}.default = pkgs.kibadda.pinentry-adw-wrapped;

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

      overlays.default = overlay;
    };
}