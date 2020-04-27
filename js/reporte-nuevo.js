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
var btnEquipo = document.getElementById("btn-equipo");
var btnGuardarEstado = document.getElementById("btn-guardar-estado");
var btnObjetivo = document.getElementById("btn-objetivo");
var btnReaccion = document.getElementById("btn-reaccion");
var btnSeguridad = document.getElementById("btn-seguridad");

/* FUNCIONES */

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

function nuevoRegistro() {
  /* Maneja el agregado de una nueva entrada al registro de experimentos
      y agrega una etiqueta de fecha y hora al registro.
  */
  var ahora = new Date();
  state.registros.push({ hora: ahora, texto: registro.value });
  visor.innerHTML = ""; //limpio el visor
  registro.value = ""; //limpio el campo
  for (var i = 0; i < state.registros.length; i++) {
    // regenero los posteos desde registros:
    visor.innerHTML +=
      "<p>" +
      '<span class="timeStamp">' +
      state.registros[i].hora +
      " | </span>" +
      state.registros[i].texto +
      "</p>";
  }
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
  return {
    encabezado: leerEncabezado(),
    objetivo: objetivo.value,
    reaccion: reaccion.value,
    reactivos: reactivos,
    seguridad: seguridad.value,
    equipo: equipo.value,
    registros: registros,
    resultados: leerResultados(),
    ambiental: leerAmbiental(),
    conclusiones: conclusiones.value,
  };
}

function actualizarState() {
  state = leerTodosLosCampos();
  console.log("Nuevo State: ", state);
}

function guardar() {
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

function createProyecto(state) {
  // Levanta la info de los campos y crea un nuevo doc en la base de datos
  state = leerTodosLosCampos();
  console.log("se enviará al servidor el siguiente estado: ");
  console.log(state);
  var miInit = {
    method: "POST",
    body: JSON.stringify(state),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyecto", miInit).then((response) => {
    console.log("respuesta del servidor: ", response);
  });
}

/* EVENTOS */

btnReaccion.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.reaccion = reaccion.value;
  // Cambiar boton:
  toggleReaccion();
});

btnObjetivo.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.objetivo = objetivo.value;
  // Cambiar boton:
  toggleObjetivo();
});

btnAgregarReactivo.addEventListener("click", function (e) {
  e.preventDefault();
  reactivos.push(nuevoReactivo());
  bodyTablaReactivos.innerHTML = generarFilasTabla(reactivos);
});

btnEncabezado.addEventListener("click", function (e) {
  e.preventDefault();
  if (numProyecto.disabled == false) {
    //nuevo reporte
    guardar();
    bloquearEncabezado(true);
    toggleBtn(btnEncabezado, "off");
  } else {
    //Edicion
    bloquearEncabezado(false);
    toggleBtn(btnEncabezado, "on");
  }
});

btnSeguridad.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.seguridad = reaccion.value;
  // Cambiar boton:
  toggleSeguridad();
});

btnEquipo.addEventListener("click", function (e) {
  e.preventDefault();
  // Salvar estado:
  state.equipo = reaccion.value;
  // Cambiar boton:
  toggleEquipo();
});

btnAgregarRegistro.addEventListener("click", function (e) {
  e.preventDefault();
  nuevoRegistro();
});

btnGuardarEstado.addEventListener("click", function (e) {
  e.preventDefault();
  guardar(state);
});
