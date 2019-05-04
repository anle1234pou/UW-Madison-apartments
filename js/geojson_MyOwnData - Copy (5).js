/* Map of GeoJSON data from MegaCities.geojson */
// WARNING: 1. Do not use the 'select again' button. Data cannot be successfully retrieved after clicking this button, and 
// I have not yet found out where the bug is. Please triple click the image to reset selection.

// Declare global variables
var yrSelectedArr = new Array
var circle2
var markerG = new Array
var data2Yrs = new Array
var checkNotif
var gg5
var gg5_b

var gg10
var gg10_b

var selected_ress = []

//function to instantiate the Leaflet map
function createMap() {
    //create the map using the L.map method
    var map = L.map('map', {
    	center: [43.07, -89.403],
    	zoom: 15
	});
	
	L.control.scale({'position':'bottomright'}).addTo(map);

    //add OSM base tilelayer
    /*L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
	}).addTo(map);*/
	L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 19
	}).addTo(map)
	
	$('#det_window').hide()
	$('#price_window').hide()
	$('#res_window').hide()
	$('#lib_window').hide()
    //call getData function
	getData(map);
	
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties) {
        	popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

function calcR(attrValue) {
	// calculate
	return Math.sqrt((attrValue * 0.5)/Math.PI) * 0.8
}

function processData(data) {
	var attributes = new Array
	
	// get properties in geojson
	var properties = data.features[0].properties

	// from the properties dict get all items with keys having word 'gdp' and add it to 'attributes' list
	for (var attribute in properties) {
		if (attribute.includes('gdp')) {
			attributes.push(attribute)
		}
	}
	//return a list of key names as titles of gdp value
	return attributes
}

function pointToLayer(/*feature,*/latlng/*,attributes*/) {

	var options = {
		fillColor: "#ff7800",
		color: "#00aa00",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.6,
		radius: 2
	}

	// "Circle-Marker" layer is added as a leaflet layer
	var cmLayer = L.circleMarker(latlng,options)

	//createPopupCntnt(cmLayer, radius, proprts, attr)

	return cmLayer
}

function set_det_window() {
	$('#menu').hide()
	$('#det_window').show()
	$('.back_to_menu').off('click')
}
function createRepSymbols(data, map) {
	var gg1 = L.geoJson(data, {
		style: function(feature) {
			t = feature.properties.Type_of_housing
			var style1 = {"color": "#ddcc00", "fillColor": "#cccc00","opacity": 0.8,"weight": 1}
			var style2 = {"color": "#ff55ff", "fillColor": "#ff55ff","opacity": 0.8,"weight": 1}
			if (t == "House") {
				return style1
			} else {
				return style2
			}
		},
		onEachFeature(feature, layer) {
			createInfoPopup(map,feature, layer)
		}

	}).addTo(map)
	$('.back_to_menu').on({
		click: function() {
			//L.geoJson(data).removeFrom(map)
			console.log('BACKING1')

			gg1.clearLayers()
			$('#menu').show()
			$('#det_window').hide()
		}
	})
}

function bound_res_10(map,fid1,data10,data_res) {
	//var gg5 = L.geoJson(data5)
	console.log(map.hasLayer(gg10_b))
	if (map.hasLayer(gg10_b)) {
		console.log('HASSSS')
		map.removeLayer(gg10_b)
	}
	gg10_b = L.geoJson(data10, {
		filter: function(feature, layer) {
			if (parseInt(feature.id) === fid1) {
				var ress10 = feature.properties.reachable_restaurants
				all_ress_10(map, data_res, ress10)
			}
			return (parseInt(feature.id) === fid1)
		},
		onEachFeature: function(feature, layer) {
			/*map.close
			var toolTipContent = '<div><p>Number of restaurants reachable in 5 min: ' + feature.properties.reachable_restaurants + '<div>'
			layer.bindTooltip(toolTipContent).openTooltip()	*/
		}
	}).addTo(map)

	gg10_b.bringToBack()
}

function all_ress_10(map, data_res, ress10) {
	console.log('RESSSSSSSSSSSSSSSSS calledddddddddddd')
	if (map.hasLayer(gg10)) {
		map.removeLayer(gg10)
	}
	selected_ress = []

	$('#ress_info').remove()

	var count = 0

	gg10 = L.geoJson(data_res, {
		pointToLayer: function(feature,latlng) {
			var options = {
				radius: 5.5,
				fillColor: "#ffffff",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			return L.circleMarker(latlng, options)
		},
		filter: function(feature, layer) {
			if (ress10.includes(parseInt(feature.properties.FID))) {
				console.log('selected', parseInt(feature.properties.FID))
				selected_ress.push(feature)	
			}
			return (ress10.includes(parseInt(feature.properties.FID)))
		},
		onEachFeature(feature, layer) {
			layer.setStyle({color:'#000',weight:'3'})
			if ((feature.properties.rating_score) != '-') {
				var toolTipContent = '<div>' + feature.properties.rating_score + ', ' + feature.properties.price_range + '</div>'
			} else {
				var toolTipContent = '<div>' + 'N/A' + '</div>'
			}
			layer.bindTooltip(toolTipContent,{'permanent':true,'direction':'top','offset':new L.Point(0,-4)}).openTooltip()

			var popupContent = '<div><p>Name: ' + feature.properties.name + '</p><p>Price range: '
			+ feature.properties.price_range + '</p><p>Rating score: ' + feature.properties.rating_score 
			+ '</p><p>Tags: ' + feature.properties.tags + '</p></div>'
			
			layer.bindPopup(popupContent, {
				offset: new L.Point(0, -5),
				closeButton: false,
				opacity: 0.8
			})

			layer.on({
				mouseover: function() {
					this.openPopup()
					this.setStyle({color:'blue',fillColor:'red',weight: 3})
				},
				mouseout: function() {
					this.closePopup()
					this.setStyle({color: "#000",fillColor:'white',weight: 1})
				},
				click: function() {
					$('#ress_info').remove()
					var windowContent = "<div id='ress_info'><p><b>Name:</b> " + feature.properties.name + '</p><p><b>Address:</b> ' + feature.properties.address + '</p><p><b>Price range:</b> '
					+ feature.properties.price_range + '</p><p><b>Rating count:</b> ' + feature.properties.rating_count + '</p><p><b>Rating score:</b> ' + feature.properties.rating_score 
					+ '</p><p>Tags: ' + feature.properties.tags + '</p><p><b>URL:</b> ' + feature.properties.url + '</p><p><b>Opening hours: </b>' + feature.properties.opening_hours + '</div>'
					$('#res_window').append(windowContent)
				}
			})
		}

	}).addTo(map)
	
	//set_res_window.append()

	var panelContent = "<div id='ress_info'><p>Number of restaurants within 10-min walk distance: <b>" + ress10.length + '<b></p>'
	$('#res_window').append(panelContent)
	/*gg5.bindPopup(feature.properties.FID, {
		offset: new L.Point(0, -5)
	})*/
	/*$(layer).on({
		mouseover: function() {
			this.openPopup()
		}
	})*/

	resInfoPopup(selected_ress)
	gg10.bringToFront()
}
function resInfoPopup(selected_ress) {
	for (i = 0; i < selected_ress.length; i ++) {
		console.log("RES_DET_WINDOW+++++++++++",(selected_ress)[i])
	}

	console.log('ALL RESSSSS WITIN:=========',selected_ress)
}

function set_price_window() {
	$('#menu').hide()
	$('#price_window').show()
	$('.back_to_menu').off('click')
	$("input[type='radio']").off('click')
}
function set_res_window() {
	$('#menu').hide()
	$('#res_window').show()
	$('.back_to_menu').off('click')
	$("input[type='radio']").off('click')
}

function resSymbols(data, data5, data10, data_res, map) {
	var domain_all = []

	console.log('DATA2222222222222', data, data5, data10)
	var gg0 = L.geoJson(data)
	
	var gg5_b = L.geoJson(data5)

	var gg10_b = L.geoJson(data10)

	L.geoJson(data10, {
		onEachFeature(feature, layer) {
			res_count_10 = feature.properties.reachable_restaurants.length
			console.log('THIS_1010101010:', res_count_10)
			domain_all.push(res_count_10)
		}
	})

	console.log("DOMAINNNN", domain_all)
	var clusters = ss.ckmeans(domain_all, 6)
	var clusterBreaks = [0]
	console.log(clusters)

	// Get the largest value for each cluster as cluster breaks
	for (i = 0; i < clusters.length; i ++) {
		clusterBreaks.push(clusters[i][clusters[i].length - 1])
	}
	console.log('Class breaks', clusterBreaks)

	var styles = [{"color": "#000000", "fillColor": "#ffffb2","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fed976","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#feb24c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fd8d3c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#f03b20","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#bd0026","fillOpacity": '0.95',"weight": 1},
	]

	

	gg0 = L.geoJson(data, {
		/*style: function() {
			return ({"color": "#999999", "fillColor": "#cccccc","fillOpacity": 1,"weight": 1})
		},*/
		style: function(feature) {
			console.log(data10, feature.properties.FID)
			/*for (i = 0; i < 796; i ++) {
				if (data5.features[i].id == feature.properties.FID) {*/
			for (i = 0; i < 6; i ++) {
				var resCt = data10.features[feature.properties.FID].properties.reachable_restaurants.length
				if (resCt >= clusterBreaks[i] && resCt <= clusterBreaks[i + 1]) {
					return styles[i]
				}
			}
		},
		onEachFeature(feature, layer) {
			layer.on({
				mouseover: function() {
					layer.setStyle({color:"#5555cc",weight:3})
					
				},
				mouseout: function() {
					layer.setStyle({"color": "#000000", "weight": 1})
				},
				click: function() {
					console.log('BUILDING BOUND:',feature)
					bound_res_10(map,feature.properties.FID, data10, data_res)
					
					updateInfoWindow(feature)
					
				}
			})
		}
	}).addTo(map)

	// create basic a basic point layer containing all restaurants
	var gg_res = L.geoJson(data_res, {
		pointToLayer: function(feature,latlng) {
			var options = {
				radius: 6,
				fillColor: "#33ff33",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			return L.circleMarker(latlng, options)
		}
	}).addTo(map)
	
	$('.back_to_menu').on({
		click: function() {
			//console.log("BACK?",map.hasLayer(gg2))
			if (map.hasLayer(gg5_b)) {
				console.log('CLEARING')
				gg5_b.clearLayers()
			}
			if (map.hasLayer(gg0)) {
				console.log('CLEARING')
				gg0.clearLayers()
			}
			gg_res.clearLayers()
			$('#menu').show()
			$('#res_window').hide()
		}
	})
}

function priceSymbols(data, map) {
	var domainDA = []
	var domainL = []

	for (var i = 0; i < 796; i ++) {
		prop = data.features[i]['properties']
		console.log('prop',prop['Floorplans'])
		for (var keyFlp in prop['Floorplans']) {
			if (prop['Floorplans'][keyFlp]['Individual_Average']) {
				var val = parseFloat(prop['Floorplans'][keyFlp]['Individual_Average']['avg_price'])
				console.log(val)
				if (isNaN(val) === false) {
					var key = prop['Floorplans'][keyFlp]['Title']
					console.log("TITLE", key)
				
					console.log('AVERAGE PRICE:', val)
					var Dict = {}
					Dict[key] = val
					domainDA.push(Dict)
					domainL.push(val)
				}
			}
		}
	}
	console.log('length', domainDA, domainDA.length)
	for (i = 0; i < domainDA.length; i ++) {
		console.log('DOMAIN',JSON.stringify(domainDA[i]))
	}

	clusters = ss.ckmeans(domainL, 6)
	clusterBreaks = [0]
	console.log(clusters)

	// Get the largest value for each cluster as cluster breaks
	for (i = 0; i < clusters.length; i ++) {
		clusterBreaks.push(clusters[i][clusters[i].length - 1])
	}
	clusterBreaks.push(9999)
	console.log('Class breaks', clusterBreaks)

	// 4-CLASS YELLOW-BLUE
	/*var styles = [{"color": "#000000", "fillColor": "#ffffcc","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#a1dab4","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#41b6c4","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#225ea8","fillOpacity": '0.95',"weight": 0.5},
	]*/
	// 6-CLASS ORANGE
	/*var styles = [{"color": "#000000", "fillColor": "#ffffb2","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#fed976","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#feb24c","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#fd8d3c","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#f03b20","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#bd0026","fillOpacity": '0.95',"weight": 0.5},
	]*/

 // 4-CLASS ORANGE
	/*var styles = [{"color": "#000000", "fillColor": "#ffffb2","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#fecc5c","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#fd8d3c","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#e31a1c","fillOpacity": '0.95',"weight": 0.5},
	]*/

	// 6-CLASS GnBu
	/*var styles = [{"color": "#000000", "fillColor": "#f0f9e8","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#ccebc5","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#a8ddb5","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#7bccc4","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#43a2ca","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#0868ac","fillOpacity": '0.95',"weight": 1},
	]*/
	
	// 6-CLSSS YlRd
	var styles = [{"color": "#000000", "fillColor": "#ffffb2","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fed976","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#feb24c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fd8d3c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#f03b20","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#bd0026","fillOpacity": '0.95',"weight": 1},
	]
	/*
	var styles = [{"color": "#000000", "fillColor": "#ffffcc","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#c7e9b4","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#7fcdbb","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#41b6c4","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#2c7fb8","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#253494","fillOpacity": '0.95',"weight": 1},
	]*/

	var gg2 = L.geoJson(data)

	var noDataStyle = {"color": "#999999", "fillColor": "#cccccc","fillOpacity": 1,"weight": 1}
	$("input[type='radio']").click(function(){
		if (map.hasLayer(gg2)) {
			gg2.clearLayers()
		}
		var radioValue = $("input[name='bedrooms']:checked").val();
		console.log("Your are a - " + radioValue);
		gg2 = L.geoJson(data, {
			style: function(feature) {
				style1 = {}
				console.log('updating GG2', feature, feature['properties'], feature['properties']['Floorplans'])
				console.log('KEYS?',Object.keys(feature['properties']['Floorplans']))
				var keyL = Object.keys(feature['properties']['Floorplans'])
				console.log('KEY_LENGTH', keyL.length)
				for (i = 0; i < keyL.length; i ++) {
					var flpKey = keyL[i]
					console.log('from_KEYS',flpKey)
					console.log('GATE------',feature['properties']['Address'],feature['properties']['Floorplans'][flpKey]['Title'], radioValue)
					if (feature['properties']['Floorplans'][flpKey]['Title'] == radioValue && feature['properties']['Floorplans'][flpKey]['Individual_Average']) {
						avgPrice = parseFloat(feature['properties']['Floorplans'][flpKey]['Individual_Average']['avg_price'])
						console.log('AVG_PRICE', avgPrice)
						if (isNaN(avgPrice) === false) {
							console.log('Qualified')
							for (i = 0; i < clusterBreaks.length - 1; i ++) {
								console.log("COMPARING", parseFloat(avgPrice),clusterBreaks[i],typeof(clusterBreaks[i]),Object.values(clusterBreaks[i]))
								if (parseFloat(avgPrice) > clusterBreaks[i] && (parseFloat(avgPrice) < clusterBreaks[i + 1])) {
									console.log('SHOWing', styles[i],typeof(styles[i]))
									style1 = styles[i]
									return style1
								}
							}
						}
					}
				}
				return noDataStyle
			},
			onEachFeature(feature, layer) {
				stylePass = style1

				if (Object.keys(stylePass).length === 0) {
					stylePass = {"color": "#999999", "fillColor": "#cccccc","fillOpacity": 1,"weight": 1}
				}
				console.log('passssssss', style1, Object.values(stylePass)[0])
				createInfoPopup(feature, layer, stylePass, radioValue)

			}
		}).addTo(map)
	});

	/*var zoomLv = map.getZoom()
	console.log("ZOOM", zoomLv)
	if (zoomLv >= 17) {
		gg2.*/

	$('.back_to_menu').on({
		click: function() {
			//console.log("BACK?",map.hasLayer(gg2))
			if (map.hasLayer(gg2)) {
				console.log('CLEARING')
				gg2.clearLayers()
			}
			$('#menu').show()
			$('#price_window').hide()
		}
	})
}

function createInfoPopup(feature,layer,style,radioValue) {
	console.log('passed style', style)
	prt = feature.properties
	var addr = prt.Address
	var name = prt.Name
	var typeH = prt.Type_of_housing
	var url1 = prt.URL1
	var url2 = prt.URL2
	var flp = prt.Floorplans
	var det = prt.Detailed_type
	var simp = prt.Simplified_type
	var yrB = prt.Year_built
	var popupCntnt = '<p><b>Address:</b> ' + addr + '</p><p><b>Name:</b> ' + name

	layer.bindPopup(popupCntnt,{
		offset:new L.Point(0,-10)
	})
	
	/*var zoomLv = map.getZoom()
	console.log("ZOOM", zoomLv)
	if (zoomLv > 18) {
		layer.bindTooltip(simp, {'permanent':true})
	}*/
	$('#unitTT').change(function() {
		var content = ''
		if (this.checked) {
			layer.bindTooltip(simp, {'permanent':true,'direction':'center','opacity':'0.8'})
		} else {
			layer.unbindTooltip()
		}
	})
	
	/*$("input[name='showTT']").click(function(){
		var radioV = $("input[name='showTT']:checked").val();
		console.log('checked', radioV)
		if (radioV == 'price_per_person') {
			console.log('BINDING PPP',simp)
			layer.bindTooltip(simp, {'permanent':true,'direction':'center','opacity':'0.9'})
			console.log('binded')
		}else		if (radioV == 'number_of_units') {
			console.log('BINDING NOU',layer)
			layer.bindTooltip(simp, {'permanent':true,'direction':'center','opacity':'0.8'})		
		}
	})*/

	
	$(layer).on({
		mouseover: function() {
			layer.openPopup()
			layer.setStyle({color:"#7777ff",weight:2})
			/*if (typeH == 'House') {
				layer.setStyle({fillColor:"#cccc00"})
			} else {
				layer.setStyle({fillColor:"#ff55ff"})
			}*/
		},
		mouseout: function() {
			//console.log('mouseout', addr)
			layer.closePopup()
			layer.setStyle(style)
			/*if (typeH == 'House') {
				layer.setStyle(style)
			} else {
				layer.setStyle(style)
			}*/
		},
		click: function() {
			layer.openPopup()
			layer.setStyle({color: "#7777ff"})
			//console.log('passing: ', addr)
			updateInfoWindow(feature)//addr,name,typeH,url1,url2,det,yrB,flp)
			/*if (typeH == 'House') {
				layer.setStyle({fillColor:"#000000",opacity:'1'})
			} else {
				layer.setStyle({fillColor:"#552255",opacity:'1'})
			}*/
			/*layer.on({mouseout: function() {
				layer.setStyle({fillColor:"#000000",opacity:'1'})
				layer.closePopup()
			}*/
		}
	})
}

function updateInfoWindow(feature) {
	$('.updatable').remove()
	$('#tb_flp').remove()

	var prt = feature.properties
	var addr = prt.Address
	var name = prt.Name
	var typeH = prt.Type_of_housing
	var url1 = prt.URL1
	var url2 = prt.URL2
	var flp = prt.Floorplans
	var det = prt.Detailed_type
	var simp = prt.Simplified_type
	var yrB = prt.Year_built
	var popupCntnt = '<p><b>Address:</b> ' + addr + '</p><p><b>Name:</b> ' + name

	var panelCntnt = '<div class="updatable"><p id="updatable-basic"><b>Name: </b>' + name + '</p>'
	+'<p id="updatable-basic"><b>Address: </b>' + addr + '</p>'
	+'<p id="updatable-basic"><b>Type of housing: </b>' + typeH + '</p>'
	+'<p id="updatable-basic"><b>Specific type: </b>' + det + '</p>'
	+'<p id="updatable-basic"><b>Year built: </b>' + yrB + '</p>'
	+'<p id="updatable-basic"><b>URL1: </b><br><a href="url">' + url1 + '</a></p>'
	

	if (url2 != '-') {
		panelCntnt += '<p id="updatable-basic"><b>URL2: </b><br><a href="url">' + url2 + '</a></p>'
	}
	else {
		panelCntnt += '<p id="updatable-basic"><b>URL2: </b><br>' + url2 + '<br><br></p>'
	}

	tableC = '<table id="tb_flp">'
	var keyDict = Object.keys(flp)
	tableC += '<tr>' + '<th>Title</th>' + '<th>Price</th>' + '<th>Area</th>' +'<th>Price/sq ft</th>' + '</tr>'
	for (i = 0; i < keyDict.length; i ++) {

		var flpN = flp[keyDict[i]]
		var title = flpN['Title']
		
		tableC += '<tr><td>' + title + '</td>'
		// Append basic floorplan info to table
		if ('Price' in flpN) {
			var price = flpN['Price']
			var area = flpN['Area']
			var ppa = flpN['Price/Unit_area']

			if (price.length == 2) {
				priceStr = price[0] + '-' + price[1]
			} else {
				priceStr = price[0]
			}
			
			if (area.length == 2) {
				areaStr = area[0] + '-' + area[1]
			} else {
				areaStr = area[0]
			}
			
			if (ppa.length == 2) {
				ppaStr = ppa[0] + '-' + ppa[1]
			} else {
				ppaStr = ppa[0]
			}

			tableC += '<td>' + priceStr + '</td><td>' + areaStr + '</td><td>' + ppaStr + '</td>'
		}
		tableC += '</tr>'

		for (ex = 0; ex < 4; ex ++) {
			var extraKey = 'Extra_Feature_' + ex.toString()
			//console.log('thissssssss',flpN)
			if (extraKey in flpN) {
				var extra = flpN[extraKey]
				var extraTitle = extra['Sub_title']
				
				var extraPrice = extra['Price']
				if (extraPrice.length == 2) {
					var extraPriceStr = extraPrice[0] + '-' + extraPrice[1]
				} else {
					var extraPriceStr = extraPrice[0]
				}
				
				var extraArea = extra['Area']
				//console.log('AREAAAAAAAAAAA', extraArea.length ,extraArea)
				if (extraArea.length == 2) {
					var extraAreaStr = extraArea[0] + '-' + extraArea[1]
				} else  { 
					var extraAreaStr = extraArea[0]
				}
				
				var extraPPA = extra['Price/Unit_area']
					var extraPPAStr = extraPPA[0]
						
				tableC += '<tr id="tb_extra>'/* + '<td>Extra Layout' + ex*/ + '<td>' + extraTitle + '</td><td>' 
				+ extraPriceStr + '</td><td>' + extraAreaStr + '</td><td>' + extraPPAStr + '</td></tr>'
			}				
		}
		//console.log('Det_ON_THIS',i,'ARE:',flpN,title,price,area,ppa)
	}

	//for i '<p id="updatable-basic"><b>Floorplans: </b>' + flp['Floorplan1']['Title'] + '</p></div>'

	//panelCntnt += 
	tableC += '</table>'
	//console.log('PANEL', panelCntnt)
	$('#price_window').append(panelCntnt)
	$('#price_window').append(tableC)
	$('#res_window').append(panelCntnt)
}

/*function updateColor(feature, layer) {
	if (feature.properties.Type_of_housing == 'House') {
		
	}
}*/

function createBaseSymbols(data, map) {
	var basic = L.geoJson(data, {
		style: function(feature) {
			var style1 = {"color": "#999999", "fillColor": "#cccccc","fillOpacity": 1,"weight": 1}
			return style1
		}
	}).addTo(map)
}

function updatePropSymbols(map, attribute) {
	// map.eachLayer is used to iterate through each single Circle Marker
	map.eachLayer(function(layer) {
		// proceed if feature, and properties with the name of attribute(the column name that starts with "gdp_") exist
		// in this layer (represented by this Circle Marker)
		if (layer.feature && layer.feature.properties[attribute]) {
			// get all properties -- all gdp data under this layer)
			var proprts = layer.feature.properties

			// calculate radius of the reset Circle Marker
			var radius = calcR(proprts[attribute])

			createPopupCntnt(layer, radius, proprts, attribute)
		}
	})
}

function updateNotif(index) {
	$('#notif').remove()
	iNum = parseInt(index)
	// add a notification that shows current year the slider is on
	// If index of the slider is greater than 5, use a different equation, because 2008, 2009, and 2010 does not 
	// follow the previous pattern of intervals of 5 (1980, 1985, 1990, 1995, 2000 and 2005).
    var year = (iNum > 5) ? (2002 + iNum): (1980 + 5 * iNum)
    var notif = '<div id="notif">Showing GDP of year ' + year + '</div>'
    // If '#updatable'(the info panel that shows data of clicked layer in the '#panel') is still empty (still initial value in index.html), 
	// append notification at the end of the panel, otherwise append before '#updatable'
	// This ensure that the relative position of "#updatable" and "#notif" remains unchanged when the user performs any
	// clicking or sliding 

    if (!$('#updatable').is(':empty')) {
       	$(notif).insertBefore('#updatable')
    } else {
       	$('#panel').append(notif)
    }
}

/*function createSeqCtrl_new(map,attributes) {
	console.log("entering")
	var seqCtrl = L.Control.extend({
		options: {
			position: "bottomleft"
		},
		onAdd: function(map) {
			var container = L.DomUtil.create('div', 'sequence-control-container')
			$(container).append('<input type="range" class="range-slider-new" min="0" max="8" value="0" step="1">')
			$(container).append('<button class="skip-new" id="reverse" title="Reverse">Reverse</button>')
			$(container).append('<button class="skip-new" id="forward" title="Forward">Forward</button>')
			$('#reverse').html('<img src="data/icon/new_backward.png">')
			$('#forward').html('<img src="data/icon/new_forward.png">')
			L.DomEvent.disableClickPropagation(container)
			return container
		}
	})
	map.addControl(new seqCtrl())

	var index = $('.range-slider-new').val()
	console.log('INDEX', index)

	$('.skip-new').click(function() {
		var index = $('.range-slider-new').val()		// retrive index upon click
		if ($(this).attr('id') == 'forward') {
			console.log("CLICKING1")
			index ++
			index = index > 8 ? 0 : index
		} else if ($(this).attr('id') == 'reverse') {
			index --
			index = index < 0 ? 8 : index
		}
		// update range-slider per index retrived 
		$('.range-slider-new').val(index)
		var attr = attributes[index]
		var yr = attr.split('_')[1]

		updateNotif(index)
		updateNotif_2(map,yr,attr)
		updatePropSymbols(map, attr)
	})

	$('.range-slider-new').on('input', function(){
    	// similar idea to the previous click event handler
        var index = $(this).val()
        var attr = attributes[index]
		var yr = attr.split('_')[1]

        updateNotif(index)
        updateNotif_2(map,yr,attr)
        updatePropSymbols(map, attr)       	
    })
}

function updateNotif_2(map,yr,attr) {
	if (checkNotif != undefined) {
		$('.update_notif_C').remove()
	}
function 
	var update_notif_2 = L.Control.extend({
		options: {
			position: 'bottomright'
		},
		onAdd: function(map) {
			checkNotif = 0
			var container = L.DomUtil.create('div','update_notif_C')
			$(container).append('<div id="notif_2">Displaying GDP of year ' + yr + '</div')
			            //add temporal legend div to container

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" height="101px" width="195px">';

        	//array of circle names to base loop on
        	var circles = {
            	max: 20,
            	mean: 40,
            	min: 60
       	 	};

        	//loop to add each circle and text to svg string
        	for (var circle in circles){
            	//circle string
            	svg += '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="47"/>';

            	//text string
            	svg += '<text id="' + circle + '-text" x="95" y="' + circles[circle]*1.2 + '"></text>';
        	};

        	//close svg string
       	 	svg += "</svg>";
            
            $(container).append(svg);

			return container
		}
	})
	map.addControl(new update_notif_2)
	console.log("creating")

	updateLegend(map, attr)

}

function updateLegend(map, attribute){
	console.log("INTOO")
    //create content for legend
    var year = attribute.split("_")[1];
    var content = "Population in " + year;

    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);

    for (var key in circleValues){
        //get the radius
    	var radius = calcR(circleValues[key]);
        
        $('#'+key).attr({
            cy: 59 - radius,
            r: radius
        });

        //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " USD");

        //Step 3: assign the cy and r attributes
        $('#'+ key).attr({
            cy: 98 - radius,
            r: radius
        });

        $('#attribute-legend').append($('#' + key))

    };
};*/

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

//function 

function enableMenuButtons(response, map) {
	// append a series of buttons to '#panel', '#compare' and '#compareResult' interfaces
	$('.back_to_menu').off('click')
	
	$('#menu').append("<p id='title_menu'>UW-Madison Off-Campus Housing Options Exploration Tool</p>")
	/*$('#menu').append("<p id='title_explore'>Explore<br>_________________________</p>")
	$('#menu').append("<br><button id='detail_explore'>Explore Details</button>")*/
	
	$('#detail_explore').off('click')
	$('#detail_explore').on({
		'click': function() {
			console.log("DET_EXPLORE clicked!")
			set_det_window()
			createRepSymbols(response, map)
		}
	})

	$('#menu').append("<p id='title_compare'>Compare<br>_________________________</p>")	
	
	// Call price-compare function
	$('#menu').append("<br><button id='price_compare'>Compare Price</button>")
	$('#price_compare').off('click')
	$('#price_compare').on({
		'click': function() {
			console.log('Now comparing prices')
			set_price_window()
			priceSymbols(response, map)
		}
	})

	$('#menu').append("<br><button id='area_compare'>Compare Area</button>")
	$('#menu').append("<br><button id='ppa_compare'>Compare Price/sqft</button>")
	
	$('#menu').append("<p id='title_proximity'>Proximities<br>_________________________</p>")
	$('#menu').append("<br><button id='library_proximity'>To Library</button>")
	
	$('#menu').append("<br><button id='res_proximity'>To Restaurants</button>")
	// Call restaurant-proximity function
	$('#res_proximity').on({
		'click': function() {
			console.log('Now getting restaurant proximities')
			set_res_window()
			getData2(response, map)

		}
	})
	
	$('#menu').append("<br><button id='bus_proximity'>To Bus Stops</button>")

	/*
	$('#compare').append("&nbsp&nbsp<button class='compareButton' id='end_comparison'> <img class='arrow' src='data/icon/left_arrow2.png'>&nbsp&nbsp&nbspEnd comparison</button>")
	$('#compare').append("&nbsp&nbsp&nbsp&nbsp&nbsp<button class='compareButton' id='to_comparison'> To compare&nbsp&nbsp&nbsp<img class='arrow' src='data/icon/right_arrow2.png'></button>")
	$('#compare').append("<p>&nbsp&nbspSELECT TWO YEARS TO COMPARE: </p>")
	$('#compare').append("&nbsp&nbsp<button id='select_again'>Select again</button><br><br><br>")
	$('#compareResult').append("&nbsp&nbsp<button class='compareButton' id='exit_result'> <img class='arrow' src='data/icon/left_arrow2.png'>&nbsp&nbsp&nbspBack to selection</button>")
	*/
	// Only shows '#panel' at the inital stage, '#compare' and '#compareResult' interfaces are fired later upon clicking
	// certain buttons.
	$('#compare').hide()
	$('#compareResult').hide()
}

//function createYrButtons(map) {
	// Create buttons representing years with images as background, for years 1980, 1985, 1990, 1995, 2000, 2005
	/*for (i = 0; i < 6; i ++) {
		// retrive the currect images as background of buttons
		yr = (1980 + i * 5).toString()
		var buttonNameId = 'chooseYr' + yr
		var buttonNameId_selector = '#' + buttonNameId
		if (i == 0) {
			var background_path = '<div class="image_button"><img class="jpg" src="data/yr_background/' + yr + '_v2.jpg"><div class="yr_text">' + yr + '</div></div>'
		} else {
			var background_path = '<div class="image_button"><img class="jpg" src="data/yr_background/' + yr + '_v2.jpg"><div class="yr_text">' + yr + '</div></div>'
		}

		// append clickable images to the "#compare" interface
		$('#compare').append(background_path)
	}
	// Same idea as the previous for loop, adding images for years 1008, 1009, 2010
	for (i = 0; i < 3; i ++) {
		var yr = (2008 + i).toString()
		var buttonNameId = 'chooseYr' + yr
		var buttonNameId_selector = '#' + buttonNameId

		if (i % 2 == 0) {
			var background_path = '<div class="image_button"><img class="jpg" src="data/yr_background/' + yr + '_v2.jpg"><div class="yr_text">' + yr + '</div></div>'		
		} else if (i != 2) {
			var background_path = '<div class="image_button"><img class="jpg" src="data/yr_background/' + yr + '_v2.jpg"><div class="yr_text">' + yr + '</div></div>'
		} else {
			var background_path = '<div class="image_button"><img class="jpg" src="data/yr_background/' + yr + '_v2.jpg"><div class="yr_text">' + yr + '</div></div>'
		}

			$('#compare').append(background_path)*/
		
	
/////

/*function compareInterface(map,attributes) {
	// add functionalities to the "#compare" interface, making it interact-able
	var numSelected = 0
	var yrSelectedArr = new Array

	// End comparison button, click to go back to "#panel". Also re-fires updatePropSymbol and panelInterface functions
	$('#end_comparison').click(function() {
		$('#compare').hide()
		$('#panel').show()

		// re-fires updatePropSymbols and panelInterface functions after clicked "end comparison"
		updatePropSymbols(map, attributes[index])
		panelInterface(map,attributes)
	})
	// As a feedback, the clickable image opacity is changed upon mouseover
	$('.image_button').mouseover(function() {
		consoleconsole.log('mouseovered image')
		$(this).css({'opacity':'0.25'})
	})

	// The clickable image opacity changes back after mouseout
	$('.image_button').mouseout(function() {
		console.log('mouseouted image')
		$(this).css({'opacity':'0.6'})
	})

	// The clickable image reformats after the user clicks it, giving a feedback that it is selected
	$('.image_button').click(function() {
		// Retrive years selected by user
		yrSelectedArr.push(parseInt($(this).find('.yr_text').html()))
		console.log("YR SELECTED: ", yrSelectedArr)
		console.log('clicked image')
		$(this).find('.jpg').css({'border': '2.5px solid red'})
		$(this).css({'opacity':'1'})
		$(this).mouseout(function() {
			$(this).css('opacity','1')
		})
		// Count the number of clicks, judge whether to reset image_buttons or proceed to comparison
		numSelected += 1
		if (numSelected < 2) {
			// User cannot click to_comparison if they have not selected two year buttons
			$('#to_comparison').css({'background-color': '#a3a3a3'})
			$('#to_comparison').off('click')
		} else if (numSelected == 2) {
			// After user has selected two image-buttons, to_comparison button will light up and fire up click event
			$('#to_comparison').css({'background-color': '#4CAF50'})
			$('#to_comparison').click(function() {
				$('#compare').hide()
				$('#compareResult').show()
				// Get attributes of thw two selected years
				var data2Yrs = new Array
				var index1 = yrSelectedArr[0] > 2005 ? (yrSelectedArr[0] - 2002) : ((yrSelectedArr[0] - 1980) / 5)
				var index2 = yrSelectedArr[1] > 2005 ? (yrSelectedArr[1] - 2002) : ((yrSelectedArr[1] - 1980) / 5)
				if (index1 < index2) {
					data2Yrs.push(attributes[index1])
					data2Yrs.push(attributes[index2])
				} else {
					data2Yrs.push(attributes[index2])
					data2Yrs.push(attributes[index1])
				}

				// fires compareResult function with formatted parameters
				compareResult(map, attributes, numSelected, yrSelectedArr, data2Yrs)
			})
		} else if (numSelected > 2) {
			// If number of selection exceeds 2, gray-out "To compare" button and disable click-ability
			// re-fire image-buttons and this same function
			startOver(map, attributes)
		}
		// If user clicked select again, then re-fire image-buttons and this same function [OK]
		// WARNING: This part still contains bug, DO NOT use this button. Rather, triple click on the image to reset selection.
		$('#select_again').click(function(map) {
			startOver(map, attributes)
		})
	})
}
function startOver(map,attributes) {
	// Reset the "#compare" interface for new selection
	$(".image_button").remove()
	$('#to_comparison').css({'background-color': '#a3a3a3'})
	$('#to_comparison').off('click')
	$('.image_button').find('.jpg').css('all','initial')
	createYrButtons(map)
	compareInterface(map,attributes)
}	*/
/////

function panelInterface(map,attributes) {
	// panel interface (home page)
	$('#start_comparison').click(function() {
		$('#menu').hide()
		$('#compare').show()
		$('#compareResult').hide()
		compareInterface(map,attributes)
	})
}
//////

function compareResult(map,attributes,numSelected,yrSelectedArr,data2Yrs) {
	// Check if the gdp data passed contains n/a data (actually only Hainan GDP of year 1980 is n/a)
	var hasNA = false

	// clear previous data displayed
	$('#compareInfo').remove()
	$('#compareRanking').remove()
	// "percentage-justified"
	$('#perc_j').remove()
	// "administrative division-justified"
	$('#admin_j').remove(0)
	if (yrSelectedArr[0] > yrSelectedArr[1]) {
		var interm = yrSelectedArr[0]
		yrSelectedArr[0] = yrSelectedArr[1]
		yrSelectedArr[1] = interm
	}

	// Intro part of compare info panel
	var compareInfo = '<div id="compareInfo"><br>GDP(ppp) change rates per year, per administrative division between ' 
	+ yrSelectedArr[0] + ' and ' + yrSelectedArr[1] + ' are: <br><br>' + '</div>'
	// append the intro to '#compareResult' panel
	$('#compareResult').append(compareInfo)
	
	// The passedBack contains a list of gdp increase percentage of all administrative districts 
	// and a list of administrative district names
	var passedBack = createCompareSymbols(map,attributes, numSelected, yrSelectedArr, data2Yrs)
	var perc_incr_L = passedBack[0]
	var admin_L = passedBack[1]

	var perc_sorted = []
	var admin_sorted = []

	//	rank the two lists from largest to smalles
	while (perc_incr_L.length > 0) {
		console.log("LEN",perc_incr_L)
		var max = 0
		var max_admin = ''
		var ind_max = 0

		for (i = 0; i < perc_incr_L.length; i ++) {

			if (perc_incr_L[i] > max) {
				max = perc_incr_L[i]
				max_admin = admin_L[i]
				var ind_max = i
				console.log('maxxxxxxx',max)
			}
		}
		perc_incr_L.splice(ind_max, 1)
		admin_L.splice(ind_max, 1)

		console.log("MIDDLLLLL", i, perc_incr_L, max)
		perc_sorted.push(max)
		admin_sorted.push(max_admin)
	}

	// Deal with exception: those whose data is n/a
	if (admin_sorted[30].length == 0) {
		admin_sorted[30] = 'Hainan'
		hasNA = true
	}
	
	// declare <div> for displaying the data
	var ranking = '<div id="compareRanking"><br><b>Rank&nbsp | &nbspAdministrative division&nbsp | &nbspChange rate per year</b><br>'
	var perc_j = '<div id="perc_j">'
	var admin_j = '<div id="admin_j">'
	console.log('1--------')

	// displaying data
	for (i = 0; i < perc_sorted.length; i ++) {

		if (i < 9) {
			var spacing = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
		} else {
			var spacing = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
		}
		
		// when all data of selected year is available
		if (!hasNA) {
			if (i % 2 == 1) {
					var admin_j = '<div class="admin_j" style="color:#aaaaaa">' + (i + 1) + spacing + admin_sorted[i] + '</div>'
					var perc_j = '<div class="perc_j" style="color:#aaaaaa">+' + perc_sorted[i] + '%</div>'
				} else {
					var admin_j = '<div class="admin_j">' + (i + 1) + spacing + admin_sorted[i] + '</div>'
					var perc_j = '<div class="perc_j">+' + perc_sorted[i] + '%</div>'
				}
			
			// when the data list has one n/a item
			} else {
				if (i < 30) {
					if (i % 2 == 1) {
						var admin_j = '<div class="admin_j" style="color:#aaaaaa">' + (i + 1) + spacing + admin_sorted[i] + '</div>'
					var perc_j = '<div class="perc_j" style="color:#aaaaaa">+' + perc_sorted[i] + '%</div>'
					} else {
						var admin_j = '<div class="admin_j">' + (i + 1) + spacing + admin_sorted[i] + '</div>'
						var perc_j = '<div class="perc_j">+' + perc_sorted[i] + '%</div>'
					}
				} if ((i == 30) && hasNA) {
					if (i % 2 == 1) {
						var admin_j = '<div class="admin_j" style="color:#aaaaaa">' + (i + 1) + spacing + admin_sorted[i] + '</div>'
						var perc_j = '<div class="perc_j" style="color:#aaaaaa"> No data for year 1980 </div>'
					} else {
						var admin_j = '<div class="admin_j">' + (i + 1) + spacing + admin_sorted[i] + '</div>'
						var perc_j = '<div class="perc_j_NA">No data for year 1980 </div>'
					}
				}
			}

		ranking += perc_j + admin_j
	}

	console.log('RANKING',ranking)
	$('#compareResult').append(ranking)
}

function createCompareSymbols(map, attributes, numSelected, yrSelectedArr, data2Yrs) {
	console.log('DATA2YR',data2Yrs)
	var markerG = new Array
	var perc_incr_L = new Array
	var admin_L = []
	var passBack = new Array
	for (i = 0; i < 2; i ++) {
		map.eachLayer(function(layer) {
			if (layer.feature && layer.feature.properties[data2Yrs[i]]) {

				var proprts = layer.feature.properties
				console.log('PROPERTIES',proprts)

				var radius = calcR(proprts[data2Yrs[i]])

				var popupRadius = calcR(proprts[data2Yrs[1]])

				var coord = [layer.feature.geometry.coordinates[1], layer.feature.geometry.coordinates[0]]
				console.log(typeof(coord), coord)

				var yr1 = yrSelectedArr[0]
				var yr2 = yrSelectedArr[1]

				var gdpYr1 = proprts[data2Yrs[0]]
				var gdpYr2 = proprts[data2Yrs[1]]

				var perc_incr = ((Math.pow(gdpYr2  / gdpYr1, 1/(yr2 - yr1)) - 1) * 100).toFixed(2)

				// Hover to view details of comparison
				var popupCntnt = "<ul id='compare_popup'><li class='c_p_basic'><b>GDP(ppp) per capita in year " + yr1 +  " :</b> $" + gdpYr1 + "</li>" +
				"<li class='c_p_basic'><b>GDP(ppp) per capita in year " + yr2 + " :</b> $" + gdpYr2 + "</li>" + 
				"<li class='c_p_detail'> In this <b>" + (yr2 - yr1) + "-year</b> period from <b>" + yr1 + " </b>to<b> " + yr2 + "</b>," + 
				"<br>In the administrative division of <b>" + proprts.Admin_division + ",</b>" + 
				"<br>The average GDP(ppp) per capita increase per year is <b>" + ((gdpYr2 - gdpYr1) / (yr2 - yr1)).toFixed(1) + "</b> USD," + 
				"<br>Or an increase rate of <b>" + perc_incr + "</b> percent per year." + 
				"<br>In this peroid, the GDP(ppp) of this administrative division has increased for <b>" + (gdpYr2 / gdpYr1).toFixed(2) + "</b> times.</li></ul>"

				// The data of the earlier year will be displayed using another circle marker group
				if (i == 0) {

					perc_incr_L.push(Number(perc_incr))
					admin_L.push(String(proprts.Admin_division))
					passBack.push(perc_incr_L,admin_L)

					circle2 = L.circleMarker(coord, {
						radius: radius,
 						stroke: true, 
  						color: 'red', 
  						opacity: 1, 
  						weight: 0.3, 
  						fill: true, 
  						fillColor: '#6677ee', 
  						fillOpacity: 0.5
  					}).addTo(map);
					circle2.bindPopup(popupCntnt, {
						offset: new L.Point(0, -popupRadius * 0.8),
						opacity:0.8
					})
					markerG.push(circle2)
					$(circle2).on({
						mouseover: function() {
							this.openPopup()
						},
						mouseout: function() {
							this.closePopup()
						},
						click: function() {
							this.openPopup()
							/*this.on({
								mouseout: function(){	
									this.openPopup()
								}
							})*/
						}
					})
				}

				layer.setRadius(radius)

				// bind popups
				layer.bindPopup(popupCntnt, {
					offset: new L.Point(0, -radius * 0.8),
					opacity: 0.8
				})
			}
		})
	}

	// Reset the additional circle marker group when user clicks exit result, and prepare for a new comparison
	$('#exit_result').click(function() {
		for (i = 0; i < markerG.length; i ++) {
			map.removeLayer(markerG[i])
		}
		map.eachLayer(function(layer) {
			layer.unbindPopup()
		})
		$('#compareResult').hide()
		$('#compare').show()
		startOver(map,attributes)
	})
	return passBack
}

function createRess(data, map) {
	L.geoJson(data, {
		pointToLayer: function(feature,latlng) {
			var options = {
				radius: 2,
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};
			return L.circleMarker(latlng, options)
		}
	}).addTo(map)
}


// Getting data through AJAX
function getData2(data, map) {
	console.log('getting-data',data)
	$.when(ajax5(), ajax10(), ajax_res()).then(function(a1, a2, a3) {
		console.log('DONE',a1, a2, a3)
		resSymbols(data, a1[0], a2[0], a3[0], map)
	})
}

function ajax5() {
	return $.ajax("data/5_min_walk_polygon+reachable_restaurant_id.geojson", {
		/* specify the file format the ajax method is to call*/
		dataType: "json",
		success: function(response) {
			//var attributes = processData(response)
			console.log('getting ajax5')
			return response
		}
	})
}

function ajax10() {
	return $.ajax("data/10_min_walk_polygon+reachable_restaurant_id.geojson", {
		/* specify the file format the ajax method is to call*/
		dataType: "json",
		success: function(response) {
			//var attributes = processData(response)
			console.log('getting ajax10')
			return response
		}
	})
}
/*
function ajax15() {

}*/
function ajax_res() {
	return $.ajax("data/all_restaurants.geojson", {
		/* specify the file format the ajax method is to call*/
		dataType: "json",
		success: function(response) {
			//var attributes = processData(response)
			console.log('getting res')
			return response
		}
	})
}

//function to retrieve the data and place it on the map
function getData(map) {
	$.ajax("data/all_apts_222444.geojson", {
		/* specify the file format the ajax method is to call*/
		dataType: "json",
		success: function(response) {
			//var attributes = processData(response)
			enableMenuButtons(response, map)
			createBaseSymbols(response, map)

			//createRepSymbols(response, map)
			//createSeqCtrl_new(map,attributes)
			
			// The fifth operator: re-expression
			
			//createYrButtons(map)
			/*panelInterface(map,attributes)
			/* The fifth operator: compare*/
		}
	})
	/*$.ajax("data/all_stops_of_campus_routes_BOUNDING_BOX.geojson", {
		/* specify the file format the ajax method is to call
		dataType: "json",
		success: function(response) {
			//var attributes = processData(response)
			createStops(response, map)
			//createSeqCtrl_new(map,attributes)
		}
	})*/
}

$(document).ready(createMap);