var Pijemont = function(container_form, api_dict, name, target){
    this.root = container_form;
    this.target = target;
    this.name = name;
    var self = this;
    
    this.root.onsubmit = function(e){
	console.log(self.root);
	var FD = new FormData(self.root);
	var XHR = new XMLHttpRequest();
	XHR.addEventListener("load", function(event) {
	    alert(event.target.responseText);
	});
	XHR.addEventListener("error", function(event) {
	    alert('Oops! Something went wrong.');
	});
	XHR.open("POST", self.target);
	XHR.send(FD);
	e.preventDefault();
    }
    
    var XHR = new XMLHttpRequest();
    XHR.addEventListener("load", function(event) {
	alert(event.target.responseText);
	self.append(self.root, JSON.parse(event.target.responseText), self.name);
	
    });
    XHR.addEventListener("error", function(event) {
	alert('Oops! Something went wrong.');
    });
    XHR.open("GET", api_dict);
    XHR.send();
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
	    var new_node = document.createElement("div");
	    var elt_name = prefix+'-'+name;
	    new_node.innerHTML = name+': <input name"'+elt_name+'" type="number" class="num_input" />';
	    return new_node;
	}
    },
    "string":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    var elt_name = prefix+'-'+name;
	    console.log(name);
	    if("values" in dict){
		new_node.innerHTML = name+': <select name="'+elt_name+'" class="text_select" />';
		for(var i = 0; i < dict.values.length; i++){
		    var opt = document.createElement("option");
		    opt.setAttribute("value",dict.values[i]);
		    opt.appendChild(document.createTextNode(dict.values[i]));
		    new_node.getElementsByClassName("text_select")[0].appendChild(opt);
		}
	    }
	    else{
		new_node.innerHTML = name+': <input name"'+elt_name+'" type="text" class="text_input" />';
	    }
	    return new_node;
	}
    },
    "list":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","list_element");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"list_inputs"},"");
	    var add_node = Pijemont.make_node("div",{"class":"list_add"},"+");
	    new_node.appendChild(Pijemont.make_node("",{},name+": "));
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
	}
    },
    "dict":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","dict_element");
	    var elt_name = prefix+'-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"dict_inputs"},"");
	    var add_node = Pijemont.make_node("div",{"class":"dict_add"},"+");
	    new_node.appendChild(inputs);
	    new_node.appendChild(add_node);
	    var append = function(){
		console.log("dclicked");
		var new_input = Pijemont.make_node("div",{"class":"dict_input"},"");
		var idx = inputs.childNodes.length+1+"";
		var new_name = elt_name+'-key-'+idx;
		new_input.appendChild(Pijemont.make_node("", {},"key-"+idx+": "));
		new_input.appendChild(Pijemont.make_node("input",{"name":new_name,"type":"text","class":"dict_key_input"},""));
		var d = {};
		d["value-"+idx] = dict.values;
		instance.append(new_input,d,elt_name);
		inputs.appendChild(new_input);
	    }

	    append();
	    add_node.onclick = append;
	    
	    return new_node;
	}
    },
    "oneof":{
	"create":function(name, dict, prefix, instance){
	    var new_node = document.createElement("div");
	    new_node.setAttribute("class","oneof_element");
	    var elt_name = prefix + '-'+name;
	    var inputs = Pijemont.make_node("div",{"class":"oneof_inputs"},"");
	    new_node.appendChild(inputs);
	    for(var v in dict.values){
		var new_input = Pijemont.make_node("div",{"class":"oneof_input"},"");
		var new_radio_button = Pijemont.make_node("input",{"type":"radio","name":elt_name,"value":v},"");
		var f = function(v,div){
		    new_radio_button.onclick = function(){
			console.log("VVVV",v);
			for(var n = inputs.firstChild; n; n = n.nextSibling){
			    n.style.backgroundColor="gray";
			}
			div.style.backgroundColor="white";
		    }
		}(v,new_input);
		new_input.appendChild(new_radio_button);
		var d = {};
		d[v] = dict.values[v];
		instance.append(new_input,d,elt_name);
		inputs.appendChild(new_input);
	    }
	    for(var n = inputs.firstChild; n; n = n.nextSibling){
		n.style.backgroundColor="gray";
	    }
	    inputs.firstChild.getElementsByTagName("input")[0].checked = true;
	    inputs.firstChild.style.backgroundColor="white";
	    return new_node;
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
