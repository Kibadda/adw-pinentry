# Maintainer: Michael Strobel <mstrobel97@gmail.com>
pkgname=adw-pinentry
pkgver=0.1.0
pkgrel=1
pkgdesc='GNOME Inspired LibAdwaita Pinentry Applet'
url="https://github.com/kibadda/adw-pinentry/"
arch=(any)
license=(GPL-3.0)
depends=(
  dconf
  gjs
  glib2
  gtk4
  hicolor-icon-theme
  libadwaita
)
makedepends=(
  git
  meson
  typescript
)
source=(
  "git+https://github.com/kibadda/${pkgname}"
)
b2sums=('SKIP')

build() {
  cd "${pkgname}-${pkgver}"
  arch-meson . build
  meson compile -C build
}

package() {
  cd "${pkgname}-${pkgver}"
  meson install -C build --destdir "$pkgdir"
}