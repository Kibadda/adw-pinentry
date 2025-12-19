gnome = import('gnome')

# Find TypeScript files for this app only
app_src_dir = meson.current_source_dir()
c = run_command('bash', '-c', 'find @0@ -name "*.ts" | sort'.format(app_src_dir), check: true)
sources = files(c.stdout().strip().split('\n'))

# App-specific TypeScript output directory
app_tsc_out = meson.project_build_root() / 'tsc-out' / app_name

# TypeScript compilation target
typescript = custom_target(
  'typescript-compile-@0@'.format(app_name),
  input: sources,
  build_by_default: true,
  build_always_stale: true,
  command: [ tsc, '--outDir', app_tsc_out ],
  output: ['tsc-output-@0@'.format(app_name)],
)

src_res = gnome.compile_resources(
  'com.kibadda.AdwPinentry.src',
  'com.kibadda.AdwPinentry.src.gresource.xml',
  dependencies: typescript,
  source_dir: app_tsc_out,
  gresource_bundle: true,
  install: true,
  install_dir: app_pkgdatadir,
)

bin_conf = configuration_data()
bin_conf.set('GJS', gjs_console)
bin_conf.set('PACKAGE_VERSION', app_version)
bin_conf.set('PACKAGE_NAME', 'adw-' + app_name)
bin_conf.set('APP_ID', app_id)
bin_conf.set('prefix', get_option('prefix'))
bin_conf.set('libdir', join_paths(get_option('prefix'), get_option('libdir')))
bin_conf.set('bindir', join_paths(get_option('prefix'), get_option('bindir')))
bin_conf.set('datadir', join_paths(get_option('prefix'), get_option('datadir')))
bin_conf.set('resource_path', app_resource_path)

app_launcher = configure_file(
  input: 'com.kibadda.AdwPinentry.in',
  output: 'adw-pinentry',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)

# Configure pinentry protocol wrapper
pinentry_wrapper = configure_file(
  input: 'pinentry-adw.in',
  output: 'pinentry-adw-wrapped',
  configuration: bin_conf,
  install: true,
  install_dir: get_option('bindir')
)

run_target(
  'devel-@0@'.format(app_name),
  command: [gjs_console, '-m', app_launcher],
  depends: [src_res, data_res],
)