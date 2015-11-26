from flask import Flask
import json
app = Flask(__name__, static_url_path='/static')

api = {
    "blah":{"type":"dict","group":"g0","description":"blah","values":
            {"type":"string"}},
    "n":{"type":"num","group":"g0","description":"number of things"},
    "debrief":{"type":"string","group":"g1","description":"Text to display when things happen"},
    "names":{
        "type":"list","group":"g1","description":"Names","values":{
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
