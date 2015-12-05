## Pijemont

Pijemont is a system for generating an HTML form and markdown
documentation from a JSON dictionary specifying the desired arguments.

## Generating a form: Getting the API dict from a URL
```
<form enctype="multipart/form-data" id="demo" target="#"></form>
<script>
  var p = new Pijemont(document.getElementById("demo"), "/doc", "the_form", "/submit", "initExp");
</script>


## Generating a form: Providing the API dict directly



## Generating documentation

To generate Markdown documentation, simply run:

```
python2 doc.py http://url_of_api_dict
```