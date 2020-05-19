/*-------- EDITOR (COMPOSER)----------- */
var composer = new Kekule.Editor.Composer(
  document.getElementById("composer-container")
);

//configuracion:

var appConfig = {
  commonButtons: [
    "newDoc",
    "loadData",
    "undo",
    "copy",
    "cut",
    "paste",
    "zoomIn",
    "reset",
    "zoomOut",
  ],
  chemToolButtons: [
    "manipulate",
    "erase",
    "bond",
    "atom",
    "glyph",
    "formula",
    "ring",
    "charge",
    "textImage"

  ],
};

//Estado, aquí se almacena la info generada:

var appState = {
  docBlocks: 0,
  entries: [],
  molecules: [],
};

composer.setCommonToolButtons(appConfig.commonButtons);
composer.setChemToolButtons(appConfig.chemToolButtons);


composer.setStyleToolComponentNames(["color", "textDirection", "textAlign"]); 
// hide style toolbar totally 
composer.setEnableStyleToolbar(false);

/*---Funciones del Editor--------------------------------*/

// Obtener la info en el editor:

function getFullDocument() {
  //devuelve el objeto completo dibujado en el editor
  var chemDoc = composer.getChemObj();
  console.log(chemDoc);
  return chemDoc;
}

function getAllMolecules() {
  //devuelve un array con todas las moleculas
  var molecules = composer.exportObjs(Kekule.Molecule);
  console.log(molecules);
}

// Renderizado:

function painterMolecule2D(mol) {
  //Dibuja una molecula en 2 dimensiones
  var renderType = Kekule.Render.RendererType.R2D; //R3D  // do 2D or 3D drawing
  // parent element, we will draw inside it
  var mainContainer = document.getElementById("viewer");
  var parentElem = document.getElementById("imagen-reaccion");
  // Esta linea limpia el contenido previo del div.
  Kekule.DomUtils.clearChildContent(parentElem);

  // create painter, bind with molecule
  var painter = new Kekule.Render.ChemObjPainter(renderType, mol);

  // create context inside parentElem
  var dim = Kekule.HtmlElementUtils.getElemOffsetDimension(parentElem); // get width/height of parent element
  console.log(dim);
  var context = painter.createContext(parentElem, dim.width, dim.height); // create context fulfill parent element

  // at last, draw the molecule at the center of context
  painter.draw(context, { x: dim.width / 2, y: dim.height / 2 });
}
