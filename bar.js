var width = 1000, height = 450, padding = 20;
var fontFamily = 'verdana';
var barFillColor = 'steelblue';
var barFocusColor = 'yellow';
var strokeColor = '#F00226';
var noOfBins = 32;
var xAxisPadding = 1;
var toolTipBackground = '#FFF';
var binVariables = [ 0, 1, 2 ], chartIndex = 0;
var pieTextAlign = 'middle', pieWidth = 500, pieHeight = 500, pieRadius = 250;
var pieData = [], forceData = [];
var pieDataColor = '#FFF';
var xAxisType;
var names = [], heights = [], weights = [], HRs = [];
var decreaseBins = false;
var extraCredit = false, pX, nX, drawn = false;
function makeBarChart() {
	d3.select('#bartooltip').remove();
	d3.select('#mainchart').remove();
	d3.select('#piechart').remove();
	d3.select('#forcechart').remove();
	document.getElementById('legend').style.display = 'none';
	document.getElementById('legend').innerHTML = '';
	d3.csv('baseball_data.csv', function(data) {
		var docData = data.map(function(i) {
			names.push(i.name);
			heights.push(i.height);
			weights.push(i.weight);
			HRs.push(i.HR);
			var chartType = chartIndex % binVariables.length;
			if (chartType == 0) {
				if (decreaseBins)
					noOfBins = 24;
				else
					noOfBins = 32;
				xAxisType = 'Heights of the Base ball players';
				return parseInt(i.height);
			} else if (chartType == 1) {
				if (decreaseBins)
					noOfBins = 30;
				else
					noOfBins = 42;
				xAxisType = 'Weights of the Base ball players';
				return parseInt(i.weight);
			} else if (chartType == 2) {
				if (decreaseBins)
					noOfBins = 20;
				else
					noOfBins = 35;
				xAxisType = 'Heart rates of the Base ball players';
				return parseInt(i.HR);
			} else {
				noOfBins = 32;
				return parseInt(i.avg);
			}
		})

		var histogram = d3.layout.histogram().bins(noOfBins)(docData);
		pieData = [];
		forceData = [];
		var min = d3.min(histogram.map(function(i) {
			pieData.push(i.y);
			return d3.min(i);
		}));
		var max = d3.max(histogram.map(function(i) {
			return d3.max(i);
		}));
		forceData = pieData;
		var barColors = d3.scale.linear().domain(
				[ 0, 0.25 * pieData.length, 0.5 * pieData.length,
						0.75 * pieData.length, pieData.length ]).range(
				[ '#F4D03E', '#4FBA6F', '#EF4836', '#52B3D9', '#FCBC0B' ]);

		var y = d3.scale.linear().domain(
				[ 0, 20 + d3.max(histogram.map(function(i) {
					return i.length;
				})) ]).range([ 0, height ]);

		var x = d3.scale.linear().domain([ min, max + xAxisPadding ]).range(
				[ 0, width ]);

		var xAxis = d3.svg.axis().scale(x).orient('bottom');
		var svg = d3.select('#chart').append('svg').attr('id', 'mainchart')
				.attr('height', height + padding).attr('width', width);

		pX = d3.select('#chart').attr('x');
		pX = 0;
		drawn = true;
		$("#chart").mousemove(function(e) {
			if (!extraCredit)
				return;
			if(!drawn)
				return;
			nX = e.pageX;
			if (nX - pX > 500) {
				decreaseBins = !decreaseBins;
				bartooltip.html('');
				d3.select('#bartooltip').remove();
				d3.select('#mainchart').remove();
				d3.select('#chart').on('clik', null);
				drawn = false;
				makeBarChart();
			}
		}).mouseout(function(e) {
			nX = 0;
			pX = 0;
		})
		var container = svg.append('g').attr('transform', 'translate(50,0)');
		container.append('text').text('Number of people').attr("text-anchor",
				"middle").attr("transform",
				"translate(-40," + (height / 2) + ")rotate(-90)").style(
				'color', '#5090A0');

		d3.select('#chart').on('click', function() {
			chartIndex = chartIndex + 1;
			bartooltip.html('');
			d3.select('#bartooltip').remove();
			d3.select('#mainchart').remove();
			d3.select('#chart').on('clik', null);
			makeBarChart();
		});

		var group = container.append('g').attr('transform',
				'translate(0,' + height + ')').call(xAxis);
		group.selectAll('path').style('fill', 'none').style('stroke',
				strokeColor);
		group.selectAll('line').style('stroke', strokeColor);

		var units = container.selectAll('.bar').data(histogram).enter().append(
				'g');

		var tColor;

		var bartooltip = d3.select('#chart').append('div').style('position',
				'absolute');

		var tWidth, tHeight, tY;
		var isTransitionInProcess = 0;
		units.append('rect').attr('x', function(d) {
			return x(d.x);
		}).attr('y', height).attr('width', function(d) {
			return x(min + d.dx);
		}).attr('height', 0).attr('fill', function(d, i) {
			return barColors(i);
		}).on(
				'mouseover',
				function(d) {
					if (isTransitionInProcess == 0)
						return;
					tColor = this.style.fill;
					this.style.fill = 'hsl(120, 70%, 50%)';
					bartooltip.transition().style('opacity', .9).style(
							'font-family', fontFamily).style('color',
							'steelblue');
					bartooltip.html(d.y).style('left',
							(d3.event.pageX - 20) + 'px').style('top',
							(height - y(d.y) + 50) + 'px');
					tWidth = d3.select(this).attr('width');
					tHeight = d3.select(this).attr('height');
					tX = d3.select(this).attr('x');
					tY = d3.select(this).attr('y');
					d3.select(this).attr('x', function(d) {
						return x(d.x) - 10;
					});
					d3.select(this).attr('width', function(d) {
						return x(min + d.dx) + 10;
					})
					d3.select(this).attr('y', function(d) {
						return height - y(d.y) - 10;
					});
					d3.select(this).attr('height', function(d) {
						return y(d.y) + 10;
					});

				}).on('mouseout', function(d) {
			if (isTransitionInProcess == 0)
				return;
			this.style.fill = tColor;
			d3.select(this).attr('x', function(d) {
				return tX;
			});
			d3.select(this).attr('width', function(d) {
				return tWidth;
			})
			d3.select(this).attr('y', function(d) {
				return tY;
			});
			d3.select(this).attr('height', function(d) {
				return tHeight;
			});
			bartooltip.html('');
			d3.select('#bartooltip').remove();
		}).transition().each('end', function() {
			isTransitionInProcess = 1;
		}).duration(1000).delay(300).ease('elastic').attr('height',
				function(d) {
					return y(d.y);
				}).attr('y', function(d) {
			return height - y(d.y);
		});

		var vScale = d3.scale.linear().domain(
				[ 20 + d3.max(histogram.map(function(i) {
					return i.length;
				})), 0 ]).range([ 0, height ]);

		var vAxis = d3.svg.axis().scale(vScale).orient('left').ticks(10);

		var vGuide = d3.select('svg').append('g').attr('transform',
				'translate(50,0)').call(vAxis);

		vGuide.selectAll('path').style('fill', 'none').style('stroke',
				strokeColor);

		vGuide.selectAll('line').style('stroke', strokeColor);

		document.getElementById("xAxisText").innerHTML = xAxisType;
	});
}

function makePieChart() {
	names = [];
	heights = [];
	weights = [];
	HRs = [];
	d3.select('#mainchart').remove();
	d3.select('#piechart').remove();
	d3.select('#forcechart').remove();
	d3.select('#chart').on('click', null);
	document.getElementById('legend').style.display = 'none';
	document.getElementById('legend').innerHTML = '';
	var type = "";
	d3.csv('baseball_data.csv', function(data) {
		var docData = data.map(function(i) {
			names.push(i.name);
			heights.push(i.height);
			weights.push(i.weight);
			HRs.push(i.HR);
			var chartType = chartIndex % binVariables.length;
			if (chartType == 0) {
				noOfBins = 32;
				xAxisType = 'Heights of the Base ball players';
				type = "Height";
				return parseInt(i.height);
			} else if (chartType == 1) {
				noOfBins = 30;
				xAxisType = 'Weights of the Base ball players';
				type = "Weight";
				return parseInt(i.weight);
			} else if (chartType == 2) {
				noOfBins = 35;
				xAxisType = 'Heart rates of the Base ball players';
				type = "Heart Rate";
				return parseInt(i.HR);
			}
		})

		pieData = [];
		forceData = [];
		var histogram = d3.layout.histogram().bins(noOfBins)(docData);
		var min = d3.min(histogram.map(function(i) {
			pieData.push(i.y);
			return d3.min(i);
		}));
		var max = d3.max(histogram.map(function(i) {
			return d3.max(i);
		}));
		var legend = "";
		var newline = '<br>';
		var nodes = [], step = (max - min) / noOfBins, previous = min, next;
		legend += "Number of people (" + type + " Range)" + "<ul>";
		for (var i = 0; i < noOfBins; i++) {
			next = previous + step;
			legend += "<li>" + pieData[i] + " ("
					+ parseFloat(previous).toFixed(3) + " - "
					+ parseFloat(next).toFixed(3) + ")</li>";
			previous = next;
		}
		legend += "</ul>";

		document.getElementById('legend').style.display = 'block';
		document.getElementById('legend').innerHTML = legend;

		d3.select('#bartooltip').remove();
		d3.select('#mainchart').remove();

		var pieColors = d3.scale.ordinal().domain(
				[ 0, 0.25 * pieData.length, 0.5 * pieData.length,
						0.75 * pieData.length, pieData.length ]).range(
				[ '#F4D03E', '#4FBA6F', '#EF4836', '#52B3D9', '#FCBC0B',
						'#9DBFDC', '#F58033' ]);

		var arc = d3.svg.arc().outerRadius(pieRadius).innerRadius(0);

		var pieChart = d3.layout.pie().value(function(d) {
			return d;
		});

		d3.select('#chart').on('click', function() {
			chartIndex = chartIndex + 1;
			d3.select('#piechart').remove();
			makePieChart();
		});
		var svg = d3.select('#chart').append('svg').attr('id', 'piechart')
				.attr('width', pieWidth + 50).attr('height', pieHeight);

		var container = svg.append('g').attr(
				'transform',
				'translate(' + (pieWidth - pieRadius) + ', '
						+ (pieHeight - pieRadius) + ')');

		container.selectAll('path').data(pieChart(pieData)).enter().append('g')
				.attr('class', 'slice');

		d3.selectAll('g.slice').append('path').attr('d', 0).style('fill',
				function(d, i) {
					return pieColors(i);
				}).style('stroke', '#FFF').transition().duration(300)
				.delay(300).attr('d', arc).ease('bounce');

		d3.selectAll('g.slice').append('text').text(function(d, i) {
			return d.data;
		}).attr('transform', function(d) {
			return 'translate(' + arc.centroid(d) + ')';
		}).style('fill', pieDataColor).style('text-anchor', pieTextAlign)
				.style('font-family', fontFamily);

		document.getElementById("xAxisText").innerHTML = xAxisType;
	});
}

function makeForceChart() {
	var forceWidth = 950, forceHeight = 450;
	d3.select('#bartooltip').remove();
	d3.select('#mainchart').remove();
	d3.select('#piechart').remove();
	d3.select('#forcechart').remove();
	d3.select('#chart').on('click', null);
	document.getElementById('legend').style.display = 'none';
	document.getElementById('legend').innerHTML = '';
	var fData = [];
	var type, legend = "";
	var chartType = chartIndex % binVariables.length;
	if (chartType == 0) {
		xAxisType = 'Heights of the Base ball players';
		fData = heights;
		type = "Height";
	} else if (chartType == 1) {
		xAxisType = 'Weights of the Base ball players';
		fData = weights;
		type = "Weight";
	} else if (chartType == 2) {
		xAxisType = 'Heart rates of the Base ball players';
		fData = HRs;
		type = "Heart rate";
	}

	names = [];
	heights = [];
	weights = [];
	HRs = [];
	d3.csv('baseball_data.csv', function(data) {
		var docData = data.map(function(i) {
			names.push(i.name);
			heights.push(i.height);
			weights.push(i.weight);
			HRs.push(i.HR);
			var chartType = chartIndex % binVariables.length;
			if (chartType == 0) {
				noOfBins = 32;
				xAxisType = 'Heights of the Base ball players';
				return parseInt(i.height);
			} else if (chartType == 1) {
				noOfBins = 30;
				xAxisType = 'Weights of the Base ball players';
				return parseInt(i.weight);
			} else if (chartType == 2) {
				noOfBins = 35;
				xAxisType = 'Heart rates of the Base ball players';
				return parseInt(i.HR);
			}
		})

		pieData = [];
		forceData = [];
		var links = [];

		var histogram = d3.layout.histogram().bins(noOfBins)(docData);
		var min = d3.min(histogram.map(function(i) {
			forceData.push(i.y);
			return d3.min(i);
		}));

		var min = d3.min(histogram.map(function(i) {
			pieData.push(i.y);
			return d3.min(i);
		}));
		var max = d3.max(histogram.map(function(i) {
			return d3.max(i);
		}));

		var newline = '<br>';
		var nodes = [], step = (max - min) / noOfBins, previous = min, next;
		nodes.push({
			name : type,
			value : "Parent"
		});
		legend += "Number of people (" + type + " Range)" + "<ul>";
		for (var i = 0; i < noOfBins; i++) {
			console.log(histogram[i]);
			next = previous + step;
			nodes.push({
				name : forceData[i],
				value : forceData[i],
				target : [ 0 ]
			})
			legend += "<li>" + forceData[i] + " ("
					+ parseFloat(previous).toFixed(3) + " - "
					+ parseFloat(next).toFixed(3) + ")</li>";
			previous = next;
		}
		legend += "</ul>";

		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].target == undefined)
				continue;
			for (var j = 0; j < nodes[i].target.length; j++) {
				links.push({
					source : nodes[i],
					target : nodes[nodes[i].target[j]]
				})
			}
		}

		var forceLayout = d3.layout.force().nodes(nodes).links([])
				.linkStrength(0.3).friction(0.9).linkDistance(100).charge(-120)
				.gravity(0.1).theta(0.8).alpha(0.1).size(
						[ forceWidth, forceHeight ]);

		var container = d3.select('#chart').on('click', function() {
			chartIndex = chartIndex + 1;
			d3.select('#chart').on('click', null);
			d3.select('#forcechart').remove();
			makeForceChart();
		}).append('svg').attr('id', 'forcechart').attr('width', forceWidth)
				.attr('height', forceHeight);

		document.getElementById('legend').style.display = 'block';
		document.getElementById('legend').innerHTML = legend;

		var fillColor = d3.scale.category20();
		var node = container.selectAll('circle').on('click', null).data(nodes)
				.enter().append('g').call(forceLayout.drag);

		var link = container.selectAll('line').data(links).enter().append(
				'line').style('stroke', 'steelblue').style("stroke-width",
				function(d) {
					return Math.sqrt(Math.sqrt(d.source.value));
				});

		node.append('circle').attr('cx', function(d) {
			return d.x;
		}).attr('cy', function(d) {
			return d.y;
		}).attr('fill', function(d, i) {
			if (i == 0) {
				return '#FF0000';
			} else {
				return fillColor(d.value);
			}
		}).on('click', null).attr('r', 10);

		node.append('text').text(function(d, i) {
			return d.name;
		}).style('fill', function(d, i) {
			if (i == 0)
				return '#FF0000';
			else
				return '#800000';
		});

		forceLayout.on('tick', function() {
			node.attr('transform', function(d) {
				return 'translate(' + d.x + ', ' + d.y + ')';
			})
			link.attr("x1", function(d) {
				return d.source.x;
			}).attr("x2", function(d) {
				return d.target.x;
			}).attr("y1", function(d) {
				return d.source.y;
			}).attr("y2", function(d) {
				return d.target.y;
			});
		});
		forceLayout.start();
		document.getElementById("xAxisText").innerHTML = xAxisType;
	});
}

function doExtraCredit() {
	extraCredit = !extraCredit;
	document.getElementById("extraCreditButton").value = extraCredit ? "StopExtraCredit"
			: "ExtraCredit-Bins";
	if(extraCredit) {
		makeBarChart();
	}
}