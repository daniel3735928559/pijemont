from flask import Flask, request
import json
app = Flask(__name__, static_url_path='/static')

api = {
    # "targets":{
    #     "type":"oneof","values":{
    #         "n":{
    #             "type":"num",
    #             "description":"number of things"
    #         },
            
    #         "target_set":{
    #             "type":"list",
    #             "description":"number of things",
    #             "values":{
    #                 "type":"string",
    #                 "description":"a text"
    #             }
    #         }
    #     }
    # },

    # "blah":{"type":"dict",
    #         "description":"blah",
    #         "values":{"thing1":{"type":"list",
    #                             "values":{"type":"string"}},
    #                   "thing2":{"type":"num"}}},

    # "debrief":{"type":"multiline",
    #            "description":"Text to display when things happen"},

    "names":{
        "type":"list",
        "description":"Names",
        "values":{
            "type":"list",
            "description":"asda",
            "values":{
                "type":"string",
                "description":"I'm a string",
                "values":["Alice","Bob"]
            }
        }
    },

    
    "names":{
        "type":"list",
        "description":"Names",
        "values":{
            "type":"list",
            "description":"asda",
            "values":{
                "type":"string",
                "description":"I'm a string",
                "values":["Alice","Bob"]
            }
        }
    },

    "algorithms":{
        "type":"list",
        "description":"A list of algorithms",
        "values":{"type":"string",
                  "values":["Alg A","Alg B","Alg C","Algae"]}
    },

    "alg_attrs":{
        "type":"attrs","values":{"path":"the_form-algorithms",
                                 "values":{"proportion":{"type":"num", "description":"This is a proportion."}}}
    }
}

@app.route('/doc')
def doc():
    return json.dumps(api)

@app.route('/submit', methods=["POST"])
def submit():
    print(json.dumps(request.data))
    return "done"
    
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3797, debug=True)
