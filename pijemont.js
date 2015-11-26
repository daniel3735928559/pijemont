var Pijemont = function(container_div, api_dict, name){
    this.root = container_div;
    this.append(this.root, api_dict, name);
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
	    new_node.innerHTML = name+': <div class="list_inputs"></div><div class="list_add">+</div>';
	    new_node.getElementsByClassName("list_add")[0].onclick = function(){
		console.log("clicked");
		var d = {};
		d[(new_node.getElementsByClassName("list_inputs")[0].childNodes.length+1)+""] = dict.values;
		instance.append(new_node.getElementsByClassName("list_inputs")[0],d,elt_name)
	    }
	    instance.append(new_node.getElementsByClassName("list_inputs")[0],{"1":dict.values},elt_name);
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
		var c = inputs.childNodes.length;
		var new_name = elt_name+'-key-'+(c+1);
		new_input.appendChild(Pijemont.make_node("", {},"key-"+(c+1)+": "));
		new_input.appendChild(Pijemont.make_node("input",{"name":new_name,"type":"text","class":"dict_key_input"},""));
		var d = {};
		d["value-"+(c+1)] = dict.values;
		instance.append(new_input,d,elt_name);
		inputs.appendChild(new_input);
	    }

	    append();
	    add_node.onclick = append;
	    
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
