var d3=require('d3');
var base=require('./html/base.html');
var ParallelTable=require('./js/ParallelTable');

var el = window.gv_el || document.querySelector('.interactive');
//d3.select(el).html(base); //d3 way.....
el.innerHTML=base;

console.log("v. 0.4")

var region_codes={
	"002":"africa",
	"019":"americas",
	"142":"asia",
	"150":"europe",
	"009":"oceania"
}
var sub_region_codes={
	"021":"namerica",
	"005":"samerica",
	"013":"samerica"
}
var headers={
	"climate":"Global climate<br/>change",
	"economy":"Global economic<br/>instability",
	"isis":"<br/>ISIS",
	"iran":"Iran's<br/>nuclear program",
	"cyber":"<br/>Cyber-attacks",
	"russia":"Tensions<br/>with Russia",
	"china":"Territorial disputes<br/>with China"
}
d3.json("https://visuals.guim.co.uk/2015/jul/what-is-the-world-scared-of/data/iso.json",function(iso){
	var codes={};
	//console.log(iso)
	
	d3.csv("https://visuals.guim.co.uk/2015/jul/what-is-the-world-scared-of/data/data.csv",function(d){
		var obj={
			country:d.country,
		}
		codes[d.country]=iso.find(function(c){
			//console.log(c)
			return d.country == c.name || d.country==c.name2;
		});
		d3.entries(d).map(function(d){
			
			if(d.key!="country") {
				obj[d.key]=+d.value/100;
			}

		})
		/*
		var v=d3.values(obj).filter(function(d){
			return typeof d != "string"
		});
		//console.log(v)
		obj.mean=d3.mean(v);
		*/
		obj["head-climate"]=obj["climate"];
		obj["head-isis"]=obj["isis"];
		obj["head-cyber"]=obj["cyber"];
		obj["head-china"]=obj["china"];
		obj["head-economy"]=obj["economy"];
		obj["head-iran"]=obj["iran"];
		obj["head-russia"]=obj["russia"];
		
		return obj;

	},function(data){
		//console.log(data)


		var parallels=new ParallelTable(data,{
			container:"#fears",
			indicators:["head-climate","climate","head-economy","economy","head-isis","isis","head-iran","iran","head-cyber","cyber","head-russia","russia","head-china","china"],
			headers:headers,
			codes:codes,
			region_codes:region_codes,
			sub_region_codes:sub_region_codes
		})

		window.onresize=function(){
			parallels.update();
		}
	})

})

if (!Array.prototype.find) {
	Array.prototype.find = function(predicate) {
	    if (this == null) {
	      throw new TypeError('Array.prototype.find called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return value;
	      }
	    }
	    return undefined;
	};
}