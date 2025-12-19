# Project

This is a monorepo containing multiple GTK4 applications built with GJS, Adwaita, and TypeScript. It is packaged with Nix (flake.nix).

## Applications

Currently available applications:
- **pinentry** - A pinentry program for GPG

## Running Applications

Each application can be run individually using:
```bash
nix run .#<application-name>
```

For example:
```bash
nix run .#pinentry
```

## Project Structure

```
adw-pinentry/
├── apps/              # Individual applications
│   └── pinentry/      # Pinentry application
│       ├── src/       # TypeScript source files
│       ├── data/      # Icons, styles, desktop files, schemas
│       └── meson.build
├── lib/               # Shared TypeScript library (for future use)
├── gi-types/          # GObject Introspection type definitions
├── types/             # Custom TypeScript type definitions
├── meson.build        # Root build configuration
├── flake.nix          # Nix package configuration
└── tsconfig.json      # TypeScript configuration
```

## Adding New Applications

To add a new application:

1. Create a new directory under `apps/` with `src/` and `data/` subdirectories
2. Add a `meson.build` file in the app directory (use `apps/pinentry/meson.build` as template)
3. Update `meson.build` in the root to include the new app in `apps_to_build`
4. Add the app to `flake.nix` overlay and packages sections
5. Build and run: `nix run .#<new-app-name>`