import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=4.0";
import Gio from "gi://Gio?version=2.0";

export class Window extends Adw.ApplicationWindow {
    private _toast_overlay!: Adw.ToastOverlay;
    private _description_label!: Gtk.Label;
    private _prompt_label!: Gtk.Label;

    static {
        GObject.registerClass(
            {
                Template:
                    "resource:///com/kibadda/AdwPinentry/blueprints/application-window.ui",
                InternalChildren: [
                    "toast-overlay",
                    "description-label",
                    "prompt-label",
                ],
            },
            this
        );

        // Window shortcuts
        Gtk.Widget.add_shortcut(
            new Gtk.Shortcut({
                action: new Gtk.NamedAction({ action_name: "window.close" }),
                trigger: Gtk.ShortcutTrigger.parse_string("<Control>w"),
            })
        );

        Gtk.Widget.add_shortcut(
            new Gtk.Shortcut({
                action: new Gtk.NamedAction({ action_name: "window.close" }),
                trigger: Gtk.ShortcutTrigger.parse_string("Escape"),
            })
        );
    }

    constructor(params?: Partial<Adw.ApplicationWindow.ConstructorProps>, description?: string, prompt?: string) {
        super(params);

        if (description) {
            this._description_label.set_text(description);
        }
        
        if (prompt) {
            this._prompt_label.set_text(prompt);
            this._prompt_label.set_visible(true);
        } else {
            this._prompt_label.set_visible(false);
        }

        this._setupMenuActions();
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
            version: "1.0.0",
            developer_name: "Ezra Weaver",
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
