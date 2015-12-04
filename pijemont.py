import urllib2, json

class Pijemont():
    def __init__(self):
        self.callbacks = []

    def add_callback(self,f):
        self.callbacks.append(f)

    def process(self,form):
        ans = form
        for f in self.callbacks:
            ans = f(ans)
        return ans

    def print_docs(self, api_url):
        api = json.loads(urllib2.urlopen(api_url).read())
        print(self.doc_gen(api))

    def doc_gen(self, api):
        return "\n\n".join([
            "`"+
            f +
            "(" +
            ", ".join([k + ":" + self.args_gen(api[f][k]) for k in api[f]]) +
            ")`" +
            "".join(["\n* `" + k + "` : " + api[f][k]["description"] for k in api[f] if "description" in api[f][k]])
            for f in api])

    def args_gen(self, api):
        if(api["type"] == "list"):
            return "LIST["+self.args_gen(api['values'])+"]"
        elif(api["type"] == "dict"):
            return "DICT{"+", ".join([self.args_gen(api['values'][k]) for k in api_values])+"}"
        elif(api["type"] == "string" and "values" in api):
            return "STRING(" + ", ".join(["\"" + k + "\"" for k in api["values"]]) + ")"
        if(api["type"] == "string" or api["type"] == "multiline"):
           return "STRING"
        elif(api["type"] == "num"):
            return "NUM"
        elif(api["type"] == "file"):
            return "FILE"
        elif(api["type"] == "oneof"):
            return " | ".join([self.args_gen(api['values'][k]) for k in api["values"]])

p = Pijemont()
p.print_docs("http://localhost:3797/doc")
