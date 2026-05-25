window.onload = function() {
    try {
        const DATALIST = "datalist";
        const SELECT = "select";
        const ACTIONS = { "deleteRows" : deleteRows };

        let selectedRowsToDelete = new Array();
        
        /**
         * 1- Get the amount of rows.
         * 2- Crear un nuevo elemento de tipo td
         * 3- Obtener el número de celdas de la fila anterior para crear la 
         *    misma cantidad en la nueva fila.
         * 4- Se crean las nuevas celdas en función a la cantidad de celdas
         *    de la fila anterior.
         */
        function createRow(event) {
            let table = document.getElementById(
                    event.srcElement.dataset.tableName);
            let tableObject = getJsonObject(table.id);
            let tableBody = table.tBodies[0];
            let totalRows = tableBody.rows.length;
            let totalCells = table.dataset.initialCellsAmmount;
            let actualRow = totalRows;

            //Se crea una nueva fila
            tableBody.appendChild(addRow(actualRow));

            for (var c = 0; c < totalCells; c++) {
                /*
                 * Esta validación determina si queremos colocar un elemento
                 * especial en la última celda de la última fila creada. 
                 */
                if (c == (totalCells - 1)) {
                    let deleteButton = createElement(tableObject.deleteButton);
                    deleteButton.setAttribute("data-table-name", tableObject.tableId);
                    deleteButton.onclick = deleteRow;

                    tableBody.rows[actualRow]
                    .insertCell(c)
                    .appendChild(deleteButton);
                } else {
                    try {
                        tableBody.rows[actualRow]
                        .insertCell(c)
                        .appendChild(createElement(tableObject.cellElement[c]));
                    } catch (exception) {
                        console.log(exception.message);
                    }
                }
            }

            if (tableObject.massiveDelete.active) {
                tableBody.rows[actualRow].insertCell(0).appendChild(
                    createElement(tableObject.massiveDelete.element
                                , tableObject.massiveDelete.active));

                tableBody
                    .rows[actualRow]
                    .cells[0]
                    .children[0]
                    .onclick = addCheckedRowEvent.bind(this);
            }
        };
        
        /**
         * Método encargado de borrar una fila seleccionada.
         * 
         * @param {MouseEvent} event
         */
        function deleteRow(event) {
            let table = document.getElementById(event.srcElement.dataset.tableName);

            let tableObject = getJsonObject(table.id);

            //Se declara el table body actual.
            var tableBody = table.tBodies[0];

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

            var botonesdeleteRow = document.getElementsByClassName(tableObject.deleteButton.class);

            for (var f in botonesdeleteRow) {
                botonesdeleteRow[f].onclick = deleteRow;
            }
        };

        /**
         * Método encargado de crear un elemento HTML especifico para cada celda.
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM del tipo de elemento requerido.
         */
        function createElement(elemento, activeMassiveDelete = false) {
            var element = document.createElement(elemento.element);
            
            //Se verifica si el elemento name esta definido.
            if (isDefined(elemento.name)) { element.setAttribute("name", elemento.name); }

            //Valida que el atributo type este definido.
            if (isDefined(elemento.type)) { element.setAttribute("type", elemento.type); }

            //Valida que el atributo class este definido.
            if (isDefined(elemento.classAttribute)) { element.setAttribute("class", elemento.classAttribute); }

            //Se verifica si el elemento text esta definido.
            if (isDefined(elemento.text)) {
                var textNode = document.createTextNode(elemento.text);
                element.appendChild(textNode);
            }

            if (isDefined(elemento.list)) { element.setAttribute("list", elemento.list); }

            if (isDefined(elemento.id)) { element.setAttribute("id", elemento.id); }

            let elementType = (Object.is(SELECT, elemento.element) ? SELECT : DATALIST);

            createOptionList(
                elementType, 
                (jsonObject.commonOptions?.options ?? elemento?.options), 
                element);

            if (element.type == "radio" || element.type == "checkbox") {
                if (!activeMassiveDelete) {
                    let randomNumber = Math.round(Math.random() * 1000);
                    element = document.createElement("span");

                    if (elemento.radioElements != undefined || elemento.radioElements != null) {
                        for (var r in elemento.radioElements) {
                            let radioCheckboxElement = document.createElement(elemento.element);
                            radioCheckboxElement.setAttribute("type", elemento.type);
                            radioCheckboxElement.setAttribute(
                                "name", 
                                elemento.name.replace('[number]', randomNumber));
                            radioCheckboxElement.setAttribute("value", elemento.radioElements[r].value);

                            element.appendChild(radioCheckboxElement);
                            element.appendChild(createElement(elemento.radioElements[r]));
                        }
                    }
                }
            }

            element.addEventListener(elemento.event?.type, ACTIONS[elemento.event?.function]);

            return element;
        }

        /**
         * Método encargado de crear una nueva fila para un elemento table.
         * 
         * @returns {HTMLElementTagNameMap}:    Retorna el objeto DOM de tipo tr
         */
        function addRow(rowNumber) {
            let fila = document.createElement("tr");
            fila.setAttribute("data-fila", rowNumber);

            return fila;
        }

        /**
         * Returns the respectively table properties defined into the Teibol's 
         * JSON Object.
         * 
         * @param {*} tableId 
         * @returns 
         */
        function getJsonObject(tableId) {
            for (let t of jsonObject.tables) {
                if (tableId === t.tableId) {
                    return t;
                }
            }
        }

        /*
         * Function that validates if a json attribute is defined and has data.
         * 
         * @param {String} elementAttribute: Attribute of the JSON object to validate.
         * @returns {Boolean}: Returns true if the attribute is defined and has 
         *                     data, otherwise returns false.
         */
        function isDefined(elementAttribute) {
            return (undefined != elementAttribute && null != elementAttribute);
        }

        function createOptionList(elementType, optionsList, newElement) {
            let newDataList = null;

            if (undefined !== optionsList && null !== optionsList) {
                /**
                 * Validates if a request needs to create a new datalist element and
                 * verifies exists the list attribute into the JSON object.
                 */
                if (Object.is(DATALIST, elementType)
                && undefined == document.getElementById(newElement.getAttribute("list"))) {
                    newDataList = document.createElement("datalist");
                    newDataList.setAttribute("id", newElement.getAttribute("list"));
                }

                for (let option of optionsList) {
                    let newOption = document.createElement(option.element);
                    let text = document.createTextNode(option.text);
                    newOption.setAttribute("value", option.value);

                    if (Object.is(SELECT, elementType)) {
                        newOption.appendChild(text);
                        newElement.appendChild(newOption);
                    } else if (null != newDataList) {
                        newDataList.appendChild(newOption);
                    }
                }

                if (null != newDataList) {
                    document.body.appendChild(newDataList);
                }
            }
        }

        function addCheckedRowEvent(actualRow) {
            let checkedRow = actualRow.srcElement.parentElement.parentElement;
            selectedRowsToDelete.push(checkedRow);
        }

        function deleteRows() {
            console.log(selectedRowsToDelete);
                for (let row in selectedRowsToDelete) {
                    let table = document.getElementById(selectedRowsToDelete[row].parentElement?.parentElement?.id);

                    for (let tableBody of table.tBodies) {
                        tableBody.removeChild(selectedRowsToDelete[row]);
                    }

                    console.log("trying to delete row from table: " + selectedRowsToDelete[row].parentElement?.parentElement?.id);
                    //delete selectedRowsToDelete[row];
                }
        }

        /*
         * A cada fila se le agrega un atributo de tipo dataset para identificar 
         * el número de fila en próximas validaciones. 
         */
        for (let t of jsonObject.tables) {
            let table = document.getElementById(t.tableId);
            let createRowButton = document.getElementById(t.addButton);
            let initialCellsAmmount = t.totalCells;
            let dataRowCount = 0

            table.setAttribute("data-initial-cells-ammount", initialCellsAmmount);

            //Adds a new row into te table header section.
            table.tHead.appendChild(addRow(0));

            for (let thRow of table.tHead.rows) {
                if (t.massiveDelete.active) {
                    thRow.insertCell().appendChild(
                        createElement(
                            t.massiveDelete.element
                            , t.massiveDelete.active));
                }

                for (let headerCell of t.tableHeaderCells) {
                    thRow.insertCell().appendChild(
                        document.createTextNode(headerCell));
                }
            }

            for (let tableBody of table.tBodies) {
                for (let row of tableBody.rows) {
                    row.setAttribute("data-fila", dataRowCount);
                    row.setAttribute("data-table-id", t.tableId);
                    dataRowCount++;
                }
            }

            createRowButton.setAttribute("data-table-name", t.tableId);
            createRowButton.onclick = createRow;

            if (t.massiveDelete.active) {
                element = createElement(t.massiveDelete.deleteButton);
                table.caption.appendChild(element);

                
            }
        }
    } catch (excepcion) {
        this.console.error(excepcion.message);
        this.console.error("Los par\u00E1metros para la tabla no est\u00E1n definidos. Construye el objeto JSON con la estructura definida en https://elle184.github.io/TableJsApi/");
    }
};