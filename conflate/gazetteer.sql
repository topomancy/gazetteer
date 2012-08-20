drop table gazetteer;
create table gazetteer (
    url varchar(255) primary key,
    name varchar(255),
    fcode varchar(5),
    country char(2),
    admin1 char(2),
    lat float,
    lon float
);
