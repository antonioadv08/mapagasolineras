class UI {
  constructor() {
    //instanciar la API
    this.api = new API();

    //crear los markers con layerGroup
    this.markers = new L.LayerGroup();
    // Iniciar el mapa
    this.mapa = this.inicializarMapa();
  }

  inicializarMapa() {
    // Inicializar y obtener la propiedad del mapa
    const map = L.map("mapa").setView([22.273896, -100.135125], 5);
    const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; " + enlaceMapa + " Contributors",
      maxZoom: 18
    }).addTo(map);
    return map;
  }

  mostrarEstablecimientos() {
    this.api.obtenerDatos().then(datos => {
      const resultado = datos.respuestaJSON.results;

      //ejecutar la funcion para mostrar los puntos en el mapa
      this.mostrarPines(resultado);
    });
  }

  mostrarPines(datos) {
    //limpiar los markers
    this.markers.clearLayers();
    //recorrer los establecimientos
    datos.forEach(dato => {
      //destructuring
      const { latitude, longitude, calle, regular, premium } = dato;

      //crear popup
      const opcionesPopUp = L.popup().setContent(`
      <p>Calle: ${calle}</p>
<p><b>Regular:</b> $ ${regular}</p>
<p><b>Premium:</b> $ ${premium}</p>



`);

      //agregar el pin
      const marker = new L.marker([
        parseFloat(latitude),
        parseFloat(longitude)
      ]).bindPopup(opcionesPopUp);
      this.markers.addLayer(marker);
    });

    this.markers.addTo(this.mapa);
  }

  //buscador
  obtenerSugerencias(busqueda) {
    this.api.obtenerDatos().then(datos => {
      //obtener los datos
      const resultados = datos.respuestaJSON.results;

      //enviar el JSON y la busqueda para el filtrado
      this.filtrarSugerencias(resultados, busqueda);
    });
  }
  //filtra las sugerencias en base al input

  filtrarSugerencias(resultado, busqueda) {
    //filtrar con .filter
    const filtro = resultado.filter(
      filtro => filtro.calle.toLowerCase().indexOf(busqueda) !== -1
    );

    //mostrar los pines
    this.mostrarPines(filtro)
  }
}
