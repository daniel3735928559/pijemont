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
    print(json.dumps(request.data))
    return "done"
    
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3797)
