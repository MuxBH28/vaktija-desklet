const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const ByteArray = imports.byteArray;

function VaktijaDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}

VaktijaDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function (metadata, desklet_id) {
        global.log("Initializing Vaktija desklet");
        Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);

        this.setupUI();
        this.fetchData();
    },

    setupUI: function () {
        global.log("Setting up UI");
        this.window = new St.Bin();
        this.text = new St.Label({ style_class: 'label' });
        this.text.set_text("Fetching data...");

        this.window.add_actor(this.text);
        this.setContent(this.window);
    },

    fetchData: function () {
        global.log("Fetching data from API");

        let url = "https://api.vaktija.ba/";

        let file = Gio.File.new_for_uri(url);
        file.load_contents_async(null, (obj, result) => {
            try {
                let [success, contents] = obj.load_contents_finish(result);
                if (!success) {
                    global.log("Error fetching data");
                    this.text.set_text("Error fetching data");
                    return;
                }

                let data = ByteArray.toString(contents);
                let json = JSON.parse(data);
                global.log("Data fetched: " + JSON.stringify(json));

                let displayText = `
Lokacija: ${json.lokacija}\n
Datum: ${json.datum[1]}\n
Vaktovi:\n
 - Sabah: ${json.vakat[0]}\n
 - Izlazak: ${json.vakat[1]}\n
 - Podne: ${json.vakat[2]}\n
 - Ikindija: ${json.vakat[3]}\n
 - Akšam: ${json.vakat[4]}\n
 - Jacija: ${json.vakat[5]}
                `;
                this.text.set_text(displayText);
            } catch (e) {
                global.log("Error fetching data: " + e.message);
                this.text.set_text("Error fetching data");
            }
        });
    }
};

function main(metadata, desklet_id) {
    global.log("Creating new desklet instance");
    return new VaktijaDesklet(metadata, desklet_id);
}
