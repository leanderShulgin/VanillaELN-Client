/* En el state se va guardando el estado actual de la planilla. 
Cuando se le da guarda se actualiza el state y se envía a la base de datos
via la api. */

var state = {
  encabezado: {},
  objetivo: "",
  reaccion: "",
  reactivos: [],
  seguridad: "",
  equipo: "",
  registros: [],
  resultados: {},
  ambiental: {},
  conclusiones: "",
};

/* Config */

var header = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
});

// Parametros URL
var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var modoEdit = params.has("_id"); //Si no hay parámetro es que es un nuevo proyecto

/* VARIABLES */

var autor = document.getElementById("autor");
var encabezado = {}; // Aqui almaceno los datos ingresados
var etapa = document.getElementById("etapa");
var fecha = document.getElementById("fecha");
var numProyecto = document.getElementById("num-proyecto");
var numReporte = document.getElementById("num-reporte");
var pmProducto = document.getElementById("pm-producto");
var referencias = document.getElementById("referencias");
var responsable = document.getElementById("responsable");
var via = document.getElementById("via");
// Campos generales
var objetivo = document.getElementById("objetivo");
var reaccion = document.getElementById("reaccion");
var seguridad = document.getElementById("seguridad");
// Tabla de reactivos
var bodyTablaReactivos = document.getElementById("body-tabla-reactivos");
var equipo = document.getElementById("equipo");
var limitante = document.getElementById("limitante");
var masaReactivo = document.getElementById("masa-reactivo");
var molesReactivo = document.getElementById("moles-reactivo");
var nombreReactivo = document.getElementById("nombre-reactivo");
var origenReactivo = document.getElementById("origen-reactivo");
var pmReactivo = document.getElementById("pm-reactivo");
var purezaReactivo = document.getElementById("pureza-reactivo");
var reactivos = []; // Aqui almaceno la tabla de reactivos
var rmReactivo = document.getElementById("rm-reactivo");
var tablaReactivos = document.getElementById("tabla-reactivos");
// Journal
var registro = document.getElementById("registro");
var registros = []; // Aqui se almacenan las entradas!
var visor = document.getElementById("visor-de-registros");
// Resultados
var masaTeo = document.getElementById("masa-teorica");
var mProd = document.getElementById("masa-producto");
var pProd = document.getElementById("pureza-producto");
var rend = document.getElementById("rendimiento");
// Ambiental
var efAc = document.getElementById("efluentes-acuosos");
var efOrg = document.getElementById("efluentes-organicos");
var factorE = document.getElementById("factorE");
// Conclusiones
var conclusiones = document.getElementById("conclusiones");

/* BOTONES */

var btnAgregarReactivo = document.getElementById("btn-agregar-reactivo");
var btnAgregarRegistro = document.getElementById("btn-agregar-entrada");
var btnEncabezado = document.getElementById("btn-encabezado");
var btnGuardarEstado = document.getElementById("btn-guardar-estado");

/* FUNCIONES */

// Encabezado

function toggleBtn(btn, value) {
  // Cambia el aspecto de un botón
  if (value == "on") {
    btn.innerHTML = "Aceptar";
    btn.style.backgroundColor = "rgb(49,55,71)";
    btn.style.color = "rgb(238,236,236)";
  } else {
    btn.innerHTML = "Editar";
    btn.style.backgroundColor = "rgb(238,236,236)";
    btn.style.color = "rgb(49,55,71)";
  }
}

function bloquearEncabezado(trueOrfalse) {
  var inputs = document
    .getElementById("form-encabezado")
    .getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = trueOrfalse;
  }
}

function toggleObjetivo() {
  // Habilita/deshabilita el textarea y cambia e boton
  if (objetivo.disabled === true) {
    objetivo.disabled = false;
    toggleBtn(btnObjetivo, "on");
  } else {
    objetivo.disabled = true;
    toggleBtn(btnObjetivo, "off");
  }
}

function toggleReaccion() {
  // Habilita/deshabilita el textarea y cambia e boton
  if (reaccion.disabled === true) {
    reaccion.disabled = false;
    toggleBtn(btnReaccion, "on");
  } else {
    reaccion.disabled = true;
    toggleBtn(btnReaccion, "off");
  }
}

// Tabla de reactivos

function nuevoReactivo() {
  return {
    nombre: nombreReactivo.value,
    origen: origenReactivo.value,
    masa: masaReactivo.value,
    pureza: purezaReactivo.value,
    pm: pmReactivo.value,
    moles: molesReactivo.value,
    rm: rmReactivo.value,
    limitante: false,
  };
}

function generarFilasTabla(reactivos) {
  console.log("voy a mostrar estos reactivos: ", reactivos);
  filas = "";
  for (var i = 0; i < reactivos.length; i++) {
    //
    filas +=
      "<tr>" +
      "<td>" +
      reactivos[i].nombre +
      "</td>" +
      "<td>" +
      reactivos[i].origen +
      "</td>" +
      "<td>" +
      reactivos[i].masa +
      "</td>" +
      "<td>" +
      reactivos[i].pureza +
      "</td>" +
      "<td>" +
      reactivos[i].pm +
      "</td>" +
      "<td>" +
      reactivos[i].moles +
      "</td>" +
      "<td>" +
      reactivos[i].rm +
      "</td>" +
      "</tr>";
  }
  return filas;
}

function toggleSeguridad() {
  // Habilita/deshabilita el textarea y cambia e boton
  if (seguridad.disabled === true) {
    seguridad.disabled = false;
    toggleBtn(btnSeguridad, "on");
  } else {
    seguridad.disabled = true;
    toggleBtn(btnSeguridad, "off");
  }
}

function toggleEquipo() {
  // Habilita/deshabilita el textarea y cambia e boton
  if (equipo.disabled === true) {
    equipo.disabled = false;
    toggleBtn(btnEquipo, "on");
  } else {
    equipo.disabled = true;
    toggleBtn(btnEquipo, "off");
  }
}

// Journal

function nuevoRegistro() {
  /* Maneja el agregado de una nueva entrada al registro de experimentos
      y agrega una etiqueta de fecha y hora al registro.
  */
  var ahora = new Date();
  state.registros.push({ hora: ahora, texto: registro.value });
  registro.value = ""; //limpio el campo
  mostrarRegistros();
}

function mostrarRegistros() {
  //Muestra los posteos desde el state
  visor.innerHTML = ""; //limpio el visor
  for (var i = 0; i < state.registros.length; i++) {
    visor.innerHTML +=
      "<p>" +
      '<span class="timeStamp">' +
      state.registros[i].hora +
      " | </span>" +
      state.registros[i].texto +
      "</p>";
  }
}

// Leer campos:

function leerEncabezado() {
  return {
    numProyecto: numProyecto.value,
    numReporte: numReporte.value,
    etapa: etapa.value,
    via: via.value,
    pmProducto: pmProducto.value,
    fecha: fecha.value,
    referencias: referencias.value,
    autor: autor.value,
    responsable: responsable.value,
  };
}

function leerResultados() {
  return {
    masaProducto: mProd.value,
    purezaProducto: pProd.value,
    masaTeorica: masaTeo.value,
    rendimiento: rend.value,
  };
}

function leerAmbiental() {
  return {
    efsOrganicos: efOrg.value,
    efsAcuosos: efAc.value,
    factorE: factorE.value,
  };
}

function leerTodosLosCampos() {
  /* Actualiza el state con los valores
  de los campos. Notar que reactivos y journal,
  como ellos mismos actualizan el state, quedan como 
  están. */
  return {
    encabezado: leerEncabezado(),
    objetivo: objetivo.value,
    reaccion: reaccion.value,
    reactivos: state.reactivos,
    seguridad: seguridad.value,
    equipo: equipo.value,
    registros: state.registros,
    resultados: leerResultados(),
    ambiental: leerAmbiental(),
    conclusiones: conclusiones.value,
  };
}

// Actualizacion y guardado:

function actualizarState() {
  state = leerTodosLosCampos();
  console.log("Nuevo State: ", state);
}

function crearReporte() {
  actualizarState();
  console.log("se va a guardar lo siguiente: ", state);
  var miInit = {
    method: "POST",
    body: JSON.stringify(state),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/reporte", miInit).then((response) => {
    console.log(response);
  });
}

function guardarCambios() {
  actualizarState();
  console.log("se va a guardar lo siguiente: ", state);
  var repId = params.get("_id");
  var miInit = {
    method: "PUT",
    body: JSON.stringify(state),
    headers: header,
    mode: "cors",
  };
  //Cambiar la URL por reporte/proyecto&reporte
  fetch("http:\\localhost:5000/api/reporte/" + repId, miInit).then(
    (response) => {
      console.log(response);
    }
  );
}

// Display

function encabezadoModoEdit() {
  //Deshabilito los campos del encabezado
  var campos = document
    .getElementById("sec-encabezado")
    .getElementsByTagName("input");

  for (var i = 0; i < campos.length; i++) {
    campos[i].disabled = true;
  }
  //Oculto los campos de proyecto
  document
    .getElementById("proyecto-group")
    .setAttribute("style", "display: none;");
  document
    .getElementById("reporte-group")
    .setAttribute("style", "display: none;");
  //Muestro info en el título:
  document.getElementById("titulo-reporte-edit").innerText =
    "Reporte nro: " + state.encabezado.numReporte;
  document.getElementById("subtitulo-reporte-edit").innerText =
    "Proyecto nro: " + state.encabezado.numProyecto;
}

function soloEncabezado() {
  var secciones = document.getElementsByTagName("section");
  var secId = "";
  for (var i = 0; i < secciones.length; i++) {
    if (secciones[i].getAttribute("id") != "sec-encabezado") {
      console.log(secciones[i].getAttribute("id"));
      secciones[i].setAttribute("style", "display: none;");
    }
  }
}

// Mostrar info en la planilla

function mostrarEncabezado() {
  //Carga campos del encabezado desde el state
  var enc = state.encabezado;
  numProyecto.value = enc.numProyecto;
  numReporte.value = enc.numReporte;
  etapa.value = enc.etapa;
  via.value = enc.via;
  pmProducto.value = enc.pmProducto;
  fecha.value = enc.fecha;
  referencias.value = enc.referencias;
  autor.value = enc.autor;
  responsable.value = enc.responsable;
}

function mostrarCamposUnicos() {
  //Carga campos de un solo input/textarea
  objetivo.value = state.objetivo;
  reaccion.value = state.reaccion;
  seguridad.value = state.seguridad;
  equipo.value = state.equipo;
  conclusiones.value = state.conclusiones;
}

function mostrarReactivos() {
  bodyTablaReactivos.innerHTML = generarFilasTabla(state.reactivos);
}

function mostrarReporte() {
  // Muestra el reporte a partir del state
  mostrarEncabezado();
  mostrarCamposUnicos();
  mostrarReactivos();
  mostrarRegistros();
}

function cargarReporteDeDB(repId) {
  // Busca un reporte en la base de datos, lo carga en el state
  // y lo muestra en la página.
  var miInit = {
    method: "GET",
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/reporte/" + repId, miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      state = data;
      console.log("nuevo state: ", data);
      mostrarReporte();
      encabezadoModoEdit();
    });
}

/* EVENTOS */

btnAgregarReactivo.addEventListener("click", function (e) {
  e.preventDefault();
  state.reactivos.push(nuevoReactivo());
  bodyTablaReactivos.innerHTML = generarFilasTabla(state.reactivos);
});

btnAgregarRegistro.addEventListener("click", function (e) {
  e.preventDefault();
  nuevoRegistro();
});

// Main

function main() {
  if (modoEdit) {
    var id = params.get("_id");
    console.log("Se va a cargar el reporte con _id:" + id);
    cargarReporteDeDB(id);
    btnGuardarEstado.addEventListener("click", function (e) {
      e.preventDefault();
      guardarCambios();
    });
  } else {
    // Nuevo reporte
    soloEncabezado();
    btnGuardarEstado.addEventListener("click", function (e) {
      e.preventDefault();
      crearReporte();
    });
    btnGuardarEstado.innerText = "Crear Reporte";
  }
  //Muestro info en el título:
  document.getElementById("titulo-reporte-edit").innerText = "Nuevo Reporte";
}

main();
