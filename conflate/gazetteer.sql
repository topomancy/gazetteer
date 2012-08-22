drop table gazetteer;
create table gazetteer (
    source char(1),
    id varchar(255),
    name varchar(255),
    feature_class varchar(255),
    feature_type varchar(255),
    country char(2),
    admin1 char(2),
    updated timestamp with time zone,
    geom geometry
);

drop table alt_names;
create table alt_names (
    source char(1),
    id varchar(255),
    lang varchar(32),
    name varchar(255)
);
