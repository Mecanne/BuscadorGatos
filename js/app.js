/*jshint esversion: 6 */
const APIKEY = '7dda2217-17eb-4040-bcd7-29454ff397ab';
const URL_BUSQUEDA = 'https://api.thecatapi.com/v1/images/search?';
const URL_CATEGORIAS = 'https://my-json-server.typicode.com/DWEC-18-19/TheCatApi/categorias';
const botonBuscar = document.getElementById('botonBuscar');

var pagina = 0;
var cantidadPaginas;
var cantidadImagenes = 0;

botonBuscar.addEventListener('click',() => {
    var url = URL_BUSQUEDA;
    var page = pagina;
    var limit = document.getElementById('limit').value;
    var order = 'Asc';
    var id = document.getElementById('opciones').value;
    url += 'page=' + page + '&limit=' + limit + '&order=' + order + '&category_ids=' + id;
    requestJSON(url).then(
        mostrarImagenes,
        errorHandler
    );
});

function requestJSON(url) {
    return new Promise(function (resolve, reject) {
        var xhtml = new XMLHttpRequest();
        xhtml.open('GET', url, true);
        xhtml.setRequestHeader("x-api-key", APIKEY);
        xhtml.onreadystatechange = function () {
            if (xhtml.status == 200) {
                cantidadImagenes = xhtml.getResponseHeader('Pagination-Count');
                cantidadPaginas = Math.ceil(cantidadImagenes / document.getElementById('limit').value);
                var response = xhtml.responseText;
                resolve(JSON.parse(response));
            } else {
                reject(xhtml.readyState + ',' + xhtml.status);
            }
        };
        xhtml.onerror = function () {
            reject(xhtml.readyState + ',' + xhtml.status);
        };
        xhtml.send();
    });
}

function mostrarOpciones(data) {
    var select = document.getElementById('opciones');
    for (let i = 0; i < data.length; i++) {
        var opcion = document.createElement('option');
        opcion.value = data[i].id;
        opcion.textContent = data[i].name;
        select.appendChild(opcion);
    }
}

function mostrarImagenes(data){
    limpiarImagenes();
    var caja = document.getElementById('imagenes');
    for (let i = 0; i < data.length; i++) {
        // Creamos la columna
        var cajaColumna = document.createElement('div');
        cajaColumna.classList.add('column');
        // Creamos el segment
        var cajaSegment = document.createElement('div');
        cajaSegment.classList.add('ui');
        cajaSegment.classList.add('segment');
        // Cremaos la imagen
        var img = document.createElement('img'); 
        // Le añadimos las clases a las imagenes.
        img.classList.add('ui');
        img.classList.add('image');
        img.classList.add('rounded');
        // Le asignamos la url
        img.src = data[i].url;
        cajaSegment.appendChild(img);
        cajaColumna.appendChild(cajaSegment);
        caja.appendChild(cajaColumna);
    }
    console.log('La cantidad de imagenes que hay en esta categoria es ' + cantidadImagenes + ', por lo que debe tener ' + cantidadPaginas + ' paginas.');
}

function limpiarImagenes(){
    var caja = document.getElementById('imagenes');
    while(caja.hasChildNodes()){
        caja.childNodes[0].remove();
    }
}

function errorHandler(codigoEstado) {
    console.log('Fallo: ' + codigoEstado);
}


requestJSON(URL_CATEGORIAS).then(
    mostrarOpciones,
    errorHandler
);