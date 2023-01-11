window.onload = function() {
    try {        
        /**
         * 1- Obtener el número de filas
         * 2- Crear un nuevo elemento de tipo td
         * 3- Obtener el número de celdas de la fila anterior para crear la 
         *    misma cantidad en la nueva fila.
         * 4- Se crean las nuevas celdas en función a la cantidad de celdas
         *    de la fila anterior.
         */
        function crearFila(event) {
            let table = event.srcElement.parentElement.parentElement;
            let tableObject = getJsonObject(table.id);
            var tableBody = event.srcElement.parentElement.parentElement.tBodies[0];
            var totalFilas = tableBody.rows.length;
            let totalCells = table.dataset.initialCellsAmmount;
            var filaActual = totalFilas;

            //Se crea una nueva fila
            tableBody.appendChild(agregarFila(filaActual));

            for (var c = 0; c < totalCells; c++) {
                /*
                * Esta validación determina si queremos colocar un elemento
                * especial en la última celda de la última fila creada. 
                */
                if (c == (totalCells - 1)) {
                    var botonBorrar = crearElemento(tableObject.deleteButton);
                    botonBorrar.onclick = borrarFila;

                    tableBody.rows[filaActual]
                    .insertCell(c)
                    .appendChild(botonBorrar);
                } else {
                    tableBody.rows[filaActual]
                    .insertCell(c)
                    .appendChild(crearElemento(tableObject.cellElement[c]));
                }
            }

            /*
             * Se obtienen todos los botones que se encargan de borrar su respectiva fila y se les 
             * agrega la función de borrado.
             */
            var botonesBorrarFila = document.getElementsByClassName(tableObject.deleteButton.classAttribute);

            for (var f in botonesBorrarFila) {
                botonesBorrarFila[f].onclick = borrarFila; 
            }
        };
        
        /**
         * Método encargado de borrar una fila seleccionada.
         * 
         * @param {MouseEvent} event
         */
        function borrarFila(event) {
            let table = event.srcElement.parentElement.parentElement.parentElement.parentElement;

            let tableObject = getJsonObject(table.id);

            //Se declara el table body actual.
            var tableBody = event.srcElement.parentElement.parentElement.parentElement;

            //Se declara el ID de la primera fila. 
            var primeraFila = 0;
            
            //Se declara el ID de la última fila.
            var ultimaFila = tableBody.rows.length - 1;
            
            //Se obtiene el ID de la fila que se esta borrando.
            var idFila = event.srcElement.parentElement.parentElement.getAttribute("data-fila");
            
            //Se valida si se esta borrando la primera fila 
            if (idFila == primeraFila) {
                //Se borra la fila
                tableBody.deleteRow(event.srcElement.parentElement.parentElement.getAttribute("data-fila"));
                
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
                tableBody.deleteRow(event.srcElement.parentElement.parentElement.getAttribute("data-fila"));
                
                for (var i = idFila; i < ultimaFila; i++) {
                    tableBody.rows[i].setAttribute("data-fila", i);
                }
            }
            
            //Se borra la fila seleccionada.
            if (idFila == ultimaFila && tableBody.rows.length > 0) {
                tableBody.deleteRow(event.srcElement.parentElement.parentElement.getAttribute("data-fila"));
            }

            var botonesBorrarFila = document.getElementsByClassName(tableObject.deleteButton.class);

            for (var f in botonesBorrarFila) {
                botonesBorrarFila[f].onclick = borrarFila;
            }
        };

        /**
         * Método encargado de crear un elemento HTML especifico para cada celda.
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM del tipo de elemento requerido.
         */
        function crearElemento(elemento) {
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
            if (elemento.classAttribute != undefined && elemento.classAttribute != null) { 
                element.setAttribute("class", elemento.classAttribute); 
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
                element = document.createElement("span");

                if (elemento.radioElements != undefined || elemento.radioElements != null) {
                    for (var r in elemento.radioElements) {
                        var radioCheckboxElement = document.createElement(elemento.element);
                        radioCheckboxElement.setAttribute("type", elemento.type);
                        radioCheckboxElement.setAttribute("name", elemento.name);
                        radioCheckboxElement.setAttribute("value", elemento.radioElements[r].value);

                        element.appendChild(radioCheckboxElement);
                        element.appendChild(crearElemento(elemento.radioElements[r]));
                    }
                }
            }

            return element;
        }

        /**
         * Método encargado de crear una nueva fila para un elemento table.
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM de tipo tr
         */
        function agregarFila(numFila) {
            var fila = document.createElement("tr");
            fila.setAttribute("data-fila", numFila);
            return fila;
        }

        function getJsonObject(tableId) {
            for (let t in jsonObject) {
                if (tableId === jsonObject[t].tableId) {
                    return jsonObject[t];
                }
            }
        }

        /*
        * A cada fila se le agrega un atributo de tipo dataset para identificar 
        * el número de fila en próximas validaciones. 
        */
        for (let t in jsonObject) {
            let table = document.getElementById(jsonObject[t].tableId);
            let createRowButtons = document.getElementsByClassName(jsonObject[t].addButton);
            let initialCellsAmmount = jsonObject[t].totalCells;

            table.setAttribute("data-initial-cells-ammount", initialCellsAmmount);

            for (var f = 0; f < table.tBodies[0].rows.length; f++) {
                table.tBodies[0].rows[f].setAttribute("data-fila", f);
            }

            for (var f in createRowButtons) {
                createRowButtons[f].onclick = crearFila;
            }
        }
    
    } catch (excepcion) {
        this.console.error(excepcion.message);
        this.console.error("Los par\u00E1metros para la tabla no est\u00E1n definidos. Construye el objeto JSON con la estructura definida en https://elle184.github.io/TableJsApi/");
    }
};