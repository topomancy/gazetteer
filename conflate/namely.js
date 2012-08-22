/*
  run with: osmjs -m -l sparsetable -j namely.js OSMFILE
*/

var wanted_keys = [
    "natural",
    "place",
    "historic",
    "landuse",
    "man_made",
    "military",
    "tourism",
    "leisure",
    "boundary",
    "railway",
    "aeroway",
    "amenity",
    "building"
];

var alt_names = [];

function dump(values) {
    // clean per "text format" section of http://www.postgresql.org/docs/9.1/static/sql-copy.html
    for (var i = 0; i < values.length; i++) {
        values[i] = values[i].replace("\t", " ");
    }
    var str = values.join("\t");
    str = str.replace("\\","\\\\");
    str = str.replace("\n", "");
    str = str.replace("\r", "");
    print(str);
}

function beginTransaction() {
    print("BEGIN TRANSACTION;");
    print("COPY gazetteer (source, id, name, feature_class, feature_type, geom) FROM stdin;");
}

function endTransaction() {
    // A single line consisting of "\." ends a COPY FROM command
    print("\\.");
    // now dump all the stored alt_names
    print("COPY alt_names (source, id, lang, name) FROM stdin;");
    for (var i = 0; i < alt_names.length; i++) {
        // "O" for "OSM"
        var values = ["O"].concat(alt_names[i]);
        dump(output);
    }
    print("\\.");
    print("COMMIT;");
    // reset alt_names for the next transaction
    alt_names = [];
}

function processFeatureFunction(source_type) {
    var count = 0;

    return function() {
        var f_class, f_type, name, output, geom;

        // Get the English name. Copy the default name
        // to name:local since we have no way of knowing
        // its language code.
        if (this.tags["name:en"]) {
            this.tags["name:local"] = this.tags["name"];
            name = this.tags["name:en"]
        } else {
            name = this.tags["name"];
            if (!name) name = this.tags["place_name"];
        }
        if (!name) return;

        // feature_class is just the OSM key
        // and feature_type the value of that key
        for (var i = 0; i < wanted_keys.length; i++) {
            if (this.tags[wanted_keys[i]]) {
                f_class = wanted_keys[i];
                f_type  = this.tags[wanted_keys[i]];
                break;
            }
        }
        if (!f_class || !f_type) return;

        geom = this.geom.toWKT();
        // source type is either "node" or "area"
        id = source_type + "/" + this.id;

        // source "O" means OSM
        // substr(..., 0, 255) so we don't overflow the varchar columns
        output = ["O", id, substr(name, 0, 255), f_class, substr(f_type, 0, 255), geom];
        dump(output);

        // extract all the altername names
        for (var key in this.tags) {
            if (key.substr(0, 5) == "name:") {
                var lang = key.substr(5);
                // substr(..., 0, 255) so we don't overflow the varchar columns
                alt_names.push([id, lang, substr(this.tags[key], 0, 255)]);
            }
        }

        // commit the transaction every 10000 rows
        if (++count % 10000 == 0) {
            endTransaction();
            beginTransaction();
        }
    }
}

Osmium.Callbacks.init = beginTransaction;
Osmium.Callbacks.node = processFeatureFunction("node");
Osmium.Callbacks.area = processFeatureFunction("area");
Osmium.Callbacks.end = endTransaction;
