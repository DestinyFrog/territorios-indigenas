class Area {

	constructor(e) {
		this.nome = e.nome
		this.land = e.land
		this.mark = e.mark
	}

	goto(map) {
		map.flyTo(
			this.mark.coordinates,
			this.mark.zoom
		)
	}

	drawArea(map) {
		if ( Array.isArray( this.land.coordinates ) ) {
			L.polygon( this.land.coordinates )
			.setStyle( this.land.style )
			.addTo(map)
		} else {
			
		}
	}

	drawPopup(map) {
		L.popup(this.mark.coordinates, {content: this.nome})
		.openOn(map)
	}

}

var areas = null

var map = L.map('map').setView([0,0], 5)
const selector = document.getElementById("nav-ling")

var idx_mapa_escolhido = 0

var mapas = [
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}),
	L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }),
	L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {maxZoom: 20,attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'}),
	L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',subdomains: 'abcd',maxZoom: 20}),
]

var mapa_atual = mapas[idx_mapa_escolhido]
map.addLayer( mapa_atual )

function changeMap( dir ) {
	idx_mapa_escolhido += dir

	if ( idx_mapa_escolhido >= mapas.length )
	idx_mapa_escolhido = 0

	if ( idx_mapa_escolhido < 0 )
		idx_mapa_escolhido = mapas.length - 1

	map.removeLayer( mapa_atual )
	mapa_atual = mapas[idx_mapa_escolhido]
	map.addLayer( mapa_atual )
}

var arr = []
map.on('click', (e) => {
	var pos = [ e.latlng.lat, e.latlng.lng ]
	arr.push( pos )

	L.marker(pos)
		.addTo(map)

	text = ""
	arr.forEach( ([la,ln]) =>
		text += `[${la},${ln}],\n` )
	console.log( text )
})

map.flyTo( [ -15.7, -47.8 ], 3 )

fetch("./script.json")
.then( response => response.json() )
.then( data => {
	areas = data.map( e => new Area(e) )

	areas.forEach( (e,idx) => {
		e.drawArea(map)
		selector.innerHTML += `<option value="${idx}">${e.nome}</option>`
	} )
} )

document.getElementById("selector").addEventListener('change', (ev) => {
	if ( ev.target.value == "||" ) {
		map.flyTo( [ -15.7, -47.8 ], 3 )
		return
	}

	moveit( ev.target.value )
})

function moveit(id) {
	areas[id].goto(map)
}