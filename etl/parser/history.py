import gzip,json,hashlib,time
from core import Dump

f = gzip.open('/home/tim/projects/gaz/gazetteer-release-20121008/dump/000/gaz.01.gz', 'rb')
dump_path = '/home/tim/projects/gaz/gazetteer/etl/parser/history'
dump = Dump(dump_path + "/history/history.%04d.json.gz")


for line in f:
    index_json = line
    doc_id = json.loads(index_json)["index"]["_id"]
    
    doc_json = f.next()  #nextline
    doc = json.loads(doc_json)

    digest = hashlib.sha1(json.dumps(doc, sort_keys=True)).hexdigest()
    
    #1. SAVE REVISION
    dump.write_bulk("gazetteer-history", "revision", digest, doc)
    

    #2. SAVE HISTORY
    history_doc = {"index" : "gazetteer", "type": "place", "id" : doc_id, "revisions": [{"user_created":"ETL", "created_at":time.time(),"digest":digest}]}
    
    dump.write_bulk( "gazetteer-history", "place", doc_id, history_doc)

f.close()
dump.close()

#if __name__ == "__main__":
#    import sys
#    gz_file, dump_path = sys.argv[1:3]
#    generate_history(gz_file, dump_path)


#curl -s -XPOST http://localhost:9200/_bulk --data-binary @history1.0001.json
