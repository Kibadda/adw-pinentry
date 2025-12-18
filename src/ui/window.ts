import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=4.0";
import Gio from "gi://Gio?version=2.0";

export class Window extends Adw.ApplicationWindow {
    private _toast_overlay!: Adw.ToastOverlay;
    private _description_label!: Gtk.Label;
    private _prompt_label!: Gtk.Label;
    private _password_entry!: Gtk.Entry;

    static {
        GObject.registerClass({}, this);

        Gtk.Widget.add_shortcut(
            new Gtk.Shortcut({
                action: new Gtk.NamedAction({ action_name: "window.close" }),
                trigger: Gtk.ShortcutTrigger.parse_string("Escape"),
            })
        );
    }

    private _buildUI(): void {
        const menu = new Gio.Menu();
        const section = new Gio.Menu();
        section.append("About", "win.about");
        menu.append_section(null, section);

        this._description_label = new Gtk.Label({
            halign: Gtk.Align.START,
            label: "",
        });

        this._prompt_label = new Gtk.Label({
            halign: Gtk.Align.START,
            label: "",
        });

        this._password_entry = new Gtk.Entry({
            visibility: false,
            vexpand: true,
        });

        this._password_entry.connect("activate", () => {
            this._onPasswordSubmit();
        });

        const content_box = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            halign: Gtk.Align.START,
            valign: Gtk.Align.START,
            hexpand: true,
            margin_top: 20,
            margin_bottom: 20,
            margin_start: 20,
            margin_end: 20,
        });
        content_box.append(this._description_label);
        content_box.append(this._prompt_label);
        content_box.append(this._password_entry);

        const menu_button = new Gtk.MenuButton({
            icon_name: "open-menu-symbolic",
            tooltip_text: "Main Menu",
            menu_model: menu,
            primary: true,
        });

        const header_bar = new Adw.HeaderBar();
        header_bar.pack_start(menu_button);

        const toolbar_view = new Adw.ToolbarView();
        toolbar_view.add_top_bar(header_bar);
        toolbar_view.set_content(content_box);

        this._toast_overlay = new Adw.ToastOverlay();
        this._toast_overlay.set_child(toolbar_view);

        this.set_content(this._toast_overlay);
        this.set_default_size(300, 250);
    }

    constructor(params?: Partial<Adw.ApplicationWindow.ConstructorProps>, description?: string, prompt?: string) {
        super(params);

        this._buildUI();

        if (description) {
            this._description_label.set_text(description);
        }

        if (prompt) {
            this._prompt_label.set_text(prompt);
        }

        this._setupMenuActions();

        this._password_entry.grab_focus();
    }

    private _onPasswordSubmit(): void {
        const password = this._password_entry.get_text();
        print(password);
        this.close();
        const app = this.get_application();
        if (app) {
            app.quit();
        }
    }

    private _setupMenuActions(): void {
        const aboutAction = new Gio.SimpleAction({
            name: "about",
        });

        aboutAction.connect("activate", () => {
            this._showAbout();
        });

        this.add_action(aboutAction);
    }

    private _showAbout() {
        const aboutDialog = new Adw.AboutDialog({
            application_name: "Adwaita Pinentry",
            application_icon: "com.kibadda.AdwPinentry",
            version: "0.1.0",
            developer_name: "Michael Strobel",
            website: "https://github.com/kibadda/adw-pinentry",
            issue_url: "https://github.com/kibadda/adw-pinentry/issues",
        });

        aboutDialog.present(this);
    }

    private _showToast(message: string) {
        const toast = new Adw.Toast({
            title: message,
            timeout: 4,
        });
        this._toast_overlay.add_toast(toast);
    }
}
