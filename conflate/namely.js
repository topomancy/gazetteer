/*
  run with: osmjs -2 -l sparsetable -j objects_2pass.js OSMFILE
*/

wanted_keys = [
    "railway",
    "aeroway",
    "man_made",
    "leisure",
    "amenity",
    "tourism",
    "historic",
    "landuse",
    "military",
    "natural",
    "boundary",
    "place"
];

/*
Osmium.Callbacks.init = function() {
    print('Start!');
}
*/

Osmium.Callbacks.node = function() {
  if(!this.tags["name"] && !this.tags["place_name"]) return;
  found_wanted_keys = false;
  for (var i = 0; i < wanted_keys.length; i++) {
    if (this.tags[wanted_keys[i]]) {
        found_wanted_keys = true;
        break;
    }
  }
  if (!found_wanted_keys) return;
  print(JSON.stringify({
    "geom": [this.geom.lon, this.geom.lat],
    "tags": this.tags, 
    "type":"node", 
    "id": this.id
    })
  )
}

Osmium.Callbacks.area = function() {
  if(!this.tags["name"] && !this.tags["place_name"]) return;
  found_wanted_keys = false;
  for (var i = 0; i < wanted_keys.length; i++) {
    if (this.tags[wanted_keys[i]]) {
        found_wanted_keys = true;
        break;
    }
  }
  if (!found_wanted_keys) return;
  print(JSON.stringify({
    "geom": this.geom.toWKT(),
    "tags": this.tags, 
    "type":"area", 
    "id": this.id
    })
  )
}

/*
Osmium.Callbacks.end = function() {
    print('End!');
}
*/

