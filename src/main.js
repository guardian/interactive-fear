var d3=require('d3');
var base=require('./html/base.html');
var ParallelTable=require('./js/ParallelTable');

var el = window.gv_el || document.querySelector('.interactive');
//d3.select(el).html(base); //d3 way.....
el.innerHTML=base;

var region_codes={
	"002":"africa",
	"019":"americas",
	"142":"asia",
	"150":"europe",
	"009":"oceania"
}
d3.json("data/iso.json",function(iso){
	var codes={};
	//console.log(iso)
	
	d3.csv("data/data.csv",function(d){
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

		var v=d3.values(obj).filter(function(d){
			return typeof d != "string"
		});
		//console.log(v)
		obj.mean=d3.mean(v);
		return obj;

	},function(data){
		//console.log(data)

		

		new ParallelTable(data,{
			container:"#fears",
			indicators:["mean","climate","economy","isis","iran","cyber","russia","china"],
			codes:codes,
			region_codes:region_codes
		})

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