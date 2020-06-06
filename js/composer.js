/*-------- EDITOR (COMPOSER)----------- */

function crearComposer(container) {
  /*crea una instancia de composer en una variable global
 llamada "composer", la cual debe ser declarada previamente */
  console.log("elemento contenedor:", container);
  var newComposer = new Kekule.Editor.Composer(
    document.querySelector(container)
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
      "textImage",
    ],
  };

  newComposer.setCommonToolButtons(appConfig.commonButtons);
  newComposer.setChemToolButtons(appConfig.chemToolButtons);

  newComposer.setStyleToolComponentNames(["color", "textDirection", "textAlign"]);
  // hide style toolbar totally
  newComposer.setEnableStyleToolbar(false);

  return newComposer;
}

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

function pintarMolecula2D(mol, container) {
  //Dibuja una molecula en 2 dimensiones
  var renderType = Kekule.Render.RendererType.R2D; //R3D  // do 2D or 3D drawing
  // parent element, we will draw inside it
  var mainContainer = document.getElementById(container);
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

// Funciones químicas:

function calcularPM(mol) {
  var flattenMol = mol.getFlattenedShadowFragment(true); // expand all possible subgroups in molecule first
  var totalMass = 0;
  for (var i = 0, l = flattenMol.getNodeCount(); i < l; ++i) {
    var node = flattenMol.getNodeAt(i);
    if (node.getAtomicMass) {
      totalMass += node.getAtomicMass();
    }
    if (node.getImplicitHydrogenCount) {
      var hcount = node.getImplicitHydrogenCount() || 0;
      totalMass += hcount * 1.01;
    }
  }
  return totalMass;
}
