from flask import Flask, request
import json
app = Flask(__name__, static_url_path='/static')

api = {
    "targets":{
        "type":"oneof","values":{
            "n":{
                "type":"num","description":"number of things"
            },
            "target_set":{
                "type":"list","description":"number of things","values":{
                    "type":"string","description":"a text"
                }
            }
        }
    },
    "blah":{"type":"dict","description":"blah","values":
            {"type":"list","values":{"type":"string"}}},
    "debrief":{"type":"multiline","description":"Text to display when things happen"},
    "names":{
        "type":"list","description":"Names","values":{
            "type":"list","description":"asda","values":{
                "type":"string","values":["Alice","Bob"]
            }
        }
    }
}

@app.route('/doc')
def doc():
    return json.dumps(api)

@app.route('/submit', methods=["POST"])
def submit():
    print(json.dumps(request.form))
    # answer = {}
    # for name in request.form:
    #     print(name, ":",request.form[name])
    #     path = name.split("-")
    #     info = api
    #     data = answer
    #     for(i,p in enumerate(path)):
    #         if(not p in data):
    #             if(i == len(path)-1):
    #                 data[p] = request.form[name]
    #             else:
    #                 t = get_basic_type(info[p]['type'])
    #                 if(not t is None):
    #                     data[p] = t
            
    #         info = info[p]
    # return "asd"

def get_basic_type(s):
    if(s == "dict"):
        return {}
    if(s == "list"):
        return []
    if(s == "multiline" or s == "string"):
        return ""
    if(s == "num"):
        return 0
    return None;

def process(d, formdata, prefix):
    for name in d:
        t = d[name]['type']
        p = prefix+'-'+name

def process_list(name,formdata):
    c = 1
    n = name+'-'+str(c)
    while(n in formdata):
        formdata[n]
        n = name+'-'+str(c)
        
        
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3797)
