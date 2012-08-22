/*
  run with: osmjs -2 -l sparsetable -j objects_2pass.js OSMFILE
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

function beginTransaction() {
    print("BEGIN TRANSACTION;");
    print("COPY gazetteer (source, id, name, feature_class, feature_type, geom) FROM stdin;");
}

function endTransaction() {
    print("\\.");
    print("COPY alt_names (source, id, lang, name) FROM stdin;");
    for (var i = 0; i < alt_names.length; i++) {
        var values = ["O"].concat(alt_names[i]);
        print(values.join("\t").replace("\\", "\\\\"));
    }
    print("\\.");
    print("COMMIT;");
    alt_names = [];
}

function processFeatureFunction(source_type) {
    var count = 0;

    return function() {
        var f_class, f_type, name, output, geom;

        name = this.tags["name"];
        if (!name) name = this.tags["place_name"];
        if (!name) return;

        for (var i = 0; i < wanted_keys.length; i++) {
            if (this.tags[wanted_keys[i]]) {
                f_class = wanted_keys[i];
                f_type  = this.tags[wanted_keys[i]];
                break;
            }
        }
        if (!f_class || !f_type) return;

        geom = this.geom.toWKT();
        id = source_type + "/" + this.id;

        output = ["O", id, name, f_class, f_type, geom];
        print(output.join("\t").replace("\\", "\\\\"));

        for (var key in this.tags) {
            if (key.substr(0, 5) == "name:") {
                var lang = key.substr(5);
                alt_names.push([id, lang, this.tags[key]);
            }
        }

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
