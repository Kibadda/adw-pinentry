gsettings_schema = 'com.kibadda.AdwPinentry.gschema.xml'

# Compile schemas for development
gnome.compile_schemas(depend_files: gsettings_schema)

# Install GSettings schema
install_data(gsettings_schema,
  install_dir: join_paths(get_option('datadir'), 'glib-2.0/schemas')
)

compile_schemas = find_program('glib-compile-schemas', required: false)
if compile_schemas.found()
  test('Validate schema file',
    compile_schemas,
    args: ['--strict', '--dry-run', meson.current_source_dir()]
  )
endif

desktop_conf = configuration_data()

desktop = configure_file(
  input: 'com.kibadda.AdwPinentry.desktop.in',
  output: 'com.kibadda.AdwPinentry.desktop',
  configuration: desktop_conf,
  install: true,
  install_dir: join_paths(get_option('datadir'), 'applications')
)

# Compile GResources (UI, icons, etc.)
data_res = gnome.compile_resources(
  'com.kibadda.AdwPinentry.data',
  'com.kibadda.AdwPinentry.data.gresource.xml',
  gresource_bundle: true,
  install: true,
  install_dir: app_pkgdatadir,
)

subdir('icons')