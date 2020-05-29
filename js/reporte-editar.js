/* En el state se va guardando el estado actual de la planilla. 
Cuando se le da guarda se actualiza el state y se envía a la base de datos
via la api. */

var state = {
  encabezado: {},
  objetivo: "",
  reaccion: { kekule: "", smiles: [] },
  reactivos: [],
  seguridad: "",
  equipo: "",
  registros: [],
  productos: [],
  ambiental: {},
  conclusiones: "",
  comentarios: [],
};

// En este objeto se guarda la info del usuario. Tiene una estructura
// de claves equivalente al modelo User en la base de datos
var user = {
  nombre: "Peter",
  apellido: "Cantropus",
  titulo: "Supervisor",
  apodo: "Peter C.",
  teams: [""], //ids de los teams a los que pertenece
  _id: "", //_id del usuario en la base de datos
  fechaRegistro: "23/01/2020",
  foto: "",
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
    .then(function (rawData) {
      var data = cleanData(rawData);
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
  composer.newDoc();
}

// Tabla de reactivos ---------------------------------------------------

function nuevoReactivo() {
  var data = {
    nombre: qs("#nombre-reactivo").value,
    origen: qs("#origen-reactivo").value,
    masa: Number(qs("#masa-reactivo").value),
    pureza: Number(qs("#pureza-reactivo").value),
    pm: Number(qs("#pm-reactivo").value),
    moles: Number(qs("#moles-reactivo").value),
    rm: Number(qs("#rm-reactivo").value),
    limitante: false,
  };
  console.log("nuevo reactivo:", data);
  return data;
}

function generarFilasTabla(reactivos) {
  console.log("voy a mostrar estos reactivos: ", reactivos);
  filas = "";
  for (var i = 0; i < reactivos.length; i++) {
    //
    filas +=
      // "<tr>" +
      // "<td><button onclick='editarReactivo(" +
      // i +
      // ")' class='btn btn-default btn-sm btn-edit-rgnt' id='edit-rgnt-" +
      // i +
      // "'><i class='far fa-edit'></i></button>" +
      // "<button onclick='borrarReactivo(" +
      // i +
      // ")'class='btn btn-default btn-sm btn-del-rgnt' id='del-rgnt-" +
      // i +
      // "'><i class='far fa-trash-alt'></i></button></td>" +
      "<td>" +
      reactivos[i].nombre +
      "</td>" +
      "<td>" +
      reactivos[i].origen +
      "</td>" +
      "<td>" +
      tableNumber(reactivos[i].masa) +
      "</td>" +
      "<td>" +
      tableNumber(reactivos[i].pureza) +
      "</td>" +
      "<td>" +
      tableNumber(reactivos[i].pm) +
      "</td>" +
      "<td>" +
      tableNumber(reactivos[i].moles) +
      "</td>" +
      "<td>" +
      tableNumber(reactivos[i].rm) +
      "</td>" +
      "<td><button onclick='editarReactivo(" +
      i +
      ")' class='btn btn-default btn-sm btn-edit-rgnt' id='edit-rgnt-" +
      i +
      "'><i class='far fa-edit'></i></button>" +
      "<button onclick='borrarReactivo(" +
      i +
      ")'class='btn btn-default btn-sm btn-del-rgnt' id='del-rgnt-" +
      i +
      "'><i class='far fa-trash-alt'></i></button></td>" +
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

function cargarCamposReactivo(r) {
  qs("#nombre-reactivo").value = r.nombre;
  qs("#origen-reactivo").value = r.origen;
  qs("#masa-reactivo").value = r.masa;
  qs("#pureza-reactivo").value = r.pureza;
  qs("#pm-reactivo").value = r.pm;
  qs("#moles-reactivo").value = r.moles;
  qs("#rm-reactivo").value = r.rm;
}

function crearReactivo() {
  state.reactivos.push(nuevoReactivo());
  limpiarCampos("#sec-reactivos");
  qs("#body-tabla-reactivos").innerHTML = generarFilasTabla(state.reactivos);
}

function actualizarReactivo(index) {
  state.reactivos[index] = nuevoReactivo();
  mostrarReactivos();
  limpiarCampos("#sec-reactivos");
  // Vuelvo la funcion del boton a crear nuevo
  qs("#btn-agregar-reactivo").innerText = "Agregar reactivo";
  qs("#btn-agregar-reactivo").setAttribute("onclick", "crearReactivo()");
}

function borrarReactivo(index) {
  console.log("borrando reactivo", state.reactivos[index]);
  // Eliminar reactivo del array
  state.reactivos.splice(index, 1);
  // Regenerar tabla reactivos
  mostrarReactivos();
}

function editarReactivo(index) {
  console.log("editando reactivo", state.reactivos[index]);
  cargarCamposReactivo(state.reactivos[index]);
  qs("#btn-agregar-reactivo").innerText = "Aplicar cambios";
  qs("#btn-agregar-reactivo").setAttribute(
    "onclick",
    "actualizarReactivo(" + index + ")"
  );
  // Cargar este reactivo en los campos de edicion
  // modificar la funcion del boton de guardado para que al clickear
  // actualice la entrada en lugar de crear una nueva
}

// Tabla de productos ---------------------------------------------------

function nuevoProducto() {
  console.log("pureza", qs("#pza-producto").value);
  var data = {
    codigo: qs("#codigo-producto").value,
    descripcion: qs("#descripcion-producto").value,
    cantidad: {
      valor: Number(qs("#cantidad-producto").value),
      unidad: qs("#unidad-cant-prod").value,
    },
    pureza: {
      valor: Number(qs("#pza-producto").value),
      unidad: qs("#unidad-pza-prod").value,
    },
    clase: qs("#clase-producto").value,
    destino: qs("#destino-producto").value,
  };
  console.log("nuevo producto:", data);
  return data;
}

function generarFilasTablaProductos(productos) {
  console.log("voy a mostrar estos productos: ", productos);
  filas = "";
  for (var i = 0; i < productos.length; i++) {
    //
    filas +=
      "<tr>" +
      "<td>" +
      productos[i].codigo +
      "</td>" +
      "<td>" +
      productos[i].descripcion +
      "</td>" +
      "<td>" +
      tableNumber(productos[i].cantidad.valor) +
      " " +
      productos[i].cantidad.unidad +
      "</td>" +
      "<td>" +
      tableNumber(productos[i].pureza.valor) +
      " " +
      productos[i].pureza.unidad +
      "</td>" +
      "<td>" +
      productos[i].clase +
      "</td>" +
      "<td>" +
      productos[i].destino +
      "</td>" +
      "<td><button onclick='editarProducto(" +
      i +
      ")' class='btn btn-default btn-sm btn-edit-rgnt' id='edit-rgnt-" +
      i +
      "'><i class='far fa-edit'></i></button>" +
      "<button onclick='borrarProducto(" +
      i +
      ")'class='btn btn-default btn-sm btn-del-rgnt' id='del-rgnt-" +
      i +
      "'><i class='far fa-trash-alt'></i></button></td>" +
      "</tr>";
  }
  return filas;
}

function cargarCamposProducto(p) {
  qs("#codigo-producto").value = p.codigo;
  qs("#descripcion-producto").value = p.descripcion;
  qs("#cantidad-producto").value = Number(p.cantidad.valor);
  qs("#unidad-cant-prod").value = p.cantidad.unidad;
  qs("#pza-producto").value = Number(p.pureza.valor);
  qs("#unidad-pza-prod").value = p.pureza.unidad;
  qs("#clase-producto").value = p.clase;
  qs("#destino-producto").value = p.destino;
}

function crearProducto() {
  state.productos.push(nuevoProducto());
  mostrarProductos();
  limpiarCampos("#sec-productos");
}

function actualizarProducto(index) {
  state.productos[index] = nuevoProducto();
  mostrarProductos();
  limpiarCampos("#sec-productos");
  // Vuelvo la funcion del boton a crear nuevo
  qs("#btn-agregar-producto").innerText = "Agregar producto";
  qs("#btn-agregar-producto").setAttribute("onclick", "crearProducto()");
}

function borrarProducto(index) {
  console.log("borrando producto", state.productos[index]);
  // Eliminar reactivo del array
  state.productos.splice(index, 1);
  // Regenerar tabla reactivos
  mostrarProductos();
}

function editarProducto(index) {
  console.log("editando producto", state.productos[index]);
  cargarCamposProducto(state.productos[index]);
  qs("#btn-agregar-producto").innerText = "Aplicar cambios";
  qs("#btn-agregar-producto").setAttribute(
    "onclick",
    "actualizarProducto(" + index + ")"
  );
}

// Journal ----------------------------------------------------------------

function nuevoRegistro() {
  var ahora = new Date();
  var datos = leerDatosJournal();
  var muestras = leerMuestrasJournal();
  state.registros.push({
    hora: ahora,
    texto: qs("#registro").value,
    datos: datos,
    muestras: muestras,
    editado: false,
    user: {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      titulo: user.titulo,
      apodo: user.apodo,
    },
  });
  // qs("#registro").value = ""; //limpio el campo
  limpiarCampos("#sec-journal");
  qs("#cont-campos-datos-journal").setAttribute("style", "display: none");
  qs("#btn-toggle-campos-datos-journal").innerText = "Mostrar datos";
  mostrarRegistros();
}

function actualizarRegistro(index) {
  state.registros[index].texto = qs("#comentario").value;
  state.registros[index].editado = true;

  mostrarRegistros();
  limpiarCampos("#sec-journal");

  qs("#btn-agregar-registro").innerText = "Agregar comentario";
  qs("#btn-agregar-registro").setAttribute("onclick", "nuevoRegistro()");
  qs("#cont-campos-datos-journal").setAttribute("style", "display: none");
  qs("#btn-toggle-campos-datos-journal").innerText = "Mostrar datos";
}

function borrarRegistro(index) {
  // Eliminar el registro del array
  state.registros.splice(index, 1);
  // Regenerar lista de registros
  mostrarRegistros();
}

function editarRegistro(index) {
  qs("#registro").value = state.registros[index].texto;
  qs("#btn-agregar-registros").innerText = "Aplicar cambios";
  qs("#btn-agregar-registros").setAttribute(
    "onclick",
    "actualizarComentario(" + index + ")"
  );
}

function leerDatosJournal() {
  var datos = [];
}

function leerMuestrasJournal() {
  var muestras = [];
}

function toggleCamposDatosJournal() {
  var display = qs("#cont-campos-datos-journal").style.display;
  console.log("display:", display);
  if (display === "none") {
    qs("#cont-campos-datos-journal").setAttribute("style", "display: flex");
    qs("#btn-toggle-campos-datos-journal").innerText = "Ocultar datos";
  } else {
    qs("#cont-campos-datos-journal").setAttribute("style", "display: none");
    qs("#btn-toggle-campos-datos-journal").innerText = "Mostrar datos";
  }
}

// Comentarios y discusion ------------------------------------------------

function nuevoComentario() {
  /* Maneja el agregado de una nueva entrada al registro de experimentos
      y agrega una etiqueta de fecha y hora al registro.
  */
  var ahora = new Date();
  state.comentarios.push({
    hora: ahora,
    texto: qs("#comentario").value,
    user: {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      titulo: user.titulo,
      apodo: user.apodo,
    },
  });
  mostrarComentarios();
  limpiarCampos("#sec-comentarios");
}

function actualizarComentario(index) {
  state.comentarios[index].texto = qs("#comentario").value;
  state.comentarios[index].editado = true;
  mostrarComentarios();
  limpiarCampos("#sec-comentarios");
  // Vuelvo la funcion del boton a crear nuevo
  qs("#btn-agregar-comentario").innerText = "Agregar comentario";
  qs("#btn-agregar-comentario").setAttribute("onclick", "nuevoComentario()");
}

function borrarComentario(index) {
  // Eliminar reactivo del array
  state.comentarios.splice(index, 1);
  // Regenerar tabla reactivos
  mostrarComentarios();
}

function editarComentario(index) {
  qs("#comentario").value = state.comentarios[index].texto;
  qs("#btn-agregar-comentario").innerText = "Aplicar cambios";
  qs("#btn-agregar-comentario").setAttribute(
    "onclick",
    "actualizarComentario(" + index + ")"
  );
}

function contenidoCardComentario(index, comentario) {
  var tagEditado = "";
  if (comentario.editado) {
    tagEditado = " (Editado) ";
  }
  return (
    "<div class='card entrada-journal-card'>" +
    "<div class='card-header'>" +
    "<p class='d-flex justify-content-between'>" +
    "<span class='timeStamp'>" +
    fechaHora(comentario.hora) +
    tagEditado +
    " - " +
    comentario.user.apodo +
    " ha comentado: </span>" +
    "<span class='cont-btn-entrada-journal'>" +
    "<button onclick='editarComentario(" +
    index +
    ")' class='btn btn-default btn-sm btn-edit-rgnt'>" +
    "<i class='far fa-edit'></i></button>" +
    "<button onclick='borrarComentario(" +
    index +
    ")'class='btn btn-default btn-sm btn-del-rgnt'>" +
    "<i class='far fa-trash-alt'></i></button>" +
    "</span></p></div>" +
    "<div class='card-body'>" +
    "<p class='journal-entry'>" +
    comentario.texto +
    "</p></div></div>"
  );
}

// Leer campos --------------------------------------------------------------

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

function leerAmbiental() {
  return {
    factorE: qs("#factorE").value,
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
    ambiental: leerAmbiental(),
    productos: state.productos,
    conclusiones: qs("#conclusiones").value,
    comentarios: state.comentarios,
  };
}

// Actualizacion y guardado --------------------------------------------------

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
    .then(function (rawData) {
      var data = cleanData(rawData);
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
    .then(function (rawData) {
      var data = cleanData(rawData);
      state = data.reporte;
      console.log("reloading! nuevo reporte: ", data.reporte);
      console.log("info del proyecto: ", data.proyecto);
      proyecto = data.proyecto;
      mostrarReporte();
      encabezadoModoEdit();
    });
}

// Display

function limpiarCampos(sectionIdQuery) {
  var inputs = qs(sectionIdQuery).getElementsByTagName("input");
  var textareas = qs(sectionIdQuery).getElementsByTagName("textarea");
  console.log("inputs:", inputs);
  console.log("textareas:", textareas);
  if (inputs.length > 0) {
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "text") {
        inputs[i].value = "";
      } else if (inputs[i].type === "number") {
        inputs[i].value = null;
      }
    }
  }
  if (textareas.length > 0) {
    for (var j = 0; j < textareas.length; j++) {
      textareas[j].value = "";
    }
  }
}

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
    "<div class='form-group'><label>Proyecto: </label><select class='form-control' disabled='true' id='num-proyecto'><option value='" +
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

function mostrarReaccion() {
  var molJson = state.reaccion.kekule;
  var rxn = Kekule.IO.loadFormatData(molJson, "Kekule-JSON");
  var smiles = state.reaccion.smiles.join(".");
  painterMolecule2D(rxn);
  qs("#reaccion-smiles").innerText = smiles;
}

function mostrarRegistros() {
  console.log("registros:", state.registros);
  //Muestra los posteos desde el state
  qs("#visor-de-registros").innerHTML = ""; //limpio el visor
  for (var i = 0; i < state.registros.length; i++) {
    qs("#visor-de-registros").innerHTML +=
      "<div class='card entrada-journal-card d-flex'>" +
      "<div class='card-header'>" +
      "<p class='d-flex justify-content-between'>" +
      "<span class='timeStamp'>" +
      fechaHora(state.registros[i].hora) +
      "</span>" +
      "<span class='cont-btn-entrada-journal'>" +
      "<i class='far fa-edit icono-entrada-journal'></i><i class='far fa-trash-alt icono-entrada-journal'>" +
      "</i></span>" +
      "</p>" +
      "</div>" +
      "<div class='card-body'>" +
      "<p class='d-flex justify-content-between'>" +
      "<span class='j-entry-username'>" +
      state.registros[i].user.apodo +
      " : </span>" +
      "</p>" +
      "<p class='journal-entry'>" +
      state.registros[i].texto +
      "</p></div>" +
      "<div class='card-footer d-flex flex-column flex-sm-row justify-content-between'>" +
      "<span class='etiqueta-muestra-journal-footer'><strong style='color: rgb(248, 109, 16);'>Muestra: </strong>435</span>" +
      "<span class='etiqueta-journal-footer'><strong>T: </strong>56.4°C</span>" +
      "<span class='etiqueta-journal-footer'><strong>P: </strong>0.89 bar</span>" +
      "<span class='etiqueta-journal-footer'><strong>V: </strong>546 ml</span>" +
      "<span class='etiqueta-journal-footer'><strong>%Dosificación: </strong>50 %</span>" +
      "</div></div>";
  }
}

function mostrarProductos() {
  qs("#body-tabla-productos").innerHTML = generarFilasTablaProductos(
    state.productos
  );
}

function mostrarReporte() {
  // Muestra el reporte a partir del state
  mostrarEncabezado();
  mostrarCamposUnicos();
  mostrarReactivos();
  mostrarRegistros();
}

function mostrarComentarios() {
  console.log("comentarios:", state.comentarios);
  //Muestra los posteos desde el state
  qs("#visor-de-comentarios").innerHTML = ""; //limpio el visor
  for (var i = 0; i < state.comentarios.length; i++) {
    qs("#visor-de-comentarios").innerHTML += contenidoCardComentario(
      i,
      state.comentarios[i]
    );
  }
}

// function mostrarComentarios() {
//   console.log("comentarios:", state.comentarios);
//   //Muestra los posteos desde el state
//   qs("#visor-de-comentarios").innerHTML = ""; //limpio el visor
//   for (var i = 0; i < state.comentarios.length; i++) {
//     qs("#visor-de-comentarios").innerHTML +=
//       "<div class='card'><div class='card-body'><p class='journal-entry'>" +
//       '<span class="timeStamp">' +
//       fechaHora(state.comentarios[i].hora) +
//       " - " +
//       state.comentarios[i].user.apodo +
//       " ha comentado: </span><br />" +
//       state.comentarios[i].texto +
//       "</p></div></div>";
//   }
// }

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
      if (state.reaccion.smiles.length > 0) {
        mostrarReaccion();
        mostrarComentarios();
        mostrarProductos();
      }
    });
}

function cargarRefDeDB(repId) {
  // Busca un reporte de referencia en la base de datos y lo carga para crear uno nuevo
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
// qs("#btn-agregar-registro").addEventListener("click", function (e) {
//   e.preventDefault();
//   nuevoRegistro();
// });

// Comentarios:
// qs("#btn-agregar-comentario").addEventListener("click", function (e) {
//   e.preventDefault();
//   nuevoComentario();
// });

// Main--------------------------------------------

function setup() {
  var ahora = new Date();
  if (modoEdit) {
    var id = params.get("_id");
    cargarReporteDeDB(id);

    qs("#btn-guardar-estado").setAttribute("style", "display: none");

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
