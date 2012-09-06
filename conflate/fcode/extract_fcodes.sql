-- UPDATE gazetteer SET geom = SetSRID(geom, 4326) WHERE SRID(geom) <> 4326;
 
DROP TABLE fcode_joins;
CREATE TABLE fcode_joins
    AS SELECT o.feature_class, o.feature_type, g.feature_code
        FROM gazetteer o, gazetteer g
        WHERE o.geom && st_expand(g.geom, 0.1)
        AND o.name = g.name
        AND o.feature_type IS NOT NULL AND o.feature_type <> ''
        AND g.feature_code IS NOT NULL AND g.feature_type <> '';

DROP TABLE fcode_matches;
CREATE TABLE fcode_matches
    AS SELECT fcode_joins.feature_class, feature_type, count(*) AS freq, feature_code, name
        FROM fcode_joins, fcode
        WHERE feature_type IS NOT NULL AND feature_type <> ''
        AND feature_code IS NOT NULL AND feature_code <> ''
        AND code = feature_code
        GROUP BY fcode_joins.feature_class, feature_type, feature_code, name;

DROP TABLE fcode_map;
CREATE TABLE fcode_map
    AS SELECT feature_class, feature_type, freq, feature_code, name
        FROM (
            SELECT *, rank() OVER
                (PARTITION BY feature_class, feature_type ORDER BY freq ASC)
                FROM fcode_matches
                WHERE freq >= 10
        ) AS foo
        WHERE rank=1;

