import Adw from "gi://Adw";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=4.0";

import { Window } from "./ui/window.js";
import Gdk from "gi://Gdk?version=4.0";

export class Application extends Adw.Application {
    private window?: Window;
    private description: string = "A minimal GTK4 application with Adwaita styling.";
    private prompt: string = "";

    static {
        GObject.registerClass(this);
    }

    constructor(description?: string, prompt?: string) {
        super({
            application_id: "com.kibadda.AdwPinentry",
            flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
        });

        if (description) {
            this.description = description;
        }
        if (prompt) {
            this.prompt = prompt;
        }

        // Enable Ctrl + Q to quit application
        const quit_action = new Gio.SimpleAction({ name: "quit" });
        quit_action.connect("activate", () => {
            this.quit();
        });

        this.add_action(quit_action);
        this.set_accels_for_action("app.quit", ["<Control>q"]);

        Gio._promisify(Gtk.UriLauncher.prototype, "launch", "launch_finish");
    }

    public vfunc_activate(): void {
        if (!this.window) {
            this.window = new Window({ application: this, title: "Pinentry" }, this.description, this.prompt);
        }

        const provider = new Gtk.CssProvider();
        provider.load_from_resource(
            "/com/kibadda/AdwPinentry/styles/style.css",
        );

        const display = Gdk.Display.get_default();
        if (display)
            Gtk.StyleContext.add_provider_for_display(
                display,
                provider,
                Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION,
            );

        this.window.present();
    }
}

export function main(argv: string[]): Promise<number> {
    let description: string | undefined;
    let prompt: string | undefined;

    if (argv.length > 0) {
        let split = argv[0].split("|");
        description = split[0];
        prompt = split[1];
    }

    const app = new Application(description, prompt);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    return app.runAsync(argv);
}
