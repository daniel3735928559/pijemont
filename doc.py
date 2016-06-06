import json, sys, yaml

def print_docs_yaml(filename):
    with open(filename) as f:
        api = yaml.load(f.read())
    print(doc_gen(api))

# def print_docs(api_url):
#     api = json.loads(urllib2.urlopen(api_url).read())['api']
#     print(doc_gen(api))
    
def doc_gen(api):
    return "\n\n".join(["###`{func}({shortargs})`\n\n{desc}\n\n####Arguments:\n{longargs}".format(
        func=f,
        shortargs=", ".join(["" + k for k in api[f]['values']]),
        desc = api[f]['description'],
        longargs = "".join(["\n* `" + k + "` = " + args_gen(api[f]['values'][k],1) for k in api[f]['values']])
        )
        
        
        for f in api])

def args_gen(api, depth):
    indent = "   "*depth
    if(api["type"] == "list"):
        return "List, all of whose elements are as follows:  \n{indent}  * {elements}\n".format(indent=indent, elements=args_gen(api['values'], depth+2))
    elif(api["type"] == "dict"):
        return "Dictionary with the following keys:\n{keys}\n{indent}".format(
            indent=indent,
            keys="\n".join(["{indent}`{key}`:{value}  {desc}".format(indent=indent + "* ",
                                                                    key=k,
                                                                    value=args_gen(api['values'][k], depth+1),
                                                                    desc=("\n    "+indent+api['values'][k]['description'] if 'description' in api['values'][k] else ""))
                                                                    for k in api['values']]))
    elif(api["type"] == "str" and "values" in api and len(api['values'])>0):
        return "`"+" | ".join(["\"" + k + "\"" for k in api["values"]])+"`"
    if(api["type"] == "str" or api["type"] == "multiline"):
        return "`string`"
    elif(api["type"] == "num"):
        return "`num`"
    elif(api["type"] == "file"):
        return "`file`"
    elif(api["type"] == "oneof"):
        return " | ".join([args_gen(api['values'][k], depth+1) for k in api["values"]])
    else:
        return "`{type}`".format(type=api["type"])

#print_docs(sys.argv[1])
print_docs_yaml(sys.argv[1])
