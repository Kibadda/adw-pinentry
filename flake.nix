{
  description = "ADW Apps Monorepo — GJS + Libadwaita Applications";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";

      pkgs = import nixpkgs {
        inherit system;
        overlays = [ overlay ];
      };

      # Common build inputs for all apps
      commonBuildInputs = with pkgs; [
        meson
        ninja
        pkg-config
        blueprint-compiler
        typescript
        desktop-file-utils
        wrapGAppsHook4
      ];

      commonDeps = with pkgs; [
        gjs
        libadwaita
      ];

      # Helper function to create an app derivation
      mkApp = { name, mainProgram ? name, version ? "0.1.0" }:
        pkgs.stdenv.mkDerivation {
          pname = "adw-${name}";
          inherit version;
          src = ./.;

          nativeBuildInputs = commonBuildInputs;
          buildInputs = commonDeps;

          meta.mainProgram = mainProgram;
        };

      overlay = final: prev: {
        kibadda = (prev.kibadda or { }) // {
          pinentry-adw-wrapped = mkApp {
            name = "pinentry";
            mainProgram = "pinentry-adw-wrapped";
          };

          # Future apps can be added here:
          # app2 = mkApp { name = "app2"; };
        };
      };
    in
    {
      packages.${system} = {
        pinentry = pkgs.kibadda.pinentry-adw-wrapped;
        # Future: app2 = pkgs.kibadda.app2;

        # Default package
        default = pkgs.kibadda.pinentry-adw-wrapped;
      };

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

        shellHook = ''
          echo "ADW Apps Monorepo Development Shell"
          echo "Available apps: pinentry"
          echo ""
          echo "Build commands:"
          echo "  meson setup _build"
          echo "  meson compile -C _build"
        '';
      };

      overlays.default = overlay;
    };
}