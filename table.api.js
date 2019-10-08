window.onload = function() {
    try {
        var tabla = document.getElementById(jsonObject.tableId);
        var botonesCrearFila = document.getElementsByClassName(jsonObject.addButton);
        var botonesBorrarFila = document.getElementsByClassName(jsonObject.deleteButton);
        var cantidadCeldasInicial = jsonObject.totalCells;
        
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
            var totalFilas = tableBody.rows.length;
            var totalCeldas = cantidadCeldasInicial;
            var filaActual = 0;

            if (totalFilas > 0) { filaActual = totalFilas--; }

            //Se crea una nueva fila
            tableBody.appendChild(agregarFila());

            for (var c = 0; c < totalCeldas; c++) {
                /*
                * Esta validación determina si queremos colocar un elemento
                * especial en la última celda de la última fila creada. 
                */
                if (c == (totalCeldas - 1)) {
                    tableBody.rows[filaActual]
                    .insertCell(c)
                    .appendChild(crearBoton());
                } else {
                    tableBody.rows[filaActual]
                    .insertCell(c)
                    .appendChild(crearElemento(jsonObject.cellElement[c]));
                }
            }

            /*
            * Se realiza un recorrido por las filas que quedaron y se 
            * les reasigna un nuevo ID de fila. Esto se hace para evitar
            * borrar una fila cuyo indice no exista dentro del listado de
            * filas de elemento tbody.
            */
            for (var i = 0; i < totalFilas; i++) { tableBody.rows[i].setAttribute("data-fila", i); }

            /*
            * Se obtienen todos los botones que se encargan de borrar su respectiva fila y se les 
            * agrega la función de borrado.
            */
            for (var f in document.getElementsByClassName("btnBorrar")) { 
                botonesBorrarFila[f].onclick = borrarFila; 
            }
        };
        
        /**
         * Método encargado de borrar una fila seleccionada.
         * 
         * @param {MouseEvent} evento 
         */
        function borrarFila(evento) {
            //Se declara el table body actual.
            var tableBody = tabla.tBodies[0];

            //Se declara el ID de la primera fila. 
            var primeraFila = 0;
            
            //Se declara el ID de la última fila.
            var ultimaFila = tableBody.rows.length - 1;
            
            //Se obtiene el ID de la fila que se esta borrando.
            var idFila = evento.srcElement.parentElement.parentElement.getAttribute("data-fila");
            
            //Se valida si se esta borrando la primera fila 
            if (idFila == primeraFila) {
                //Se borra la fila
                tableBody.deleteRow(evento.srcElement.parentElement.parentElement.getAttribute("data-fila"));
                
                /*
                * Se realiza un recorrido por las filas que quedaron y se 
                * les reasigna un nuevo ID de fila. Esto se hace para evitar
                * borrar una fila cuyo indice no exista dentro del listado de
                * filas de elemento tbody.
                */
                for (var i = idFila; i < tableBody.rows.length; i++) {
                    tableBody.rows[i].setAttribute("data-fila", i);
                }
            }
            
            if (idFila > primeraFila && idFila < ultimaFila) {
                tableBody.deleteRow(evento.srcElement.parentElement.parentElement.getAttribute("data-fila"));
                
                for (var i = idFila; i < ultimaFila; i++) {
                    tableBody.rows[i].setAttribute("data-fila", i);
                }
            }
            
            //Se borra la fila seleccionada.
            if (idFila == ultimaFila && tableBody.rows.length > 0) {
                tableBody.deleteRow(evento.srcElement.parentElement.parentElement.getAttribute("data-fila"));
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
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM de tipo button.
         */
        function crearBoton() {
            var boton = document.createElement("button");
            boton.setAttribute("type", "button");
            boton.setAttribute("class", "btnBorrar");
            boton.innerHTML = "-";

            return boton;
        }

        /**
         * Método encargado de crear un elemento HTML especifico para cada celda.
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM del tipo de elemento requerido.
         */
        function crearElemento(elemento) {
            var elementLabel = null;
            var element = document.createElement(elemento.element);
            
            //Se verifica si el elemento name esta definido.
            if (elemento.name !=  undefined && elemento.name != null) {
                element.setAttribute("name", elemento.name);
            }

            //Valida que el atributo type este definido.
            if (elemento.type != undefined && elemento.type != null) {
                element.setAttribute("type", elemento.type);
            }

            //Valida que el atributo class este definido.
            if (elemento.class != undefined && elemento.class != null) { 
                element.setAttribute("class", elemento.class); 
            }

            //Se verifica si el elemento label esta definido para adjuntarlo al elemento radio o checkbox.
            if (elemento.label != undefined && elemento.label != null) {
                elementLabel = crearElemento(elemento.label);
            }

            //Se verifica si el elemento text esta definido.
            if (elemento.text != undefined && elemento.text != null) {
                var textNode = document.createTextNode(elemento.text);
                element.appendChild(textNode);
            }

            if (elemento.options != null && elemento.options.length > 0) {
                for (var o in elemento.options) {
                    var option = document.createElement(elemento.options[o].element);
                    var text = document.createTextNode(elemento.options[o].text);
                    option.setAttribute("value", elemento.options[o].value);
                    option.appendChild(text);

                    element.appendChild(option);
                }
            }

            if (element.type == "radio" || element.type == "checkbox") {
                var spanElement = document.createElement("span");
                spanElement.appendChild(element);
                spanElement.appendChild(elementLabel);

                element = spanElement;
            }

            return element;
        }

        /**
         * Método encargado de crear una nueva fila para un elemento table.
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM de tipo tr
         */
        function agregarFila() {
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
    } catch (excepcion) {
        this.console.error(excepcion.message);
        this.console.error("Los par\u00E1metros para la tabla no est\u00E1n definidos. Construye el objeto JSON con la estructura definida en https://elle184.github.io/TableJsApi/");
    }
};