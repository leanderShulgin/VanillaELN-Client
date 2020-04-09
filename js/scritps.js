//ESTADO (Contenedor global)
//  esta variabe toma todoslos valores de los datos,
//  estructurados para ser almacenados en un archivo json
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
var codigo = document.getElementById("codigo-proyecto");
var nroEnsayo = document.getElementById("nro-ensayo");
var etapa = document.getElementById("etapa");
var fecha = document.getElementById("fecha");
var referencias = document.getElementById("referencias");
var autor = document.getElementById("autor");
var responsable = document.getElementById("responsable");

var btnEncabezado = document.getElementById("btn-encabezado");

btnEncabezado.addEventListener("click", function (e) {
  e.preventDefault();
  if (codigo.disabled == false) {
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
    codigo: codigo.value,
    nroEnsayo: nroEnsayo.value,
    etapa: etapa.value,
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
  };
}

function limpiarTabla() {
  // vuelve a dejar sólo el encabezado"+"
  bodyTablaReactivos.innerHTMl =
    "<tr><th>Nombre</th>" +
    "<th>Origen</th>" +
    "<th>masa [g]</th>" +
    "<th>Pureza [%p/p]</th>" +
    "<th>PM</th>" +
    "<th>Moles</th>" +
    "<th>RM</th></tr>";
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

// fUNCIONES GENERALES

function fechaHora() {
  var ahora = new Date();
  var hora = ahora.getHours();
  var minutos = ahora.getMinutes();
  var segundos = ahora.getSeconds();
  var dia = ahora.getDate();
  var mes = ahora.getMonth();
  var anio = ahora.getFullYear();
  return (
    dia +
    "-" +
    (mes + 1) +
    "-" +
    anio +
    " " +
    hora +
    ":" +
    minutos +
    ":" +
    segundos
  );
  //   return ahora.toDateString() + " "+ ahora.toTimeString();
}

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

// SAVE STATE

var btnGuardarEstado = document.getElementById("btn-guardar-estado");
btnGuardarEstado.addEventListener("click", function (e) {
  e.preventDefault();
  guardarEstado();
});

// function guardarEstado() {
//   state = leerTodosLosCampos();
//   console.log(state);
// }

function guardarEstado() {
  state = leerTodosLosCampos();
  console.log("se enviará al servidor el siguiente estado: ");
  console.log(state);
  var data = JSON.stringify(state);
  let header = new Headers({
    "Access-Control-Allow-Origin": "",
    "Content-Type": "multipart/form-data",
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
