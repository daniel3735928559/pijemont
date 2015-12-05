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
