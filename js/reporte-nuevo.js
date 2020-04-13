var state = {
  encabezado: {},
  objetivo: "",
  reaccion: "",
  reactivos: [],
  seguridad: "",
  equipo: "",
  journal: [],
  resultados: {},
  ambiental: {},
  conclusiones: "",
};

// INFO GENERAL (ENCABEZADO)

// Variables
var encabezado = {}; // Aqui almaceno los datos ingresados
var idProyecto = document.getElementById("id-proyecto");
var idReporte = document.getElementById("id-reporte");
var etapa = document.getElementById("etapa");
var fecha = document.getElementById("fecha");
var referencias = document.getElementById("referencias");
var autor = document.getElementById("autor");
var responsable = document.getElementById("responsable");
var pmProducto = document.getElementById("pm-producto");
var via = document.getElementById("via");

var btnEncabezado = document.getElementById("btn-encabezado");

btnEncabezado.addEventListener("click", function (e) {
  e.preventDefault();
  if (idProyecto.disabled == false) {
    bloquearEncabezado(true);
    state.encabezado = leerEncabezado();
    toggleBtn(btnEncabezado, "off");
  } else {
    bloquearEncabezado(false);
    toggleBtn(btnEncabezado, "on");
  }
});

function leerEncabezado() {
  return {
    idProyecto: idProyecto.value,
    idReporte: idReporte.value,
    etapa: etapa.value,
    via: via.value,
    pmProducto: pmProducto.value,
    fecha: fecha.value,
    referencias: referencias.value,
    autor: autor.value,
    responsable: responsable.value,
  };
}

function bloquearEncabezado(trueOrfalse) {
  var inputs = document
    .getElementById("form-encabezado")
    .getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = trueOrfalse;
  }
}

// OBJETIVO-----------------------------
// variables
var objetivo = document.getElementById("objetivo");
var btnObjetivo = document.getElementById("btn-objetivo");

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

btnObjetivo.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.objetivo = objetivo.value;
  // Cambiar boton:
  toggleObjetivo();
});

// REACCION-----------------------------

// variables
var reaccion = document.getElementById("reaccion");
var btnReaccion = document.getElementById("btn-reaccion");

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

btnReaccion.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.reaccion = reaccion.value;
  // Cambiar boton:
  toggleReaccion();
});

// REACTIVOS-----------------------------

// variables
var reactivos = []; // Aqui almaceno la tabla de reactivos
var tablaReactivos = document.getElementById("tabla-reactivos");
var bodyTablaReactivos = document.getElementById("body-tabla-reactivos");
var nombreReactivo = document.getElementById("nombre-reactivo");
var origenReactivo = document.getElementById("origen-reactivo");
var masaReactivo = document.getElementById("masa-reactivo");
var purezaReactivo = document.getElementById("pureza-reactivo");
var pmReactivo = document.getElementById("pm-reactivo");
var molesReactivo = document.getElementById("moles-reactivo");
var rmReactivo = document.getElementById("rm-reactivo");
var limitante = document.getElementById("limitante");
var btnAgregarReactivo = document.getElementById("btn-agregar-reactivo");

// eventos y funciones
btnAgregarReactivo.addEventListener("click", function (e) {
  e.preventDefault();
  reactivos.push(nuevoReactivo());
  bodyTablaReactivos.innerHTML = generarFilasTabla(reactivos);
});

function nuevoReactivo() {
  return {
    nombre: nombreReactivo.value,
    origen: origenReactivo.value,
    masa: masaReactivo.value,
    pureza: purezaReactivo.value,
    pm: pmReactivo.value,
    moles: molesReactivo.value,
    rm: rmReactivo.value,
    limitante: limitante.value,
  };
}

function generarFilasTabla(reactivos) {
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

// SEGURIDAD---------------------------------------
// variables
var seguridad = document.getElementById("seguridad");
var btnSeguridad = document.getElementById("btn-seguridad");

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

btnSeguridad.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.seguridad = reaccion.value;
  // Cambiar boton:
  toggleSeguridad();
});

// EQUIPO------------------------------------------
// variables
var equipo = document.getElementById("equipo");
var btnEquipo = document.getElementById("btn-equipo");

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

btnEquipo.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.equipo = reaccion.value;
  // Cambiar boton:
  toggleEquipo();
});

// JOURNAL (Registro del experimento)--------------

// variables
var registros = []; // Aqui se almacenan las entradas!
var visor = document.getElementById("visor-de-registros");
var registro = document.getElementById("registro");
var btnAgregarRegistro = document.getElementById("btn-agregar-entrada");

// PrevenDefault para el botón de submit del form:
btnAgregarRegistro.addEventListener("click", function (e) {
  e.preventDefault();
  handleNuevoRegistro();
});

function handleNuevoRegistro() {
  /* Maneja el agregado de una nueva entrada al registro de experimentos
      y agrega una etiqueta de fecha y hora al registro.
  */
  var ahora = fechaHora();
  registros.push({ hora: ahora, texto: registro.value });
  visor.innerHTML = "";
  registro.value = "";
  for (var i = 0; i < registros.length; i++) {
    visor.innerHTML +=
      "<p>" +
      '<span class="timeStamp">' +
      registros[i].hora +
      " | </span>" +
      registros[i].texto +
      "</p>";
  }
}

// RESULTADOS -----------------------------------

// variables

var mProd = document.getElementById("masa-producto");
var pProd = document.getElementById("pureza-producto");
var masaTeo = document.getElementById("masa-teorica");
var rend = document.getElementById("rendimiento");

function leerResultados() {
  return {
    masaProducto: mProd.value,
    purezaProducto: pProd.value,
    rendimiento: rend.value,
  };
}

// AMBIENTAL ------------------------------------

// variables

var efOrg = document.getElementById("efluentes-organicos");
var efAc = document.getElementById("efluentes-acuosos");
var factorE = document.getElementById("factorE");

function leerAmbiental() {
  return {
    efluentesOrganicos: efOrg.value,
    efluentesAcuosos: efAc.value,
  };
}

// CONCLUSIONES
var conclusiones = document.getElementById("conclusiones");


function leerTodosLosCampos() {
  return {
    encabezado: leerEncabezado(),
    objetivo: objetivo.value,
    reaccion: reaccion.value,
    reactivos: reactivos,
    seguridad: seguridad.value,
    equipo: equipo.value,
    journal: registros,
    resultados: leerResultados(),
    ambiental: leerAmbiental(),
    conclusiones: conclusiones.value,
  };
}

var btnGuardarEstado = document.getElementById("btn-guardar-estado");
btnGuardarEstado.addEventListener("click", function (e) {
  e.preventDefault();
  guardarEstado(state);
});

function guardarEstado(state) {
  state = leerTodosLosCampos();
  console.log("se enviará al servidor el siguiente estado: ");
  console.log(state);
  var data = JSON.stringify(state);
  let header = new Headers({
    "Access-Control-Allow-Origin": "",
    "Content-Type": "application/json",
  });
  var miInit = {
    method: "POST",
    body: JSON.stringify(data),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/reporte", miInit).then((response) => {
    console.log(response);
  });
}

function cargarArchivoJSON(archivoJSON) {
  //lee un archivo json y devuelve un objeto js
  fetch(archivoJSON).then((data) => {
    console.log("data cargada del json");
    return data;
  });
}

function cargarData(archivoJSON) {
  //Toma un objeto js con el contenido de un reporte
  //y los carga en la interfaz de lectura:
  console.log("se va a cargar el archivo json");
  var data = cargarArchivoJSON(archivoJSON);
  console.log("Se ha cargado la data");
  console.log(data);
}
