/* En el state se va guardando el estado actual de la planilla. 
Cuando se le da guarda se actualiza el state y se envía a la base de datos
via la api. */

var state = {
  encabezado: {},
  objetivo: "",
  reaccion: { kekule: "", smiles: "" },
  reactivos: [],
  seguridad: "",
  equipo: "",
  registros: [],
  resultados: {},
  ambiental: {},
  conclusiones: "",
};

/* Aquí guardo la info del proyecto al que corresponde el reporte */
var proyecto = {};
var listadoProyectos = [];

/* Config */

var header = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
});

// Parametros URL
var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var modoEdit = params.has("_id");
var modoRepeat = params.has("ref");

/* FUNCIONES----------------------------------------------- */

// Encabezado

function listarProyectos() {
  var miInit = {
    method: "GET",
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/proyectos", miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("La base de datos devolvió estos proyectos:", data);
      qs("#num-proyecto").innerHTML = generarOpcionesProyectos(data);
      listadoProyectos = data; //guardo info de proyectos para funcion de select
    });
}
function generarOpcionesProyectos(proyectos) {
  options = "";
  for (var i = 0; i < proyectos.length; i++) {
    //
    options +=
      "<option value='" +
      proyectos[i].num +
      "'>" +
      proyectos[i].num +
      " - " +
      proyectos[i].nombreProyecto +
      "</option>";
  }
  return options;
}
// Tabla de reactivos

function nuevoReactivo() {
  return {
    nombre: qs("#nombre-reactivo").value,
    origen: qs("#origen-reactivo").value,
    masa: qs("#masa-reactivo").value,
    pureza: qs("#pureza-reactivo").value,
    pm: qs("#pm-reactivo").value,
    moles: qs("#moles-reactivo").value,
    rm: qs("#rm-reactivo").value,
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

function escalarExperimento(factor) {
  console.log(
    "vamos a escalar el experimento por el siguiente factor: ",
    factor
  );
  for (var i = 0; i < state.reactivos.length; i++) {
    if (typeof state.reactivos[i].masa === "number") {
      state.reactivos[i].masa = state.reactivos[i].masa * factor;
    }
    if (typeof state.reactivos[i].moles === "number") {
      state.reactivos[i].moles = state.reactivos[i].moles * factor;
    }
  }
  qs("#body-tabla-reactivos").innerHTML = generarFilasTabla(state.reactivos);
}
// Journal

function nuevoRegistro() {
  /* Maneja el agregado de una nueva entrada al registro de experimentos
      y agrega una etiqueta de fecha y hora al registro.
  */
  var ahora = new Date();
  state.registros.push({ hora: ahora, texto: qs("#registro").value });
  qs("#registro").value = ""; //limpio el campo
  mostrarRegistros();
}

function mostrarRegistros() {
  //Muestra los posteos desde el state
  qs("#visor-de-registros").innerHTML = ""; //limpio el visor
  for (var i = 0; i < state.registros.length; i++) {
    qs("#visor-de-registros").innerHTML +=
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
    numProyecto: qs("#num-proyecto").value,
    numReporte: qs("#num-reporte").value,
    etapa: qs("#etapa").value,
    via: qs("#via").value,
    pmProducto: qs("#pm-producto").value,
    fecha: qs("#fecha").value,
    referencias: qs("#referencias").value,
    autor: qs("#autor").value,
    responsable: qs("#responsable").value,
  };
}

function leerResultados() {
  return {
    masaProducto: qs("#masa-producto").value,
    purezaProducto: qs("#pureza-producto").value,
    masaTeorica: qs("#masa-teorica").value,
    rendimiento: qs("#rendimiento").value,
  };
}

function leerAmbiental() {
  return {
    efsOrganicos: qs("#efluentes-organicos").value,
    efsAcuosos: qs("#efluentes-acuosos").value,
    factorE: qs("#rendimiento").value,
  };
}

function leerTodosLosCampos(noheader = false) {
  /* Actualiza el state con los valores
  de los campos. Notar que reactivos y journal,
  como ellos mismos actualizan el state, quedan como 
  están. */
  var enc;
  if (noheader) {
    enc = state.encabezado;
  } else {
    enc = leerEncabezado();
  }
  return {
    encabezado: enc,
    objetivo: qs("#objetivo").value,
    reaccion: state.reaccion,
    reactivos: state.reactivos,
    seguridad: qs("#seguridad").value,
    equipo: qs("#equipo").value,
    registros: state.registros,
    resultados: leerResultados(),
    ambiental: leerAmbiental(),
    conclusiones: qs("#conclusiones").value,
  };
}

// Reacción:
function saveReaction() {
  // requiere composer.js y kekule!
  var obj = getFullDocument();
  var molJson = Kekule.IO.saveFormatData(obj, "Kekule-JSON");
  //   console.log("Kekule JSON: ", typeof molJson);
  var rxn = Kekule.IO.loadFormatData(molJson, "Kekule-JSON");
  var smiles = Kekule.IO.saveFormatData(rxn, "smi");
  console.log(smiles);
  painterMolecule2D(rxn);
  qs("#reaccion-smiles").innerText = smiles;
  state.reaccion = { kekule: molJson, smiles: smiles.split(".") };
  console.log("Reaccion actualizó el state:", state);
}

// Actualizacion y guardado:

function actualizarState(newReport = true) {
  if (newReport) {
    state = leerTodosLosCampos();
  } else {
    state = leerTodosLosCampos((noheader = true));

    console.log("actualizarState dice: Este es el nuevo state", state);
  }
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
  fetch("http:\\localhost:5000/api/reporte", miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log("se ha creado el siguiente documento: ", data);
      window.location.href = "./reporte-editar.html?_id=" + data._id;
    });
}

function guardarCambios() {
  actualizarState((newReport = false));
  console.log("se va a guardar lo siguiente: ", state);
  var repId = params.get("_id");
  var miInit = {
    method: "PUT",
    body: JSON.stringify(state),
    headers: header,
    mode: "cors",
  };
  fetch("http:\\localhost:5000/api/reporte/" + repId, miInit)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      state = data.reporte;
      console.log("reloading! nuevo reporte: ", data.reporte);
      console.log("info del proyecto: ", data.proyecto);
      proyecto = data.proyecto;
      mostrarReporte();
      encabezadoModoEdit();
    });
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
  //Muestro la info del proyecto
  document.getElementById("proyecto-group").innerHTML =
    "<div class='form-group'><label>Proyecto: </label><select class='form-control' disabled='true'><option value='" +
    +proyecto.num +
    "'>" +
    proyecto.num +
    " - " +
    proyecto.nombreProyecto +
    "</option></select></div>";
  //Muestro info en el título:
  document.getElementById("titulo-reporte-edit").innerText =
    "Reporte nro: " + state.encabezado.numReporte;
  document.getElementById("subtitulo-reporte-edit").innerText =
    "Proyecto: " +
    state.encabezado.numProyecto +
    " - " +
    proyecto.nombreProyecto;
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

function soloCamposRef() {
  console.log("solo campos ref");
  qs("#sec-journal").setAttribute("style", "display: none;");
  qs("#sec-resultados").setAttribute("style", "display: none;");
  qs("#sec-conclusiones").setAttribute("style", "display: none;");
  qs("#chem-editor").setAttribute("style", "display: none;");
}

// Mostrar info en la planilla

function mostrarEncabezado() {
  //Carga campos del encabezado desde el state
  var enc = state.encabezado;
  qs("#num-reporte").value = enc.numReporte;
  qs("#etapa").value = enc.etapa;
  qs("#via").value = enc.via;
  qs("#pm-producto").value = enc.pmProducto;
  qs("#fecha").value = yyyymmdd(new Date(enc.fecha));
  qs("#referencias").value = enc.referencias;
  qs("#autor").value = enc.autor;
  qs("#responsable").value = enc.responsable;
}

function mostrarCamposUnicos() {
  //Carga campos de un solo input/textarea
  qs("#objetivo").value = state.objetivo;
  qs("#reaccion-smiles").value = state.reaccion;
  qs("#seguridad").value = state.seguridad;
  qs("#equipo").value = state.equipo;
  qs("#conclusiones").value = state.conclusiones;
}

function mostrarReactivos() {
  qs("#body-tabla-reactivos").innerHTML = generarFilasTabla(state.reactivos);
}

function mostrarReporte() {
  // Muestra el reporte a partir del state
  mostrarEncabezado();
  mostrarCamposUnicos();
  mostrarReactivos();
  mostrarRegistros();
}

// Recuperar info de la base de datos:

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
    .then(function (rawData) {
      var data = cleanData(rawData);
      state = data.reporte;
      console.log("nuevo reporte de la db: ", data.reporte);
      console.log("info del proyecto: ", data.proyecto);
      proyecto = data.proyecto;
      mostrarReporte();
      encabezadoModoEdit();
    });
}

function cargarRefDeDB(repId) {
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
      proyecto = data.proyecto;
      state.encabezado = data.reporte.encabezado;
      state.encabezado.numReporte = proyecto.reportes + 1;
      //Asignar fecha de hoy
      state.objetivo = data.reporte.objetivo;
      state.reactivos = data.reporte.reactivos;
      state.seguridad = data.reporte.seguridad;
      state.equipo = data.reporte.equipo;
      mostrarReporte();
      encabezadoModoEdit();
      var ahora = new Date();
      state.encabezado = ahora;
      qs("#fecha").value = yyyymmdd(ahora);

      // cargar campos
    });
}

/* EVENTOS----------------------------------------------  */

// Display
qs("#btn-repeat").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "./reporte-editar.html?ref=" + params.get("_id");
});

qs("#btn-toggle-kekule-editor").addEventListener("click", function (e) {
  console.log("click");
  e.preventDefault();
  if (qs("#composer-container").style.display == "none") {
    qs("#composer-container").setAttribute("style", "display: block;");
    qs("#btn-post-rxn").setAttribute("style", "display: inline;");
  } else {
    qs("#composer-container").setAttribute("style", "display: none;");
    qs("#btn-post-rxn").setAttribute("style", "display: none;");
  }
});

// Tabla de reactivos:

qs("#btn-agregar-reactivo").addEventListener("click", function (e) {
  e.preventDefault();
  state.reactivos.push(nuevoReactivo());
  qs("#body-tabla-reactivos").innerHTML = generarFilasTabla(state.reactivos);
});

document
  .getElementById("btn-scale-experiment")
  .addEventListener("click", function (e) {
    e.preventDefault();
    var factor = document.getElementById("scale-factor").value;
    escalarExperimento(factor);
  });

//Reaccion
qs("#btn-post-rxn").addEventListener("click", function (e) {
  saveReaction();
});

// Journal:
qs("#btn-agregar-entrada").addEventListener("click", function (e) {
  e.preventDefault();
  nuevoRegistro();
});

// Main--------------------------------------------

function setup() {
  var ahora = new Date();
  if (modoEdit) {
    var id = params.get("_id");
    cargarReporteDeDB(id);

    qs("#btn-guardar-estado").addEventListener("click", function (e) {
      e.preventDefault();
      guardarCambios();
    });

    qs("#btn-nav-guardar").addEventListener("click", function (e) {
      e.preventDefault();
      guardarCambios();
    });
  } else if (modoRepeat) {
    // Nuevo reporte desde ref
    qs("#btn-repeat").setAttribute("style", "display: none;");
    soloCamposRef();
    cargarRefDeDB(params.get("ref"));
    qs("#btn-guardar-estado").addEventListener("click", function (e) {
      e.preventDefault();
      console.log("llamando a crear reporte");
      crearReporte();
    });
    qs("#btn-guardar-estado").innerText = "Crear Reporte";
    qs("#btn-nav-guardar").setAttribute("style", "display: none;");
  } else {
    // Nuevo reporte
    soloEncabezado();
    listarProyectos();
    state.encabezado = ahora;
    qs("#fecha").value = yyyymmdd(ahora);

    qs("#btn-guardar-estado").addEventListener("click", function (e) {
      e.preventDefault();
      crearReporte();
    });
    qs("#btn-guardar-estado").innerText = "Crear Reporte";
    qs("#btn-nav-guardar").setAttribute("style", "display: none;");
  }
  //Muestro info en el título:
  document.getElementById("titulo-reporte-edit").innerText = "Nuevo Reporte";
}

setup();
