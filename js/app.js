/*jshint esversion: 6 */
// Key para poder acceder a la CAT-API
const APIKEY = '7dda2217-17eb-4040-bcd7-29454ff397ab';
// Url para comenzar la busqueda
const URL_BUSQUEDA = 'https://api.thecatapi.com/v1/images/search?';
// Url para conseguir las categorias
const URL_CATEGORIAS = 'https://my-json-server.typicode.com/DWEC-18-19/TheCatApi/categorias';

// Boton para la busqueda.
const botonBuscar = document.getElementById('botonBuscar');

// Pagina para buscar, por defecto 0.
var pagina = 0;
// Cantidad maxima de paginas
var cantidadPaginas;
// Cantidad de imagenes en total de cada categoria
var cantidadImagenes = 0;

// Funcion manejador para buscar las imagenes.
const manejadorBusqueda = function () {
    // Reseteamos la pagina
    pagina = 0;
    // Cogemos la url de busqueda
    var url = URL_BUSQUEDA;
    // La pagina en la que vamos a buscar
    var page = pagina;
    // Cantidad de imagenes a cargar
    var limit = document.getElementById('limit').value;
    // Orden de busuqueda
    var order = 'Asc';
    // Id de la categoria
    var id = document.getElementById('opciones').value;
    // Creamos la url especifica para la peticion
    url += 'page=' + page + '&limit=' + limit + '&order=' + order + '&category_ids=' + id;
    // Hacemos la peticion.
    requestJSON(url).then(
        mostrarImagenes,
        errorHandler
    );
};

// Funcion para el boton que vuelve a la primera pagina
const manejadorPrimera = function () {
    // Solo podremos volver a la primera pagina si esta no es mayor a 0, es decir, si no estamos en ella
    if (pagina > 0) {
        pagina = 0;
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
    }
};

// Funcion para el boton que vuelve a la pagina anterior.
const manejadorAnterior = function () {
    // Solo podremos volver a la pagina anterror si en la que estamos no es mayor a 0, es decir, si no estamos en la primera
    if (pagina > 0) {
        pagina--;
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
    }
};

// Funcion para el boton que avanza a la siguiente pagina.
const manejadorSiguiente = function () {
    // Solo podremos volver a la pagina siguiente si esta es menor que el total de paginas, es decir, si no estamos en la ultima.
    if (pagina < cantidadPaginas) {
        pagina++;
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
    }
};

// Funcion para el boton que avanza a la ultima pagina.
const manejadorUltima = function () {
    // Solo podremos acceder a la ultima pagina si no estamos en ella
    if( pagina < cantidadPaginas){
        pagina = cantidadPaginas;
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
    }
};

// Añadimos el manejador al boton de busqueda.
botonBuscar.addEventListener('click', manejadorBusqueda);

/**
 * Funcion para realizar una consulta
 * @param {string} url Url para realizar la consulta
 */
function requestJSON(url) {
    // Devolvemos una nueva promesa
    return new Promise(function (resolve, reject) { // Creamos la promesa
        // Creamos la instancia del objeto XMLHttpRequest para poder hacer la consulta.
        var xhtml = new XMLHttpRequest();
        // Creamos la peticion.
        xhtml.open('GET', url, true);
        // Establecemos el header "x-api-key" con el contenido de la APIKEY para poder acceder a la CAT-API
        xhtml.setRequestHeader("x-api-key", APIKEY);
        
        xhtml.onreadystatechange = function () {
            // Si el estado es 200, es que se ha realizado correctamente la peticion.
            if (xhtml.status == 200) {
                // Guardamos la cantidad de paginas
                cantidadImagenes = xhtml.getResponseHeader('Pagination-Count');
                // Si el resto entre la cantidad de imagenes totales que hay y el limit que hemos establecido
                // es 0, debemos mostrar una pagina menos ya que empiezan por 0 y la ultima pagina seria una pagina vacia.
                if(cantidadImagenes % document.getElementById('limit').value == 0){
                    cantidadPaginas = Math.floor(cantidadImagenes / document.getElementById('limit').value) - 1;
                }
                // Si no calculamos la diferencia y esa será la cantidad de paginas.
                else{
                    cantidadPaginas = Math.floor(cantidadImagenes / document.getElementById('limit').value);
                }
                // Cogemos la respuesta de la peticion
                var response = xhtml.responseText;
                // Devolvemos la respuesta 
                resolve(JSON.parse(response));
            } 
            // Si no se ha podido realizar la peticion
            else {
                // Devolvemos un mesnaje de texto como error, indicando el estado de la peticion.
                reject(xhtml.readyState + ',' + xhtml.status);
            }
        };
        // Si da error la peticion. devolvemos un mensaje de error
        xhtml.onerror = function () {
            reject(xhtml.readyState + ',' + xhtml.status);
        };
        // Enviamos la peticion.
        xhtml.send();
    });
}

/**
 * Funcion que actualiza el select y añade las opciones para la busqueda de gatos
 * @param {array} data Array que contiene las opciones para al busqueda de gatos
 */
function mostrarOpciones(data) {
    // Cogemos el elemento select
    var select = document.getElementById('opciones');
    // Por cada elemento del array data añadimos una opcion.
    for (let i = 0; i < data.length; i++) {
        var opcion = document.createElement('option');
        opcion.value = data[i].id;
        opcion.textContent = data[i].name;
        select.appendChild(opcion);
    }
}

/**
 * Funcion para crear las imagenes de los gatos.
 * @param {array} data Array que contiene la informacion sobre las diferentes fotos de los gatos.
 */
function mostrarImagenes(data) {
    // Eliminamos las imagenes que tenemos en el momento.
    limpiarImagenes();
    // Cogemos el elemento div donde se van a incluir las imagenes
    var caja = document.getElementById('imagenes');
    // Por cada elemento del array, se crea y se añade una imagen.
    for (let i = 0; i < data.length; i++) {
        // Creamos la columna
        var cajaColumna = document.createElement('div');
        cajaColumna.classList.add('column');
        // Creamos el segment
        var cajaSegment = document.createElement('div');
        cajaSegment.classList.add('ui','segment');
        // Creamos el link para la imagen
        var link = document.createElement('a');
        link.setAttribute('href',data[i].url);
        link.setAttribute('target','_blank');
        // Creamos la imagen
        var img = document.createElement('img');
        // Le añadimos las clases a las imagenes.
        img.classList.add('ui', 'image', 'rounded');
        // Le asignamos la url
        img.src = data[i].url;

        link.appendChild(img);
        cajaSegment.appendChild(link);
        cajaColumna.appendChild(cajaSegment);
        caja.appendChild(cajaColumna);
    }
    crearPaginador(pagina, cantidadPaginas);
    //console.log('La cantidad de imagenes que hay en esta categoria es ' + cantidadImagenes + ', por lo que debe tener ' + cantidadPaginas + ' paginas.');
}

/**
 * Funcion para eliminar todas las imagenes del elemento div con la clase 'imagenes'
 */
function limpiarImagenes() {
    var caja = document.getElementById('imagenes');
    while (caja.hasChildNodes()) {
        caja.childNodes[0].remove();
    }
    var cajaPaginador = document.getElementById('paginador');
    while (cajaPaginador.hasChildNodes()) {
        cajaPaginador.childNodes[0].remove();
    }
}

/**
 * Funcion para mostrar le error
 * @param {string} codigoEstado 
 */
function errorHandler(codigoEstado) {
    console.log('Fallo: ' + codigoEstado);
}

/**
 * Funcion para mostrar el paginador en funcion de la pagina en la que estes y las paginas totales
 * @param {number} pagina Pagina actual
 * @param {number} cantidadPaginas Cantidad total de paginas
 */
function crearPaginador(pagina, cantidadPaginas) {
    var paginador = document.getElementById('paginador');
    // Creamos el span para mostrar la pagina actual y el total.
    var spanPaginas = document.createElement('span');
    // Le asignamos el texto correspondiente al span
    // Como las paginas empiezan en 0 le sumamos uno a la hora de mostrarla para confundir menos, al igual con la ultima pagina.
    // Pero solo es para estetica.
    spanPaginas.textContent = 'Pagina ' + (pagina + 1) + '/' + (cantidadPaginas + 1);
    // Le asignamos las clases para el estilo
    spanPaginas.classList.add('ui','label');
    // Creamos los botones para ir avanzando por las paginas.
    var botonPrimera = document.createElement('button'); // <<
    var botonAnterior = document.createElement('button'); // <
    var botonSiguiente = document.createElement('button'); // >
    var botonUltima = document.createElement('button'); // >>
    // Le asignamos el texto a cada boton.
    botonPrimera.innerHTML = '<i class="backward icon"></i>';
    botonAnterior.innerHTML = '<i class="left arrow icon"></i>';
    botonSiguiente.innerHTML = '<i class="right arrow icon"></i>';
    botonUltima.innerHTML = '<i class="forward icon"></i>';
    // Le asignamos las clases a los botones
    botonPrimera.classList.add('mini','ui','secondary','button');
    botonAnterior.classList.add('mini','ui','primary','button');
    botonSiguiente.classList.add('mini','ui','primary','button');
    botonUltima.classList.add('mini','ui','secondary','button');
    // Le asignamos los manejadores a cada boton respectivamente.
    botonPrimera.addEventListener('click', manejadorPrimera);
    botonSiguiente.addEventListener('click', manejadorSiguiente);
    botonAnterior.addEventListener('click', manejadorAnterior);
    botonUltima.addEventListener('click', manejadorUltima);
    // Le asignamos los botones al paginador.
    paginador.appendChild(botonPrimera);
    paginador.appendChild(botonAnterior);
    // En medio el span.
    paginador.appendChild(spanPaginas);
    paginador.appendChild(botonSiguiente);
    paginador.appendChild(botonUltima);

}

// Hacemos la peticion para las diferentes categorias.
requestJSON(URL_CATEGORIAS).then(
    mostrarOpciones,
    errorHandler
);