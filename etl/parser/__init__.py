import hashlib, json, os, gzip

def tab_file(fname, cols):
    for line in file(fname).readlines():
        vals = line.strip().split("\t")
        yield dict(zip(cols, vals))

def _id(uri):
    return hashlib.md5(uri).hexdigest()[:16]

class Dump(object):
    def __init__(self, template):
        self.max_rows = 10000
        self.rows = 0
        self.content = ""
        self.template = template
        os.makedirs(os.path.dirname(template))

    def write(self, uri, place):
        self.content += json.dumps({"index": {"_id":_id(uri)}})
        self.content += "\n" + json.dumps(item) + "\n"
        self.rows += 1
        if self.rows % 10000 == 0: self.flush()

    def flush(self, final=0):
        fname = self.template % int(self.rows/self.max_rows)+final
        print >>sys.stderr, " ", fname
        out = gzip.open(fname, "wb")
        out.write(content)
        out.close()
        self.content = ""

    def close(self):
        self.flush(final=1)
