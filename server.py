from flask import Flask
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
            {"type":"string"}},
    "debrief":{"type":"string","description":"Text to display when things happen"},
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
    for x in request.form:
        print(x, ":",request.form[x])

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3797)
