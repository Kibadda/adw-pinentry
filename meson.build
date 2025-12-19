project('adw-apps-monorepo',
          version: '0.1.0',
    meson_version: '>= 0.62.0',
  default_options: [ 'warning_level=2', 'werror=false', ],
)

gnome = import('gnome')

# Global dependencies
gjs_dep = dependency('gjs-1.0', version: '>= 1.54.0')
gjs_console = gjs_dep.get_variable(pkgconfig: 'gjs_console')
tsc = find_program('tsc', required: true)

# Shared library compilation (empty for now)
subdir('lib')

# Applications to build
apps_to_build = ['pinentry']

foreach app_name : apps_to_build
  subdir('apps' / app_name)
endforeach

# Post-install tasks
gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: false,
  update_desktop_database: true,
)
