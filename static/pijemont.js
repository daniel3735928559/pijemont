var Pijemont = function(container_form, api_dict, name, target){
    this.root = container_form;
    this.target = target;
    this.name = name;
    var self = this;

    this.root.oninput = function(e){
	console.log("INPUT",e.target.getAttribute("id"));
    }
    
    this.root.onsubmit = function(e){
	console.log(self.root);
	e.preventDefault();
	console.log(self.api);
	if(!self.api){
	    return;
	}
	var data = self.process(self.api, self.name, self.process);
	console.log(data);
	alert(JSON.stringify(data));
	var XHR = new XMLHttpRequest();
	XHR.addEventListener("load", function(event) {
	    alert(event.target.responseText);
	});
	XHR.addEventListener("error", function(event) {
	    alert('Oops! Something went wrong.');
	});
	XHR.open("POST", self.target);
	XHR.send(JSON.stringify(data));
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

Pijemont.prototype.process = function(dict,prefix, process){
    var answer = {}
    console.log("D",JSON.stringify(dict));
    for(var name in dict){
	var p = prefix+'-'+name;
	console.log("PRE",p);
	var widget = Pijemont.widgets[dict[name].type];
	answer[name] = widget.process(dict[name], p, process);
	console.log("AA",JSON.stringify(answer));
    }
    return answer;
}

Pijemont.prototype.edit_callback = function(path, type){
    console.log("EDIT", path, type);
}

Pijemont.prototype.append = function(root, dict, prefix){
    for(var k in dict){
    	arg = dict[k];
	root.appendChild(Pijemont.widgets[arg.type].create(k, arg, prefix, this));
    }
}

Pijemont.widgets = {

    "num":{
	"create":function(name, dict, prefix, instance){
	    var new_node = Pijemont.make_node("div",{"class":"form-group terminal"},"");
	    var elt_name = prefix+'-'+name;
	    var new_label = Pijemont.make_node("label",{"for":elt_name},name+": ");
	    var new_input = Pijemont.make_node("input",{"id":elt_name,"name":elt_name,"type":"number","class":"form-control"},"");
	    new_node.appendChild(new_label);
	    new_node.appendChild(new_input);
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    return document.getElementById(prefix) ? document.getElementById(prefix).value : null;
	}
    },
    
    "multiline":{
	"create":function(name, dict, prefix, instance){
	    var new_node = Pijemont.make_node("div",{"class":"form-group terminal"},"");
	    var elt_name = prefix+'-'+name;
	    var new_label = Pijemont.make_node("label",{"for":elt_name},name+": ");
	    var new_input = Pijemont.make_node("textarea",{"id":elt_name,"name":elt_name,"class":"form-control form_answer"},"");
	    new_node.appendChild(new_label);
	    new_node.appendChild(new_input);
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    return document.getElementById(prefix) ? document.getElementById(prefix).value : null;
	}
    },
    
    "string":{
	"create":function(name, dict, prefix, instance){
	    var new_node = Pijemont.make_node("div",{"class":"form-group terminal"},"");
	    var elt_name = prefix+'-'+name;
	    console.log(name);
	    if("values" in dict){
		var new_label = Pijemont.make_node("label",{"for":elt_name},name+": ");
		var new_input = Pijemont.make_node("select",{"id":elt_name,"name":elt_name,"type":"text","class":"form-control"},"");
		new_node.appendChild(new_label);
		new_node.appendChild(new_input);
		new_node.innerHTML = '<label for="'+elt_name+'">'+name+': </label><select id="'+elt_name+'" name="'+elt_name+'" class="form-control" />';
		for(var i = 0; i < dict.values.length; i++){
		    var new_option = Pijemont.make_node("option",{"value":dict.values[i]},dict.values[i]);
		    new_input.appendChild(new_option);
		}
	    }
	    else{
		var new_label = Pijemont.make_node("label",{"for":elt_name},name+": ");
		var new_input = Pijemont.make_node("input",{"id":elt_name,"name":elt_name,"type":"text","class":"form-control"},"");
		new_node.appendChild(new_label);
		new_node.appendChild(new_input);
	    }
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    return document.getElementById(prefix) ? document.getElementById(prefix).value : null;
	}
    },
    
    "list":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","list_element nonterminal");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"list_inputs"},"");
	    var add_node = Pijemont.make_node ("div",{"class":"add"},"+");
	    new_node.appendChild(Pijemont.make_node("label",{},name+": "));
	    new_node.appendChild(inputs);
	    new_node.appendChild(add_node);
	    var append = function(){
		console.log("clicked");
		var idx = (inputs.childNodes.length+1)+"";
		var new_input = Pijemont.make_node("div",{"class":"list_input","id":elt_name+'-input-'+idx},"");
		var d = {};
		d[idx] = dict.values;
		instance.append(new_input,d,elt_name);
		inputs.appendChild(new_input);
		instance.edit_callback(elt_name,"list_append");
	    }
	    append();
	    add_node.onclick = append;
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    console.log("LL",dict,prefix, process);
	    var x = 1;
	    var answer = [];
	    console.log("E",document.getElementById(prefix+'-input-'+x));
	    while(document.getElementById(prefix+'-input-'+x)){
		var d = {}
		d[x] = dict.values;
		var to_push = process(d,prefix,process);
		for(var idx in to_push){
		    answer.push(to_push[idx]);
		}
		x++;
	    }
	    console.log("LLret",JSON.stringify(answer));
	    return answer
	}
    },
    
    "dict":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","dict_element nonterminal");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"dict_inputs"},"");
	    new_node.appendChild(Pijemont.make_node("label",{},name+": "));
	    new_node.appendChild(inputs);
	    console.log(dict);
	    instance.append(inputs,dict.values,elt_name);
	    
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    console.log("DD",dict, prefix);
	    return process(dict.values, prefix, process);
	}
    },

    "attrs":{
	"create":function(name, dict, prefix, instance){
	    instance.listeners = instance.listners || {};
	    var new_node = Pijemont.make_node("div",{"class":"dict_element nonterminal"},"");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"dict_inputs"},"");
	    new_node.appendChild(Pijemont.make_node("label",{},name+": "));
	    new_node.appendChild(inputs);
	    console.log(dict);
	    instance.append(inputs,dict.values,elt_name);
	    
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    console.log("DD",dict, prefix);
	    return process(dict.values, prefix, process);
	}
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
		new_input.appendChild(new_radio_button);
		new_input.appendChild(new_val);
		var f = function(v,div){
		    new_radio_button.onclick = function(){
			console.log("V",v);
			for(var n = inputs.firstChild; n; n = n.nextSibling){
			    n.style.backgroundColor="#ccc";
			    var l = n.getElementsByClassName("oneof_val")[0].getElementsByTagName("input");
			    for(var i = 0; i < l.length; i++) l[i].disabled=true;
			}
			div.style.backgroundColor="white";
			var l = div.getElementsByClassName("oneof_val")[0].getElementsByTagName("input");
			for(var i = 0; i < l.length; i++){ l[i].disabled=false;}
		    }
		}(v,new_input);
		var d = {};
		d[v] = dict.values[v];
		instance.append(new_val,d,elt_name);
		inputs.appendChild(new_input);
	    }
	    inputs.getElementsByTagName("input")[0].click();
	    return new_node;
	},
	"process":function(dict, prefix, process){
	    for(var v in dict.values)
		if(document.getElementById(prefix+'-oneof-'+v).checked){
		    var d = {};
		    d[v] = dict.values[v];
		    return process(d,prefix,process);
		}
	}
    }
    
};

Pijemont.make_node = function(name, attrs, value){
    if(name == "") return document.createTextNode(value);
    var node = document.createElement(name);
    for(var a in attrs) node.setAttribute(a,attrs[a]);
    node.innerHTML = value;
    return node;
}
