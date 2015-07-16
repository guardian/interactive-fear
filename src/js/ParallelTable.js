function ParallelTable(data,options) {

	//console.log("ParallelTable",data)

	var dataByIndicator={};
	var positions=[];

	options.indicators.forEach(function(indicator){
		dataByIndicator[indicator]=[];
	});
	//console.log(dataByIndicator)
	function updateData() {

		data.forEach(function(d){

			d3.keys(d).filter(function(i){return i!='country'}).map(function(indicator,i){
				dataByIndicator[indicator].push({
					country:d.country,
					value:d[indicator]
				})
			});

		})

		d3.values(dataByIndicator).forEach(function(indicators){
			indicators.sort(function(a,b){
				return b.value - a.value;
			})
		})

		data.forEach(function(d){
			////console.log(d)
			var inds=d3.entries(d).filter(function(i){
				return i.key!="country" && i.key.indexOf("head")<0
			}).map(function(c){
				return {
					country:d.country,
					value:c.value,
					indicator:c.key,
					position:dataByIndicator[c.key].map(function(b){return b.country;}).indexOf(d.country)
				}
			})
			positions.push({
				country:d.country,
				values:inds
			})
			////console.log(inds)
		})

	}

	updateData();

	//console.log("POSITIONS",positions)

	
	//console.log(dataByIndicator)

	
	var WIDTH=1000,
		HEIGHT=500;

	var table=d3.select(options.container)
					.append("div")
					.attr("class","parallel-table clearfix")

	var svg=table.append("div")
			.attr("class","connections")
			.append("svg");

	var column=table.selectAll("div.column")
			.data(options.indicators.map(function(d){
				//d3.entries(dataByIndicator)
				return {
					key:d,
					value:dataByIndicator[d]
				}
			}))
			.enter()
			.append("div")
				.attr("class","column")
				.attr("rel",function(d){
					return d.key;
				})
				.classed("country-names",function(d){
					return d.key.indexOf("head")>-1;
				})

	var headers=column
					.append("div")
						.attr("class","header")
						.filter(function(d){
							return d.key.indexOf("head")<0;
						})
						.html(function(d){
							return "<span>"+options.headers[d.key]+"</span>";
						})


	
	var country=column.filter(function(d){
					return d.key.indexOf("head")>-1;
				}).selectAll("div.cell")
				.data(function(d){
					return d.value;
				})
				.enter()
				.append("div")
					.attr("class","cell country")
					.on("mouseenter",function(d){
						d3.event.stopPropagation();
						highlightCountry(d.country);
					})
					.on("mouseleave",function(d){
						d3.event.stopPropagation();
						highlightCountry();
					})

	var cell=column.filter(function(d){
					return d.key.indexOf("head")<0;
				}).selectAll("div.cell")
				.data(function(d){
					return d.value;
				})
				.enter()
				.append("div")
					.attr("class","cell")
					.on("mouseenter",function(d){
						d3.event.stopPropagation();
						highlightCountry(d.country);
					})
					.on("mouseleave",function(d){
						d3.event.stopPropagation();
						highlightCountry();
					})
					

	function highlightCountry(c) {
		////console.log(country)
		table
			.classed("opaque",false)
		
		cell
			.classed("highlight",false)

		//country
		//	.classed("opaque",false)
		country
			.classed("highlight",false)

		connections.selectAll("line").classed("highlight",false)

		if(!c) {
			return;
		}
		/*cell
				.filter(function(d){
					return d.country != c
				})
				.classed("opaque",true)*/
		table
			.classed("opaque",true)
		
		cell
				.filter(function(d){
					return d.country == c
				})
				.classed("highlight",true)
		
		country
				.filter(function(d){
					return d.country == c
				})
				.classed("highlight",true)



		connections.selectAll("line")
			.filter(function(d){
				return d.country==c;
			}).classed("highlight",true)
	}

	country.append("span")
			.attr("class","country")
			.text(function(d){
				return d.country;//options.codes[d.country]["alpha-3"];
			})

	var value=cell.append("span")
			.attr("class","value")
			.html(function(d){
				return "&nbsp;";
			})
			
	value.append("div")
			.attr("class",function(d){
				if(options.sub_region_codes[options.codes[d.country]["sub-region-code"]]) {
					return "bar "+options.sub_region_codes[options.codes[d.country]["sub-region-code"]];
				}
				return "bar "+options.region_codes[options.codes[d.country]["region-code"]];
			})
			.style("width",function(d){
				return ((d.value/0.80)*100)+"%";
			})
			.style("left",function(d){
				return ((100-(d.value/0.80)*100)/2)+"%";
			})
	value
		.filter(function(d){
			return d.value;
		}).append("b")
			/*.style("right",function(d){
				return Math.min(70,(95 - (d.value/0.79)*95))+"%";
			})*/
			.text(function(d){
				return d3.format(",.2p")(d.value);
			})



	

	var connections=svg.selectAll("g.country")
			.data(positions)
			.enter()
			.append("g")
				.attr("class","country")
				.attr("rel",function(d){
					return d.country;
				})

	var size=table.select("div.column[rel=climate]").node().getBoundingClientRect();
	//console.log(size);
	var column_width=size.width;

	connections.selectAll("line")
				.data(function(d){
					var values=d.values.filter(function(c,i){
						return i<d.values.length-1;
					}).map(function(c,i){
						c.next_indicator=d.values[i+1]
						return c;
					});
					////console.log("VALUES",values)
					return values;
				})
				.enter()
					.append("line")
					/*
					.attr("x1",function(d,i){
						return 75+5*2 +((column_width+5*2)/2) + i*(column_width+5*2)+(column_width+5*2)*(d.value/0.8)/2;
						// + i*(column_width+5*2) + (column_width+5*2)*(d.value/0.8)/2;
					})
					.attr("y1",function(d,i){
						return 45+(15/2) + d.position*15;
					})
					.attr("x2",function(d,i){
						return 75+5*2 +((column_width+5*2)/2) + (i*(column_width+5*2)) + column_width+5*2 - + (column_width+5*2)*(d.next_indicator.value/0.8)/2;	
					})
					.attr("y2",function(d,i){
						return 45+(15/2) + d.next_indicator.position*15;
					})
					*/
	update();
	this.update=function() {
		update();
	}
	function update() {
		size=table.select("div.column[rel=climate]").node().getBoundingClientRect();
		//console.log(size);
		column_width=size.width;

		connections.selectAll("line")
					.attr("x1",function(d,i){
						return 75+5*2 +((column_width+5*2)/2) + i*(column_width+5*2)+(column_width+5*2)*(d.value/0.8)/2;
						// + i*(column_width+5*2) + (column_width+5*2)*(d.value/0.8)/2;
					})
					.attr("y1",function(d,i){
						return 65+(15/2) + d.position*15;
					})
					.attr("x2",function(d,i){
						return 75+5*2 +((column_width+5*2)/2) + (i*(column_width+5*2)) + column_width+5*2 - + (column_width+5*2)*(d.next_indicator.value/0.8)/2;	
					})
					.attr("y2",function(d,i){
						return 65+(15/2) + d.next_indicator.position*15;
					})
	}
}

module.exports = ParallelTable;