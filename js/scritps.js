// FUNCIONALIDADES GENERALES PARA USAR EN TODAS LAS VISTAS

function fechaHora(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  var hora = ("0" + date.getHours()).slice(-2);
  var minutos = ("0" + date.getMinutes()).slice(-2);
  var segundos = ("0" + date.getSeconds()).slice(-2);
  var dia = ("0" + (date.getDate() + 1)).slice(-2);
  var mes = ("0" + (date.getMonth() + 1)).slice(-2);
  var anio = date.getFullYear();
  return (
    dia + "-" + mes + "-" + anio + " " + hora + ":" + minutos + ":" + segundos
  );
  //   return ahora.toDateString() + " "+ ahora.toTimeString();
}

function yyyymmdd(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  ("0" + (date.getMonth() + 1)).slice(-2);
  var dia = ("0" + (date.getDate() + 1)).slice(-2);
  // var dia = date.getDate();
  var mes = ("0" + (date.getMonth() + 1)).slice(-2);
  var anio = date.getFullYear();
  return anio + "-" + mes + "-" + dia;
  //   return date.toDateString() + " "+ date.toTimeString();
}

function cleanData(rawData) {
  // si el valor es undefined o null lo cambia a string vacia
  // aprovecha el parametro "replace" de JSON.stringify
  var cleanData = JSON.stringify(rawData, function (key, value) {
    if (value == null || String(value) == "undefined") {
      return "";
    }
    return value;
  });
  return JSON.parse(cleanData);
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

function tableNumber(number) {
  // Convierte nro en string formateada
  if (typeof number == "number") {
    if (number > 0.1) {
      return number.toFixed(2);
    } else if (number === 0) {
      return "";
    } else {
      return number.toExponential(2);
    }
  } else {
    return "";
  }
}

function qs(query) {
  //shorthand para querySelector
  return document.querySelector(query);
}

function qsa(query) {
  //shorthand para querySelectorAll
  return document.querySelectorAll(query);
}
