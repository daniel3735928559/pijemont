import urllib2, json, sys

def print_docs(api_url):
    api = json.loads(urllib2.urlopen(api_url).read())
    print(doc_gen(api))
    
def doc_gen(api):
    return "\n\n".join([
        "`"+
        f +
        "(" +
        ", ".join([k + ":" + args_gen(api[f][k]) for k in api[f]]) +
        ")`" +
        "".join(["\n* `" + k + "` : " + api[f][k]["description"] for k in api[f] if "description" in api[f][k]])
        for f in api])

def args_gen(api):
    if(api["type"] == "list"):
        return "list["+args_gen(api['values'])+", ...]"
    elif(api["type"] == "dict"):
        return "dict{"+", ".join([args_gen(api['values'][k]) for k in api_values])+"}"
    elif(api["type"] == "string" and "values" in api):
        return "string(" + ", ".join(["\"" + k + "\"" for k in api["values"]]) + ")"
    if(api["type"] == "string" or api["type"] == "multiline"):
        return "string"
    elif(api["type"] == "num"):
        return "num"
    elif(api["type"] == "file"):
        return "file"
    elif(api["type"] == "oneof"):
        return " | ".join([args_gen(api['values'][k]) for k in api["values"]])

print_docs(sys.argv[1])
