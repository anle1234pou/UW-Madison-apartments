// Declare global variables
var yrSelectedArr = new Array
var circle2
var markerG = new Array
var data2Yrs = new Array
var checkNotif

var gg2
var gg5
var gg5_b

var gg10
var gg10_b

var gg0
var gg_res

var gg_routes
var gg_stops

var selected_ress = []
var busIcon = L.Icon.extend({
    options: {
		iconSize: [30,30],
        iconAnchor:   [15, 30],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
})

var pass_routes = []
var gg_route_sel

var gg_campus_walk
var gg_campus_bike

var gg_gordon
var gg_bascom
var gg_unionS
var gg_nat

var legend1 = L.control({position: 'bottomleft'});
var legend2 = L.control({position: 'bottomleft'});
var legend3 = L.control({position: 'bottomleft'});

//function to instantiate the Leaflet map
function createMap() {
    //create the map using the L.map method
    var map = L.map('map', {
    	center: [43.07, -89.403],
    	zoom: 15
	});
	
	L.control.scale({'position':'bottomright'}).addTo(map);

	L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 19
	}).addTo(map)
	
	$('#det_window').hide()
	$('#price_window').hide()
	$('#res_window').hide()
	$('#lib_window').hide()
	$('#bus_window').hide()
	$('#campus_window').hide()
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

function pointToLayer(latlng) {

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

	return cmLayer
}

function set_det_window() {
	$('#menu').hide()
	$('#det_window').show()
	$('.back_to_menu').off('click')
}
function set_campus_window() {
	$('#menu').hide()
	$('#campus_window').show()
	$('.back_to_menu').off('click')
}

function bound_res_10(map,fid1,data10,data_res) {
	//var gg5 = L.geoJson(data5)

	console.log(map.hasLayer(gg10_b))
	if (map.hasLayer(gg10_b)) {
		console.log('HASSSS')
		map.removeLayer(gg10_b)
	}	
	if (map.hasLayer(gg5_b)) {
		console.log('HASSSS')
		map.removeLayer(gg5_b)
	}
	gg10_b = L.geoJson(data10, {
		filter: function(feature, layer) {
			if (parseInt(feature.id) === fid1) {
				var ress10 = feature.properties.reachable_restaurants
				all_ress_10(map, data_res, ress10)
			}
			return (parseInt(feature.id) === fid1)
		}
	}).addTo(map)

	gg10_b.bringToBack()
}

function all_ress_5(map, data_res, ress5) {
	console.log('RESSSSSSSSSSSSSSSSS calledddddddddddd')
	if (map.hasLayer(gg5)) {
		map.removeLayer(gg5)
	}
	if (map.hasLayer(gg10)) {
		map.removeLayer(gg10)
	}
	selected_ress = []

	gg5 = L.geoJson(data_res, {
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
			if (ress5.includes(parseInt(feature.properties.FID))) {
				console.log('selected', parseInt(feature.properties.FID))
				selected_ress.push(feature)	
			}
			return (ress5.includes(parseInt(feature.properties.FID)))
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
					this.setStyle({color:'blue',fillColor:'orange',weight: 3})
				},
				mouseout: function() {
					this.closePopup()
					this.setStyle({color: "#000",fillColor:'white',weight: 3})
				},
				click: function() {
					$('#ress_info').remove()
					var windowContent = "<div id='ress_info' style='padding-top:-10px; line-height:20px'>________________________________________<br><b>Name:</b> " + feature.properties.name + '<br><b>Address:</b> ' + feature.properties.address + '<br><b>Price range:</b> '
					+ feature.properties.price_range + '<br><b>Rating count:</b> ' + feature.properties.rating_count + '<br><b>Rating score:</b> ' + feature.properties.rating_score 
					+ '<br>Tags: ' + feature.properties.tags + '<br><b>URL: </b><a href="' + feature.properties.url + '"' + ' target="_blank">' + feature.properties.url + '</a></p></div>'
					$('#res_window').append(windowContent)
				}
			})
		}

	}).addTo(map)
	
	//set_res_window.append()
	$('#ress_notif').remove()
	var panelContent = "<div id='ress_notif'><p>Number of restaurants within 5-min walk distance: <b>" + ress5.length + '<b></p>'
	$('#res_window').append(panelContent)

	resInfoPopup(selected_ress)
	gg5.bringToFront()
}
function bound_res_5(map,fid1,data5,data_res) {

	console.log(map.hasLayer(gg5_b))
	if (map.hasLayer(gg5_b)) {
		console.log('HASSSS')
		map.removeLayer(gg5_b)
	}
	if (map.hasLayer(gg10_b)) {
		console.log('HASSSS')
		map.removeLayer(gg10_b)
	}
	gg5_b = L.geoJson(data5, {
		filter: function(feature, layer) {
			if (parseInt(feature.id) === fid1) {
				var ress5 = feature.properties.reachable_restaurants
				all_ress_5(map, data_res, ress5)
			}
			return (parseInt(feature.id) === fid1)
		}
	}).addTo(map)

	gg5_b.bringToBack()
}

function all_ress_10(map, data_res, ress10) {
	
	console.log('RESSSSSSSSSSSSSSSSS calledddddddddddd')
	if (map.hasLayer(gg10)) {
		map.removeLayer(gg10)
	}
	if (map.hasLayer(gg5)) {
		map.removeLayer(gg5)
	}
	selected_ress = []

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
					this.setStyle({color:'blue',fillColor:'orange',weight: 3})
				},
				mouseout: function() {
					this.closePopup()
					this.setStyle({color: "#000",fillColor:'white',weight: 3})
				},
				click: function() {
					$('#ress_info').remove()
					var windowContent = "<div id='ress_info' style='padding-top:-10px; line-height:20px'>________________________________________<br><b>Name:</b> " + feature.properties.name + '<br><b>Address:</b> ' + feature.properties.address + '<br><b>Price range:</b> '
					+ feature.properties.price_range + '<br><b>Rating count:</b> ' + feature.properties.rating_count + '<br><b>Rating score:</b> ' + feature.properties.rating_score 
					+ '<br>Tags: ' + feature.properties.tags + '<br><b>URL: </b><a href="' + feature.properties.url + '"' + 'target="_blank">' + feature.properties.url + '</a></div>'
					$('#res_window').append(windowContent)
				}
			})
		}

	}).addTo(map)
	
	$('#ress_notif').remove()
	var panelContent = "<div id='ress_notif'><p>Number of restaurants within 10-min walk distance: <b>" + ress10.length + '<b></p>'
	$('#res_window').append(panelContent)

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
function set_bus_window() {
	console.log('setting bus')
	$('#menu').hide()
	$('#bus_window').show()
	$('.back_to_menu').off('click')
}

function campusSymbols(data, data_uw, map) {
	//L.geoJson(data_uw).addTo(map)
	
	var styles3 = [{"color": "#000000", "fillColor": "#ffffcc","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#c7e9b4","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#7fcdbb","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#41b6c4","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#2c7fb8","fillOpacity": '0.95',"weight": 0.5},
	{"color": "#000000", "fillColor": "#253494","fillOpacity": '0.95',"weight": 0.5},
	]
	var color3 = ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"]
	legend3.remove()

	legend3.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend')
		div.innerHTML = '<div id="legend_title"><b>Time to campus landmark</b></div>'
			var grades = [0, 5, 10, 15, 20, 25]
		for (var i = grades.length - 1; i >= 0; i--) {
			if (i == grades.length - 1) {
				div.innerHTML += '<i style="background:' + color3[i] + '"></i>'
					+ '> '  + (grades[i]) + ' min<br>';
			} else {
				div.innerHTML += '<i style="background:' + color3[i] + '"></i>'
					+ (grades[i] + 1) + (grades[i + 1] ? '&nbsp&ndash;&nbsp' + grades[i + 1] + ' min<br>' : '+');
			}
		}
		return div;
	};

	legend3.addTo(map);



	$('.back_to_menu').on({
		click: function() {
			if (map.hasLayer(gg2)) {
				map.removeLayer(gg2)
			}
			legend3.remove()
			if (map.hasLayer(gg_campus_walk)) {
				gg_campus_walk.clearLayers()
			}
			if (map.hasLayer(gg_campus_bike)) {
				gg_campus_bike.clearLayers()
			}
			if (map.hasLayer(gg_gordon)) {
				gg_gordon.clearLayers()
			}
			if (map.hasLayer(gg_bascom)) {
				gg_bascom.clearLayers()
			}
			if (map.hasLayer(gg_unionS)) {
				gg_unionS.clearLayers()
			}
			if (map.hasLayer(gg_nat)) {
				gg_nat.clearLayers()
			}

			$('#menu').show()
			$('#campus_window').hide()
		}
	})
	console.log("UW_landmarks", data_uw)
	
	$("input[name='travel_mode']").click(function() {
		var rv1 = $("input[name='travel_mode']:checked").val()
		console.log('RV1:', rv1, typeof rv1)
		// I don't know why this is not working
		$("input[name='campus']").attr("checked", false);
		if (map.hasLayer(gg_campus_walk)) {
			gg_campus_walk.clearLayers()
		}
		if (map.hasLayer(gg_campus_bike)) {
			gg_campus_bike.clearLayers()
		}
		if (map.hasLayer(gg2)) {
			gg2.clearLayers()
		}
		$("input[name='campus']").click(function() {
			var rv2 = $("input[name='campus']:checked").val();			
			// Walk time
			if (rv1 == 'walk') {
				
				if (map.hasLayer(gg_gordon)) {
					map.removeLayer(gg_gordon)
				}
				if (map.hasLayer(gg_bascom)) {
					map.removeLayer(gg_bascom)
				}
				if (map.hasLayer(gg_unionS)) {
					map.removeLayer(gg_unionS)
				}
				if (map.hasLayer(gg_nat)) {
					map.removeLayer(gg_nat)
				}

				if (map.hasLayer(gg_campus_walk)) {
					gg_campus_walk.clearLayers()
				}
				if (map.hasLayer(gg_campus_bike)) {
					gg_campus_bike.clearLayers()
				}
				
				if (rv2 == 'gordon') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_gordon = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							console.log("ADDDING BASOM")
							layer.unbindTooltip()
							if (feature.properties.name == 'Gordon Dining and Event Center') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (rv2 == 'bascom') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_bascom = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'Bascom Hall') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (rv2 == 'unionS') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_unionS = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'Union South') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (rv2 == 'nat') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_nat = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'UW Natatorium') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}

				gg_campus_walk = L.geoJson(data, {
					style: function(feature) {
						console.log('INTO')
						if (rv2 == 'gordon') {
							var gordon_walk = parseInt(feature.properties.to_campus.to_gordon_walk[1].slice(0, feature.properties.to_campus.to_gordon_walk[1].indexOf(' ')))
							if (gordon_walk > 0 && gordon_walk <= 5) {
								return styles3[0]
							}
							if (gordon_walk > 5 && gordon_walk <= 10) {
								return styles3[1]
							}
							if (gordon_walk > 10 && gordon_walk <= 15) {
								return styles3[2]
							}
							if (gordon_walk > 15 && gordon_walk <= 20) {
								return styles3[3]
							}
							if (gordon_walk > 20 && gordon_walk <= 25) {
								return styles3[4]
							}
							if (gordon_walk > 25) {
								return styles3[5]
							}
						}
						if (rv2 == 'bascom') {
							var bascom_walk = parseInt(feature.properties.to_campus.to_bascom_walk[1].slice(0, feature.properties.to_campus.to_bascom_walk[1].indexOf(' ')))
							if (bascom_walk > 0 && bascom_walk <= 5) {
								return styles3[0]
							}
							if (bascom_walk > 5 && bascom_walk <= 10) {
								return styles3[1]
							}
							if (bascom_walk > 10 && bascom_walk <= 15) {
								return styles3[2]
							}
							if (bascom_walk > 15 && bascom_walk <= 20) {
								return styles3[3]
							}
							if (bascom_walk > 20 && bascom_walk <= 25) {
								return styles3[4]
							}
							if (bascom_walk > 25) {
								return styles3[5]
							}
							
						}
						if (rv2 == 'unionS') {
							var unionS_walk = parseInt(feature.properties.to_campus.to_unionS_walk[1].slice(0, feature.properties.to_campus.to_unionS_walk[1].indexOf(' ')))
							if (unionS_walk > 0 && unionS_walk <= 5) {
								return styles3[0]
							}
							if (unionS_walk > 5 && unionS_walk <= 10) {
								return styles3[1]
							}
							if (unionS_walk > 10 && unionS_walk <= 15) {
								return styles3[2]
							}
							if (unionS_walk > 15 && unionS_walk <= 20) {
								return styles3[3]
							}
							if (unionS_walk > 20 && unionS_walk <= 25) {
								return styles3[4]
							}
							if (unionS_walk > 25) {
								return styles3[5]
							}
						}
						if (rv2 == 'nat') {
							var nat_walk = parseInt(feature.properties.to_campus.to_nat_walk[1].slice(0, feature.properties.to_campus.to_nat_walk[1].indexOf(' ')))
							if (nat_walk > 0 && nat_walk <= 5) {
								return styles3[0]
							}
							if (nat_walk > 5 && nat_walk <= 10) {
								return styles3[1]
							}
							if (nat_walk > 10 && nat_walk <= 15) {
								return styles3[2]
							}
							if (nat_walk > 15 && nat_walk <= 20) {
								return styles3[3]
							}
							if (nat_walk > 20 && nat_walk <= 25) {
								return styles3[4]
							}
							if (nat_walk > 25) {
								return styles3[5]
							}
						}
					},
					onEachFeature(feature, layer) {
						var ppct = ''

						if (rv2 == 'nat') {
							ppct = '<div><b>Walking</b><br>Travel time: ' + feature.properties.to_campus.to_nat_walk[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_nat_walk[0] + '</div>'
						}
						if (rv2 == 'gordon') {
							ppct = '<div><b>Walking</b><br>Travel time: ' + feature.properties.to_campus.to_gordon_walk[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_gordon_walk[0] + '</div>'
						}
						if (rv2 == 'bascom') {
							ppct = '<div><b>Walking</b><br>Travel time: ' + feature.properties.to_campus.to_bascom_walk[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_bascom_walk[0] + '</div>'
						}
						if (rv2 == 'unionS') {
							ppct = '<div><b>Walking</b><br>Travel time: ' + feature.properties.to_campus.to_unionS_walk[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_unionS_walk[0] + '</div>'
						}

						layer.bindPopup(ppct,{
							offset:new L.Point(0,-8)
						})
						layer.on({
							mouseover: function() {
								layer.setStyle({color:"#5555cc",weight:3})
								layer.openPopup()
							},
							mouseout: function() {
								layer.setStyle({"color": "#000000", "weight": 1})
								layer.closePopup()
							},
							click: function() {
								updateInfoWindow(feature)
							}
						})
					}
				}).addTo(map)
			}
			// Bike time
			if (rv1 == 'bike') {
				if (map.hasLayer(gg_gordon)) {
					map.removeLayer(gg_gordon)
				}
				if (map.hasLayer(gg_bascom)) {
					map.removeLayer(gg_bascom)
				}
				if (map.hasLayer(gg_unionS)) {
					map.removeLayer(gg_unionS)
				}
				if (map.hasLayer(gg_nat)) {
					map.removeLayer(gg_nat)
				}

				if (rv2 == 'gordon') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_gordon = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'Gordon Dining and Event Center') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (rv2 == 'bascom') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_bascom = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'Bascom Hall') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (rv2 == 'unionS') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_bascom = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'Union South') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (rv2 == 'nat') {
					if (map.hasLayer(gg_gordon)) {
						map.removeLayer(gg_gordon)
					}
					if (map.hasLayer(gg_bascom)) {
						map.removeLayer(gg_bascom)
					}
					if (map.hasLayer(gg_unionS)) {
						map.removeLayer(gg_unionS)
					}
					if (map.hasLayer(gg_nat)) {
						map.removeLayer(gg_nat)
					}

					gg_nat = L.geoJson(data_uw, {
						onEachFeature(feature, layer) {
							layer.unbindTooltip()
							if (feature.properties.name == 'UW Natatorium') {
								var popupContent = 'Destination: ' + feature.properties.name
								layer.bindTooltip(popupContent, {'permanent':true,'direction':'top','offset':new L.Point(0,-4),'opacity':0.9}).openTooltip()
							}
						}
					}).addTo(map)
				}
				if (map.hasLayer(gg_campus_walk)) {
					gg_campus_walk.clearLayers()
				}
				if (map.hasLayer(gg_campus_bike)) {
						gg_campus_bike.clearLayers()
				}
				gg_campus_bike = L.geoJson(data, {
					style: function(feature) {
						console.log('INTO')
						if (rv2 == 'gordon') {
							var gordon_bike = parseInt(feature.properties.to_campus.to_gordon_bicycling[1].slice(0, feature.properties.to_campus.to_gordon_bicycling[1].indexOf(' ')))
							if (gordon_bike > 0 && gordon_bike <= 5) {
								console.log('BIKE TIME: GORDON', gordon_bike)
								return styles3[0]
							}
							if (gordon_bike > 5 && gordon_bike <= 10) {
								return styles3[1]
							}
							if (gordon_bike > 10 && gordon_bike <= 15) {
								return styles3[2]
							}
							if (gordon_bike > 15 && gordon_bike <= 20) {
								return styles3[3]
							}
							if (gordon_bike > 20 && gordon_bike <= 25) {
								return styles3[4]
							}
							if (gordon_bike > 25) {
								return styles3[5]
							}
						}
						if (rv2 == 'bascom') {
							var bascom_bike = parseInt(feature.properties.to_campus.to_bascom_bicycling[1].slice(0, feature.properties.to_campus.to_bascom_bicycling[1].indexOf(' ')))
							if (bascom_bike > 0 && bascom_bike <= 5) {
								return styles3[0]
							}
							if (bascom_bike > 5 && bascom_bike <= 10) {
								return styles3[1]
							}
							if (bascom_bike > 10 && bascom_bike <= 15) {
								return styles3[2]
							}
							if (bascom_bike > 15 && bascom_bike <= 20) {
								return styles3[3]
							}
							if (bascom_bike > 20 && bascom_bike <= 25) {
								return styles3[4]
							}
							if (bascom_bike > 25) {
								return styles3[5]
							}
							
						}
						if (rv2 == 'unionS') {
							var unionS_bike = parseInt(feature.properties.to_campus.to_unionS_bicycling[1].slice(0, feature.properties.to_campus.to_unionS_bicycling[1].indexOf(' ')))
							if (unionS_bike > 0 && unionS_bike <= 5) {
								return styles3[0]
							}
							if (unionS_bike > 5 && unionS_bike <= 10) {
								return styles3[1]
							}
							if (unionS_bike > 10 && unionS_bike <= 15) {
								return styles3[2]
							}
							if (unionS_bike > 15 && unionS_bike <= 20) {
								return styles3[3]
							}
							if (unionS_bike > 20 && unionS_bike <= 25) {
								return styles3[4]
							}
							if (unionS_bike > 25) {
								return styles3[5]
							}
						}
						if (rv2 == 'nat') {
							var nat_bike = parseInt(feature.properties.to_campus.to_nat_bicycling[1].slice(0, feature.properties.to_campus.to_nat_bicycling[1].indexOf(' ')))
							if (nat_bike > 0 && nat_bike <= 5) {
								return styles3[0]
							}
							if (nat_bike > 5 && nat_bike <= 10) {
								return styles3[1]
							}
							if (nat_bike > 10 && nat_bike <= 15) {
								return styles3[2]
							}
							if (nat_bike > 15 && nat_bike <= 20) {
								return styles3[3]
							}
							if (nat_bike > 20 && nat_bike <= 25) {
								return styles3[4]
							}
							if (nat_bike > 25) {
								return styles3[5]
							}
						}
					},
					onEachFeature(feature, layer) {
						var ppct = ''

						if (rv2 == 'nat') {
							ppct = '<div><b>Bicycling</b><br>Travel time: ' + feature.properties.to_campus.to_nat_bicycling[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_nat_bicycling[0] + '</div>'
						}
						if (rv2 == 'gordon') {
							ppct = '<div><b>Bicycling</b><br>Travel time: ' + feature.properties.to_campus.to_gordon_bicycling[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_gordon_bicycling[0] + '</div>'
						}
						if (rv2 == 'bascom') {
							ppct = '<div><b>Bicycling</b><br>Travel time: ' + feature.properties.to_campus.to_bascom_bicycling[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_bascom_bicycling[0] + '</div>'
						}
						if (rv2 == 'unionS') {
							ppct = '<div><b>Bicycling</b><br>Travel time: ' + feature.properties.to_campus.to_unionS_bicycling[1] + '<br>Travel distance: ' + feature.properties.to_campus.to_unionS_bicycling[0] + '</div>'
						}

						layer.bindPopup(ppct,{
							offset:new L.Point(0,-8)
						})
						layer.on({
							mouseover: function() {
								layer.setStyle({color:"#5555cc",weight:3})
								layer.openPopup()
							},
							mouseout: function() {
								layer.setStyle({"color": "#000000", "weight": 1})
								layer.closePopup()
							},
							click: function() {
								updateInfoWindow(feature)
							}
						})
					}
				}).addTo(map)
			}
		})
	})
}

function resSymbols(data, data5, data10, data_res, map) {
	if (map.hasLayer(gg2)) {
		gg2.clearLayers()
	}
	var domain_all = []

	L.geoJson(data5, {
		onEachFeature(feature, layer) {
			res_count_5 = feature.properties.reachable_restaurants.length
			console.log('THIS_1010101010:', res_count_5)
			domain_all.push(res_count_5)
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
	gg_res.bringToFront()

	var styles = [{"color": "#000000", "fillColor": "#ffffb2","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fed976","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#feb24c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fd8d3c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fc4e2a","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#e31a1c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#b10026","fillOpacity": '0.95',"weight": 1},
	]

	$("input[name='ress']").click(function(){
		if (map.hasLayer(gg0)) {
			gg0.clearLayers()
		}
		var radioValue = $("input[name='ress']:checked").val();
		console.log("CLIKED?" + radioValue);
		if (map.hasLayer(gg10_b)) {
			map.removeLayer(gg10_b)
		}
		if (map.hasLayer(gg5_b)) {
			map.removeLayer(gg5_b)
		}
		if (map.hasLayer(gg10)) {
			map.removeLayer(gg10)
		}
		if (map.hasLayer(gg5)) {
			map.removeLayer(gg5)
		}
		if (radioValue == '10_ress') {
			color10_ress(gg_res, clusterBreaks, styles, data, data10, data_res, map)
		} else if (radioValue == '5_ress') {
			color5_ress(gg_res, clusterBreaks, styles, data, data5, data_res, map)
		}
	})
	$('.back_to_menu').on({
		click: function() {
			//console.log("BACK?",map.hasLayer(gg2))
			legend2.remove()
			if (map.hasLayer(gg2)) {
				map.removeLayer(gg2)
			}
			if (map.hasLayer(gg10_b)) {
				map.removeLayer(gg10_b)
			}
			if (map.hasLayer(gg5_b)) {
				map.removeLayer(gg5_b)
			}
			if (map.hasLayer(gg10)) {
				map.removeLayer(gg10)
			}
			if (map.hasLayer(gg5)) {
				map.removeLayer(gg5)
			}
			if (map.hasLayer(gg0)) {
				map.removeLayer(gg0)
			}
			if (map.hasLayer(gg_res)) {
				map.removeLayer(gg_res)
			}
			//gg_res.clearLayers()
			$('#menu').show()
			$('#res_window').hide()
		}
	})
}
function color5_ress(gg_res, clusterBreaks, styles, data, data5, data_res, map) {
	
	var colors = ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c"]
	legend2.remove()

	legend2.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend')
		div.innerHTML = '<div id="legend_title"><b>Number of restaurants within 5-min walk distance</b></div>'
			var grades = [-1, 4, 11, 24, 39, 56, 77]
		for (var i = grades.length - 2; i >= 0; i--) {
			div.innerHTML += '<i style="background:' + colors[i] + '"></i>'
				+ (grades[i] + 1) + (grades[i + 1] ? '&nbsp&ndash;&nbsp' + grades[i + 1] + '<br>' : '+');
		}
		return div;
	};

	legend2.addTo(map);

	clusterBreaks.push(999)
	gg0 = L.geoJson(data, {
		style: function(feature) {
			console.log(data5, feature.properties.FID)
			for (i = 0; i < 6; i ++) {
				var resCt = data5.features[feature.properties.FID].properties.reachable_restaurants.length
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
					$('#ress_info').remove()

					console.log('BUILDING BOUND:',feature)
					bound_res_5(map,feature.properties.FID, data5, data_res)
					updateInfoWindow(feature)
					
				}
			})
		}
	}).addTo(map)

	gg_res.bringToFront()
	// create basic a basic point layer containing all restaurants

}

function color10_ress(gg_res, clusterBreaks, styles, data, data10, data_res, map) {

	var colors = ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"]
	legend2.remove()

	legend2.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend')
		div.innerHTML = '<div id="legend_title"><b>Number of restaurants within 10-min walk distance</b></div>'
			grades = [-1, 4, 11, 24, 39, 56, 77, 'more than 77'],
			labels = [];
		for (var i = grades.length - 2; i >= 0; i--) {
			if (i == grades.length - 2) {
				div.innerHTML += '<i style="background:' + colors[i] + '"></i>'
					+ grades[i +1] + '<br>'
			} else {
				div.innerHTML += '<i style="background:' + colors[i] + '"></i>'
					+ (grades[i] + 1) + (grades[i + 1] ? '&nbsp&ndash;&nbsp' + grades[i + 1] + '<br>' : '+');
			}
		}
		return div;
	};

	legend2.addTo(map);
	clusterBreaks.push(999)
	gg0 = L.geoJson(data, {
		/*style: function() {
			return ({"color": "#999999", "fillColor": "#cccccc","fillOpacity": 1,"weight": 1})
		},*/
		style: function(feature) {
			console.log(data10, feature.properties.FID)
			/*for (i = 0; i < 796; i ++) {
				if (data5.features[i].id == feature.properties.FID) {*/
			for (i = 0; i < 7; i ++) {
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
					$('#ress_info').remove()

					console.log('BUILDING BOUND:',feature)
					bound_res_10(map,feature.properties.FID, data10, data_res)
					updateInfoWindow(feature)
					
				}
			})
		}
	}).addTo(map)

	gg_res.bringToFront()
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

	for (i = 0; i < clusters.length; i ++) {
		clusterBreaks.push(clusters[i][clusters[i].length - 1])
	}
	clusterBreaks.push(9999)
	console.log('Class breaks', clusterBreaks)

	var styles = [{"color": "#000000", "fillColor": "#ffffb2","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fed976","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#feb24c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#fd8d3c","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#f03b20","fillOpacity": '0.95',"weight": 1},
	{"color": "#000000", "fillColor": "#bd0026","fillOpacity": '0.95',"weight": 1},
	]
	var colors = ["#ffffb2", "#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"]

	legend1.onAdd = function (map) {
			
		var div = L.DomUtil.create('div', 'info legend')
		div.innerHTML = '<div id="legend_title"><b>Price per person</b></div>'
			grades = [0, 535, 690, 862.5, 1065, 1310, 1830],
			labels = [];

		for (var i = grades.length - 2; i >= 0; i--) {
			div.innerHTML += '<i style="background:' + colors[i] + '"></i> $'
				+ grades[i] + (grades[i + 1] ? '&nbsp&ndash;&nbsp$' + grades[i + 1] + '<br>' : '+')
		}
		div.innerHTML += '<i style="background:' + '#cccccc' + '"></i>no such floorplan<br>';


		return div;
	};

	legend1.addTo(map);

	gg2 = L.geoJson(data)

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
				var keyL = Object.keys(feature['properties']['Floorplans'])
				for (i = 0; i < keyL.length; i ++) {
					var flpKey = keyL[i]
					if (feature['properties']['Floorplans'][flpKey]['Title'] == radioValue && feature['properties']['Floorplans'][flpKey]['Individual_Average']) {
						var avgPrice = parseFloat(feature['properties']['Floorplans'][flpKey]['Individual_Average']['avg_price'])
						if (isNaN(avgPrice) === false) {
							for (i = 0; i < clusterBreaks.length - 1; i ++) {
								if (parseFloat(avgPrice) > clusterBreaks[i] && (parseFloat(avgPrice) < clusterBreaks[i + 1])) {
									style1 = styles[i]
									return style1
								}
							}
						}
					}
					else if ((feature['properties']['Floorplans'][flpKey]['Title'] == '6 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '7 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '8 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '9 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '10 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '11 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '12 Bedroom(s)' || feature['properties']['Floorplans'][flpKey]['Title'] == '13 Bedroom(s)') && feature['properties']['Floorplans'][flpKey]['Individual_Average']) {
						var avgPrice = parseFloat(feature['properties']['Floorplans'][flpKey]['Individual_Average']['avg_price'])
						if (isNaN(avgPrice) === false) {
							for (i = 0; i < clusterBreaks.length - 1; i ++) {
								if (parseFloat(avgPrice) > clusterBreaks[i] && (parseFloat(avgPrice) < clusterBreaks[i + 1])) {
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
				var stylePass = style1

				if (Object.keys(stylePass).length === 0) {
					var stylePass = {"color": "#999999", "fillColor": "#cccccc","fillOpacity": 1,"weight": 1}
				}
				console.log('passssssss', style1, Object.values(stylePass)[0])
				createInfoPopup(feature, layer, stylePass, radioValue)
			}
		}).addTo(map)
	});

	$('.back_to_menu').on({
		click: function() {
			if (map.hasLayer(gg2)) {
				map.removeLayer(gg2)
			}
			legend1.remove()
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

	$('#unitTT').change(function() {
		var content = ''
		if (this.checked) {
			layer.bindTooltip(simp, {'permanent':true,'direction':'center','opacity':'0.8'})
		} else {
			layer.unbindTooltip()
		}
	})
	
	$(layer).on({
		mouseover: function() {
			layer.openPopup()
			layer.setStyle({color:"#7777ff",weight:2})
		},
		mouseout: function() {
			layer.closePopup()
			layer.setStyle(style)
		},
		click: function() {
			layer.openPopup()
			layer.setStyle({color: "#7777ff"})
			updateInfoWindow(feature)
		}
	})
}

function updateInfoWindow(feature) {
	$('.updatable').remove()
	$('#tb_flp').remove()

	var prt = feature.properties
	var addr = prt.Address
	var name = prt.Name
	//var typeH = prt.Type_of_housing
	var url1 = prt.URL1
	var url2 = prt.URL2
	var flp = prt.Floorplans
	var det = prt.Detailed_type
	var simp = prt.Simplified_type
	var yrB = prt.Year_built
	var popupCntnt = '<p><b>Address:</b> ' + addr + '</p><p><b>Name:</b> ' + name

	var panelCntnt = '<div class="updatable"><p id="updatable-basic"><b>Name: </b>' + name + '</p>'
	+'<p id="updatable-basic"><b>Address: </b>' + addr + '</p>'
	//+'<p id="updatable-basic"><b>Type of housing: </b>' + typeH + '</p>'
	+'<p id="updatable-basic"><b>Type: </b>' + det + '</p>'
	+'<p id="updatable-basic"><b>Year built: </b>' + yrB + '</p>'
	+'<p id="updatable-basic"><b>URL1: </b><br><a href="' + url1 + '">' + url1 + '</a></p>'
	
	if (url2 != '-') {
		panelCntnt += '<p id="updatable-basic"><b>URL2: </b><br><a href="' + url2 + '">' + url2 + '</a></p>'
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
						
				tableC += '<tr id="tb_extra">'/* + '<td>Extra Layout' + ex*/ + '<td>&nbsp&nbsp&nbsp&nbspw/ extra feature: ' + extraTitle + '</td><td>' 
				+ extraPriceStr + '</td><td>' + extraAreaStr + '</td><td>' + extraPPAStr + '</td></tr>'
			}				
		}
	}

	tableC += '</table>'
	$('#price_window').append(panelCntnt)
	$('#price_window').append(tableC)
	$('#res_window').append(panelCntnt)
	$('#campus_window').append(panelCntnt)
}

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

function enableMenuButtons(response, map) {
	// append a series of buttons to '#panel', '#compare' and '#compareResult' interfaces
	$('.back_to_menu').off('click')
	
	$('#menu').append("<p id='title_menu'>UW-Madison Off-Campus Housing Options Exploration Tool</p>")
	$('#menu').append("<p id='intro_menu'>&nbsp&nbsp&nbsp&nbsp&nbspThis web map aims at making off-campus searching experience around UW-Madison campus easier and more complete. Currently this site has 796 apartment records collected from apartment rental websites. This web map enables you to compare prices of different floor plans, and discover each apartment's proximity to campus, surrouding restaurants and bus stops. Click a green button below to start your exploration!</p>")
	$('#menu').append("<p id='title_compare'>Compare<br>_________________________</p>")
	
	// Call price-compare function
	$('#menu').append("<br><button id='price_compare'>Compare Price </button>")
	$('#price_compare').off('click')
	$('#price_compare').on({
		'click': function() {
			console.log('Now comparing prices')
			set_price_window()
			priceSymbols(response, map)
		}
	})

	$('#menu').append("<br><button id='area_compare'>Compare Area<br>(unavailable now)</button>")
	$('#menu').append("<br><button id='ppa_compare'>Compare Price/sqf<br>(unavailable now)</button>")
	
	$('#menu').append("<p id='title_proximity'>Proximities<br>_________________________</p>")
	$('#menu').append("<br><button id='campus_proximity'>To Campus</button>")
	$('#campus_proximity').on({
		'click': function() {
			set_campus_window()
			getUW(response, map)
		}
	})

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
	$('#bus_proximity').on({
		'click': function() {
			set_bus_window()
			getData3(response, map)
		}
	})
	// Only shows '#panel' at the inital stage, '#compare' and '#compareResult' interfaces are fired later upon clicking
	// certain buttons.
	$('#compare').hide()
	$('#compareResult').hide()
}

function busSymbols(data, dataR, dataS, map) {
	if (map.hasLayer(gg2)) {
		gg2.clearLayers()
	}
	console.log('CORRECT!')
	$('#bus_side_window').empty()
	gg_routes = L.geoJson(dataR, {
		onEachFeature(feature, layer) {
			layer.setStyle({'color':'#555555', 'weight':2})
			var window_item = 'Route ' + feature.properties.route_shor 
			+ '</a>  <label><input type="radio" name="routes" value=' 
			+ feature.properties.route_shor + '>Show on map</label>'
			+ '&nbsp&nbsp&nbsp<b>URL:</b> <a href="'+ feature.properties.route_url + '"' + ' target="_blank">Webpage on metro transit<br><br>' 
			$('#bus_side_window').append(window_item)
		}
	}).addTo(map)

	$("input[name='routes']").click(function() {
		map.removeLayer(gg_routes)

		if (map.hasLayer(gg_route_sel)) {
			map.removeLayer(gg_route_sel)
		}

		var radioValue = parseInt($("input[name='routes']:checked").val());
		
		gg_route_sel = L.geoJson(dataR, {
			onEachFeature(feature, layer) {
				if (feature.properties.route_shor == radioValue) {
					console.log('settin')
					layer.setStyle({'color':'#6666dd', 'weight':10, 'opacity': 0.9})
				} else {
					layer.setStyle({'color':'#555555', 'weight':2})
				}
			}
		}).addTo(map)
	})

	gg_stops = L.geoJson(dataS, {
		
		pointToLayer: function(feature, latlng) {
			var stopIcon = new busIcon({iconUrl: 'data/icon/stop3.png'})
			return L.marker(latlng, {icon: stopIcon})
		},
		onEachFeature: function(feature, layer) {
			
			var tooltipContent = '<div>' + feature.properties.Routes + '</div>'

			layer.bindTooltip(tooltipContent, {
				'direction':'top', 'offset':new L.Point(0, -25)
			}).openTooltip()
			layer.on({
				click: function() {
					pass_routes = []
						console.log('Line Properties:', feature.properties.Routes)
					pass_routes = feature.properties.Routes
					updateRoutes(pass_routes, dataR, map)
				}
			})
		}
	}).addTo(map)
	$('.back_to_menu').on({
		click: function() {
			if (map.hasLayer(gg2)) {
				map.removeLayer(gg2)
			}
			if (map.hasLayer(gg_stops)) {
				gg_stops.clearLayers()
			}
			if (map.hasLayer(gg_routes)) {
				gg_routes.clearLayers()
			}
			if (map.hasLayer(gg_route_sel)) {
				gg_route_sel.clearLayers()
			}

			$('#menu').show()
			$('#bus_window').hide()
		}
	})
}

function resetRoutes(dataR, map) {
	if (map.hasLayer(gg_routes)) {
		map.removeLayer(gg_routes)
	}
	gg_routes = L.geoJson(dataR, {
		onEachFeature(feature, layer) {
			layer.setStyle({'color':'#777777', 'weight':2})
		}
	}).addTo(map)
}

function updateRoutes(pass_routes, dataR, map) {
	console.log("PASSSINGG:", pass_routes, dataR)
	if (map.hasLayer(gg_routes)) {
		map.removeLayer(gg_routes)
	}
	if (map.hasLayer(gg_route_sel)) {
		console.log('REMOVING?????', gg_route_sel)
		map.removeLayer(gg_route_sel)
	}
	gg_routes = L.geoJson(dataR, {
		onEachFeature: function(feature,layer) {
			if (pass_routes.includes(feature.properties.route_shor)) {
				console.log('UPDATING????', pass_routes,feature.properties.route_shor)
				layer.setStyle({'color':'#6666dd', 'weight':10, 'opacity': 0.4})
			} else {
				layer.setStyle({'color': '#777777', 'weight':2})
			}
		}
	}).addTo(map)
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

function getData3(data, map) {
	console.log('getting-data',data)
	$.when(ajax_routes(), ajax_stops()).then(function(a1, a2) {
		console.log('DONE', a1)
		console.log(a2)
		busSymbols(data, a1, a2, map)
	})
}

function ajax_routes() {
	return $.ajax("data/routes.geojson", {
		dataType: "json",
		success: function(response) {
			return response
		}
	})
}
function ajax_stops() {
	return $.ajax("data/stops.geojson", {
		dataType: "json",
		success: function(response) {
			return response
		}
	})
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
	$.ajax("data/WITH_to_campus_2.geojson", {
		/* specify the file format the ajax method is to call*/
		dataType: "json",
		success: function(response) {
			//var attributes = processData(response)
			enableMenuButtons(response, map)
			createBaseSymbols(response, map)
		}
	})
}
function getUW(data, map) {
	console.log('UWUWgetting')
	$.ajax("data/uw_landmarks.geojson", {
		/* specify the file format the ajax method is to call*/
		dataType: "json",
		success: function(response) {
			console.log("UW0", response)
			campusSymbols(data, response, map)
		}
	})
}

$(document).ready(createMap);
