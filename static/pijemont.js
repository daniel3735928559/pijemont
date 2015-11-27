var Pijemont = function(container_form, api_dict, name, target){
    this.root = container_form;
    this.target = target;
    this.name = name;
    var self = this;
    
    this.root.onsubmit = function(e){
	console.log(self.root);
	if(!self.api) return;
	var data = self.process(self.api, self.name);
	// var FD = new FormData(self.root);
	var XHR = new XMLHttpRequest();
	XHR.addEventListener("load", function(event) {
	    alert(event.target.responseText);
	});
	XHR.addEventListener("error", function(event) {
	    alert('Oops! Something went wrong.');
	});
	XHR.open("POST", self.target);
	XHR.send(JSON.stringify(data));
	e.preventDefault();
    }
    
    var XHR = new XMLHttpRequest();
    XHR.addEventListener("load", function(event) {
	alert(event.target.responseText);
	self.api = JSON.parse(event.target.responseText);
	self.append(self.root, self.api, self.name);
	
    });
    XHR.addEventListener("error", function(event) {
	alert('Oops! Something went wrong.');
    });
    XHR.open("GET", api_dict);
    XHR.send();
}

Pijemont.prototype.process = function(dict,prefix){
    for(var name in dict){
	var p = prefix+'-'+name;
	if(Pijemont.widgets[dict[name].type].terminal){
	    return this.root.getElementById(p).value;
	}
	else if(dict[name].type == "list"){
	    var x = 1;
	    var answer = []
	    while(this.root.getElementById(p+'-'+x)){
		answer.push(this.process(dict[name].values,p+'-'+x));
		x++;
	    }
	}
	else if(dict[name].type == "dict"){
	    var x = 1;
	    var answer ={}
	    while(this.root.getElementById(p+'-key-'+x)){
		answer[this.root.getElementById(p+'-key-'+x).value] = this.process(dict[name].values,p+'-value-'+x));
		x++;
	    }
	}
	else if(dict[name].type == "oneof"){
	    for(var v in dict[name].values){
		if(this.root.getElementById(p+'-oneof-'+v).checked)
		    return this.process(dict[name].values[v],p+'-'+v));
	    }
	}
    }
}

Pijemont.prototype.append = function(root, dict, prefix){
    for(var k in dict){
	arg = dict[k]
	root.appendChild(Pijemont.widgets[arg.type].create(k, arg, prefix, this));
    }
}

Pijemont.widgets = {

    "num":{
	"create":function(name, dict, prefix, instance){
	    var new_node = Pijemont.make_node("div",{"class":"form-group terminal"},"");
	    var elt_name = prefix+'-'+name;
	    new_node.innerHTML = '<label for="'+elt_name+'">'+name+': </label><input id="'+elt_name+'" name="'+elt_name+'" type="number" class="form-control" />';
	    return new_node;
	},
	"terminal":true
    },
    
    "multiline":{
	"create":function(name, dict, prefix, instance){
	    var new_node = Pijemont.make_node("div",{"class":"form-group terminal"},"");
	    var elt_name = prefix+'-'+name;
	    new_node.innerHTML = '<label for="'+elt_name+'">'+name+': </label><textarea id="'+elt_name+'" name="'+elt_name+'" type="number" class="form-control form_answer" />';
	    return new_node;
	},
	"terminal":true
    },
    
    "string":{
	"create":function(name, dict, prefix, instance){
	    var new_node = Pijemont.make_node("div",{"class":"form-group terminal"},"");
	    var elt_name = prefix+'-'+name;
	    console.log(name);
	    if("values" in dict){
		new_node.innerHTML = '<label for="'+elt_name+'">'+name+': </label><select id="'+elt_name+'" name="'+elt_name+'" class="form-control" />';
		for(var i = 0; i < dict.values.length; i++){
		    var opt = document.createElement("option");
		    opt.setAttribute("value",dict.values[i]);
		    opt.appendChild(document.createTextNode(dict.values[i]));
		    new_node.getElementsByTagName("select")[0].appendChild(opt);
		}
	    }
	    else{
		new_node.innerHTML = '<label for="'+elt_name+'">'+name+': </label><input id="'+elt_name+'" name="'+elt_name+'" class="form-control" type="text"/>';
	    }
	    return new_node;
	},
	"terminal":true
    },
    
    "list":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","list_element nonterminal");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"list_inputs"},"");
	    var add_node = Pijemont.make_node("div",{"class":"add"},"+");
	    new_node.appendChild(Pijemont.make_node("label",{},name+": "));
	    new_node.appendChild(inputs);
	    new_node.appendChild(add_node);
	    var append = function(){
		console.log("clicked");
		var new_input = Pijemont.make_node("div",{"class":"list_input"},"");
		var idx = (inputs.childNodes.length+1)+"";
		var d = {};
		d[idx] = dict.values;
		instance.append(new_input,d,elt_name);
		inputs.appendChild(new_input);
	    }
	    append();
	    add_node.onclick = append;
	    return new_node;
	},
	"terminal":false
    },
    
    "dict":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","dict_element nonterminal");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"dict_inputs"},"");
	    var add_node = Pijemont.make_node("div",{"class":"add"},"+");
	    new_node.appendChild(Pijemont.make_node("label",{},name+": "));
	    new_node.appendChild(inputs);
	    new_node.appendChild(add_node);
	    var append = function(){
		console.log("dclicked");
		var new_input = Pijemont.make_node("div",{"class":"dict_input"},"");
		var idx = inputs.childNodes.length+1+"";
		var new_name = elt_name+'-key-'+idx;
		var key_input = Pijemont.make_node("div",{"class":"key_input nonterminal"},"");
		key_input.appendChild(Pijemont.make_node("label", {"class":"dict_key_label","for":new_name},"key-"+idx+": "));
		key_input.appendChild(Pijemont.make_node("input",{"id":new_name,"name":new_name,"type":"text","class":"form-control"},""));
		var val_input = Pijemont.make_node("div",{"class":"val_input"},"");
		var d = {};
		d["value-"+idx] = dict.values;
		instance.append(val_input,d,elt_name);
		new_input.appendChild(key_input);
		new_input.appendChild(val_input);
		inputs.appendChild(new_input);
	    }

	    append();
	    add_node.onclick = append;
	    
	    return new_node;
	},
	"terminal":false
    },
    
    "oneof":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","oneof_element nonterminal");
	    var elt_name = prefix + '-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"oneof_inputs"},"");
	    new_node.appendChild(inputs);
	    for(var v in dict.values){
		var new_input = Pijemont.make_node("div",{"class":"oneof_input nonterminal"},"");
		var new_val = Pijemont.make_node("div",{"class":"oneof_val"},"");
		var new_radio_button = Pijemont.make_node("input",{"type":"radio","name":elt_name,"id":elt_name+'-oneof-'+v,"value":v},"");
		var f = function(v,div){
		    new_radio_button.onclick = function(){
			console.log("V",v);
			for(var n = inputs.firstChild; n; n = n.nextSibling){
			    n.style.backgroundColor="#ccc";
			}
			div.style.backgroundColor="white";
		    }
		}(v,new_input);
		new_input.appendChild(new_radio_button);
		new_input.appendChild(new_val);
		var d = {};
		d[v] = dict.values[v];
		instance.append(new_val,d,elt_name);
		inputs.appendChild(new_input);
	    }
	    for(var n = inputs.firstChild; n; n = n.nextSibling){
		n.style.backgroundColor="#ccc";
	    }
	    inputs.firstChild.getElementsByTagName("input")[0].checked = true;
	    inputs.firstChild.style.backgroundColor="white";
	    return new_node;
	},
	"terminal":false
    }
    
};

Pijemont.make_node = function(name, attrs, value){
    if(name == "") return document.createTextNode(value);
    var node = document.createElement(name);
    for(var a in attrs) node.setAttribute(a,attrs[a]);
    node.innerHTML = value;
    return node;
}
