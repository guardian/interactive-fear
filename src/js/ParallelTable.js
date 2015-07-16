function ParallelTable(data,options) {

	console.log("ParallelTable",data)

	var dataByIndicator={};

	options.indicators.forEach(function(indicator){
		dataByIndicator[indicator]=[];
	});
	console.log(dataByIndicator)
	function updateData() {

		data.forEach(function(d){

			d3.keys(d).filter(function(i){return i!='country'}).map(function(indicator){
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

	}

	updateData();

	console.log(dataByIndicator)

	var WIDTH=1000,
		HEIGHT=500;

	var table=d3.select(options.container)
					.append("div")
					.attr("class","parallel-table")


	var column=table.selectAll("div.column")
			.data(d3.entries(dataByIndicator))
			.enter()
			.append("div")
				.attr("class","column");

	var headers=column
					.append("div")
						.attr("class","header")
						.text(function(d){
							return d.key;
						})

	var cell=column.selectAll("div.cell")
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
					

	function highlightCountry(country) {
		//console.log(country)
		cell
			.classed("opaque",false)
			.classed("highlight",false)

		if(!country) {
			return;
		}
		cell
				.filter(function(d){
					return d.country != country
				})
				.classed("opaque",true)
		cell
				.filter(function(d){
					return d.country == country
				})
				.classed("highlight",true)
	}

	cell.append("span")
			.attr("class","country")
			.text(function(d){
				return options.codes[d.country]["alpha-3"];
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
				return ((d.value/0.79)*100)+"%";
			})
			.style("left",function(d){
				return ((100-(d.value/0.79)*100)/2)+"%";
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
}

module.exports = ParallelTable;