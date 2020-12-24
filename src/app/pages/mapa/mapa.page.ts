import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  latitud: number;
  longitud: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

  	let geo: any = this.route.snapshot.paramMap.get('geo');

  	geo = geo.substr(4);
  	geo = geo.split(',');

  	this.latitud  = Number(geo[0]);
  	this.longitud = Number(geo[1]);

  	console.log(this.latitud, this.longitud);

  }

  ngAfterViewInit() {

  	mapboxgl.accessToken = 'pk.eyJ1IjoiZW1hbnVlbGNvcmRvdmEiLCJhIjoiY2sxZDM2andvMDN6cDNkbnRtdGQ1bmZvZiJ9.hC8hwU6RzoZg5vWarvz1pg';
	
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [this.longitud, this.latitud],
		zoom: 11.15
	});

	map.on('load', () => {

		map.resize();

		//Marker
		new mapboxgl.Marker()
			.setLngLat([this.longitud, this.latitud])
			.addTo(map);

		// Insert the layer beneath any symbol layer.
		const layers = map.getStyle().layers;
		 
		let labelLayerId;
		for (let i = 0; i < layers.length; i++) {
			if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
			labelLayerId = layers[i].id;
			break;
			}
		}
		 
		map.addLayer({
			'id': '3d-buildings',
			'source': 'composite',
			'source-layer': 'building',
			'filter': ['==', 'extrude', 'true'],
			'type': 'fill-extrusion',
			'minzoom': 15,
			'paint': {
			'fill-extrusion-color': '#aaa',
			 
			// use an 'interpolate' expression to add a smooth transition effect to the
			// buildings as the user zooms in
			'fill-extrusion-height': [
			'interpolate', ['linear'], ['zoom'],
			15, 0,
			15.05, ['get', 'height']
			],
			'fill-extrusion-base': [
			'interpolate', ['linear'], ['zoom'],
			15, 0,
			15.05, ['get', 'min_height']
			],
			'fill-extrusion-opacity': .6
			}
		}, labelLayerId);
	});



  }

}
