-------------------
Topomancy Gazetteer
-------------------
Release: 8 Oct 2012

1) Ensure that you have ElasticSearch running.

2) Edit `gazetteer_import.sh` to reflect your ElasticSearch installation.
   Sensible defaults are provided.

3) Run `gazetteer_import.sh`. The process takes about 45 minutes on our
   development server.

4) Try the following queries:

    curl -s http://localhost:9200/gazetteer/place/_search?q=name:New+York\&pretty=true

    curl -s -d @sample_query.json http://localhost:9200/gazetteer/place/_search?pretty=true


Please contact team@topomancy.com if you have any questions.
