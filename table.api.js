window.onload = function() {
    var tabla = document.getElementById("tabla");
    var botonesCrearFila = document.getElementsByClassName("btnAgregar");
    var botonesBorrarFila = document.getElementsByClassName("btnBorrar");
    
    /**
     * 1- Obtener el número de filas
     * 2- Crear un nuevo elemento de tipo td
     * 3- Obtener el número de celdas de la fila anterior para crear la 
     *    misma cantidad en la nueva fila.
     * 4- Se crean las nuevas celdas en función a la cantidad de celdas
     *    de la fila anterior.
     */
    function crearFila(evento) {
        var tableBody = tabla.tBodies[0];
        var celdas = tableBody.rows[tableBody.rows.length - 2].cells;
        var totalCeldas = (typeof celdas == undefined) ? 0 : celdas.length;

        //Se crea una nueva fila

        for (var c = 0; c < totalCeldas; c++) {
            /*
             * Esta validación determina si queremos colocar un elemento
             * especial en la última celda de la última fila creada. 
             */
            if (c == (totalCeldas - 1)) {
                tableBody.rows[tableBody.rows.length - 1]
                .insertCell(c)
                .appendChild(crearBoton());
            } else {
                tableBody.rows[tableBody.rows.length - 1]
                .insertCell(c)
                .innerHTML = "Celda " + (tableBody.rows.length - 1) + " - " + c;
            }
        }

        /*
        * Se realiza un recorrido por las filas que quedaron y se 
        * les reasigna un nuevo ID de fila. Esto se hace para evitar
        * borrar una fila cuyo indice no exista dentro del listado de
        * filas de elemento tbody.
        */
        for (var i = 0; i < tabla.tBodies[0].rows.length; i++) {
            tabla.tBodies[0].rows[i].setAttribute("data-fila", i);
        }

        botonesBorrarFila = document.getElementsByClassName("btnBorrar");

        for (var f in botonesBorrarFila) {
            botonesBorrarFila[f].onclick = borrarFila;
        }
    };
    
    /**
     * Método encargado de borrar una fila seleccionada.
     * 
     * @param {MouseEvent} evento 
     */
    function borrarFila(evento) {
        //Se declara el ID de la primera fila. 
        var primeraFila = 0;
        
        //Se declara el ID de la última fila.
        var ultimaFila = tabla.tBodies[0].rows.length - 1;
        
        //Se obtiene el ID de la fila que se esta borrando.
        var idFila = evento.srcElement.parentElement.parentElement.getAttribute("data-fila");
        
        //Se valida si se esta borrando la primera fila 
        if (idFila == primeraFila) {
            console.log("Borrando la primera fila");
            //Se borra la fila
            tabla.tBodies[0].deleteRow(evento.srcElement.parentElement.parentElement.getAttribute("data-fila"));
            
            /*
             * Se realiza un recorrido por las filas que quedaron y se 
             * les reasigna un nuevo ID de fila. Esto se hace para evitar
             * borrar una fila cuyo indice no exista dentro del listado de
             * filas de elemento tbody.
             */
            for (var i = idFila; i < tabla.tBodies[0].rows.length; i++) {
                tabla.tBodies[0].rows[i].setAttribute("data-fila", i);
            }
        }
        
        if (idFila > primeraFila && idFila < ultimaFila) {
            tabla.tBodies[0].deleteRow(evento.srcElement.parentElement.parentElement.getAttribute("data-fila"));
            
            for (var i = idFila; i < ultimaFila; i++) {
                tabla.tBodies[0].rows[i].setAttribute("data-fila", i);
            }
        }
        
        if (idFila == ultimaFila) {
            console.log("Borrando la ultima fila");
            tabla.tBodies[0].deleteRow(evento.srcElement.parentElement.parentElement.getAttribute("data-fila"));
        }

        botonesBorrarFila = document.getElementsByClassName("btnBorrar");

        for (var f in botonesBorrarFila) {
            botonesBorrarFila[f].onclick = borrarFila;
        }
    };
    
    /**
     * Método encargado de la creación de un nuevo botón 
     * 
     * <button type="button" class="btnBorrar">Borrar</button>
     */
    function crearBoton() {
        var boton = document.createElement("button");
        boton.setAttribute("type", "button");
        boton.setAttribute("class", "btnBorrar");
        boton.innerHTML = "Borrar";

        return boton;
    }

    /**
     * Método encargado de crear una nueva fila para un elemento table.
     * 
     * @returns {HTMLElementTagNameMap}
     */
    function crearFila() {
        return document.createElement("tr");
    }

    /*
     * A cada fila se le agrega un atributo de tipo dataset para identificar 
     * el número de fila en próximas validaciones. 
     */
    for (var f = 0; f < tabla.tBodies[0].rows.length; f++) {
        tabla.tBodies[0].rows[f].setAttribute("data-fila", f);
    }
    
    for (var f in botonesCrearFila) {
        botonesCrearFila[f].onclick = crearFila;
    }
    
    for (var f in botonesBorrarFila) {
        botonesBorrarFila[f].onclick = borrarFila;
    }
};