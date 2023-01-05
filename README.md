# Teibol
Librería para la creación de filas de una tabla HTML.

La librería se encarga de:

1. Crear nuevas filas.
2. Remover filas de cualquier posición en la tabla.
3. Mediante un objeto JSON puedes crear los configuraciones iniciales de la tabla y crear los elementos de cada celda.
4. Puedes crear filas de mas de una tabla ubicada en una sola página HTML creando un arreglo de objetos JSON.

## Configuración

### Tabla HTML

La tabla la puedes configurar a tu gusto. Lo único que necesita el API que sea obligatorio es la existencia del elemento **tbody** dentro de la tabla.

```html
<table id="tabla">
    <caption id="menuAcciones">
        <button type="button" class="btnAgregar">+</button>
    </caption>
    <caption>Manejo de tablas con DOM y Javascript</caption>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Tel&eacute;fono</th>
            <th>Radio Elements</th>
            <th>Checkbox Elements</th>
            <th>Datalist</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>
```

### Objeto JSON

Este es un ejemplo completo de como se puede configurar una tabla HTML para que pueda ser manipulada por el API.

``` javascript
var jsonObject = [{
    "tableId":"tabla",
    "addButton":"btnAgregar",
    "deleteButton":{"element":"button", "type":"button", "class":"BtnBorrar", "name":"btnBorrar", "text":"-"},
    "totalCells":6,
    "cellElement": [
        {"element":"input", "type":"text", "class":null, "name":"name[]"},
        {"element":"input", "type":"text", "class":null, "name":"lastname[]"},
        {
            "element":"select",
            "name":"country[]",
            "options": [
                {"element": "option", "value":"1", "text":"Option 1"},
                {"element": "option", "value":"2", "text":"Option 2"},
                {"element": "option", "value":"3", "text":"Option 3"},
                {"element": "option", "value":"4", "text":"Option 4"},
                {"element": "option", "value":"5", "text":"Option 5"},
                {"element": "option", "value":"6", "text":"Option 6"}
            ]
        },
        {
            "element":"input",
            "type":"radio",
            "name":"radio_options[]",
            "radioElements":[
                {"element":"label", "text":"Radio 1", "value": 1},
                {"element":"label", "text":"Radio 2", "value": 2},
                {"element":"label", "text":"Radio 3", "value": 3}
            ]
        },
        {
            "element":"input",
            "type":"checkbox",
            "name":"checkbox_options[]",
            "radioElements":[
                {"element":"label", "text":"Checkbox 1", "value": 1},
                {"element":"label", "text":"Checkbox 2", "value": 2},
                {"element":"label", "text":"Checkbox 3", "value": 3}
            ]
        },
        {
            "element": "input", 
            "list": "categories", 
            "name":"categories[]",
            "options": [
                {"element": "option", "value":"Colombia", "text":"Colombia"},
                {"element": "option", "value":"Brasil", "text":"Brasil"},
                {"element": "option", "value":"Venezuela", "text":"Venezuela"},
                {"element": "option", "value":"Perú", "text":"Perú"},
                {"element": "option", "value":"Chile", "text":"Chile"},
                {"element": "option", "value":"Argentina", "text":"Argentina"}
            ]
        }
    ]
}]
```

#### Elementos del objeto JSON

* **tableId:** El valor del atributo **id** del elemento **table**.
* **addButton:** El valor del atributo **class** del elemento **button** para crear nuevas filas en la tabla.
* **deleteButton:** Es un objeto JSON con la definición del botón a crear

```javascript 
{"element":"button", "type":"button", "class":"BtnBorrar", "name":"btnBorrar", "text":"-"}
```

**button** para borrar una fila de una tabla.
* **totalCells:** La cantidad de celdas que tendrá la tabla.
* **cellElements:** Es un arreglo con los elementos a colocar en cada celda en el cual se declara objetos del tipo:

```javascript 
{"element":"input", "type":"text", "class":null, "name":"name[]"}
```

* **cellElements.element:** El tipo de elemento a crear.
* **cellElements.type:** El valor para el atributo **type** (Aplica para los elementos de tipo **input**).
* **cellElements.class:** El valor del atributo **class** para el elemento.
* **cellElements.name:** El valor del atributo **name** (Aplica para los elementos de tipo **input**). Es recomendable que el valor para este atributo sea un arreglo debido a que se van a crear elementos iguales y esto garantiza que toda la información que se llegase a guardar se envié completamente en dicho arreglo.
* **cellElements.list:** El valor de este atributo contiene el nombre del atributo _id_ para el elemento _datalist_.
* **cellElements.value:** El valor para el atributo **value**.
* **cellElements.text:** El texto a colocar como hijo dentro de un elemento a crear.
* **cellElements.options:** Es una arreglo de opciones usado para configurar las listas desplegables de los elementos de tipo **select**.
* **cellElements.radioElements:** Es un arreglo de elementos a asociar a los elementos de tipo **radio** o **checkbox** que se esten creando.

### Cómo configurar mas de una tabla

1. Crea tus tablas como aparece en el apartado **Tabla HTML**.
2. Crea un arreglo de objetos JSON.

Ejemplo:

``` javascript
var jsonObject = [{
            "tableId":"tabla",
            "addButton":"btnAgregar",
            "deleteButton":{"element":"button", "type":"button", "class":"BtnBorrar", "name":"btnBorrar", "text":"-"},
            "totalCells":7,
            "cellElement": [
                {"element":"input", "type":"text", "class":null, "name":"name[]"},
                {"element":"input", "type":"text", "class":null, "name":"lastname[]"},
                {
                    "element":"select",
                    "name":"country[]",
                    "options": [
                        {"element": "option", "value":"1", "text":"Option 1"},
                        {"element": "option", "value":"2", "text":"Option 2"},
                        {"element": "option", "value":"3", "text":"Option 3"}
                    ]
                },
                {
                    "element":"input",
                    "type":"radio",
                    "name":"radio_options[]",
                    "radioElements":[
                        {"element":"label", "text":"Radio 1", "value": 1}
                    ]
                },
                {
                    "element":"input",
                    "type":"checkbox",
                    "name":"checkbox_options[]",
                    "radioElements":[
                        {"element":"label", "text":"Checkbox 1", "value": 1}
                    ]
                },
                {
                    "element": "input", 
                    "list": "categories", 
                    "name":"categories[]",
                    "options": [
                        {"element": "option", "value":"Colombia", "text":"Colombia"},
                        {"element": "option", "value":"Brasil", "text":"Brasil"}
                    ]
                }
            ]
        },
        {
            "tableId":"tabla2",
            "addButton":"btnAgregar",
            "deleteButton":{"element":"button", "type":"button", "class":"BtnBorrar", "name":"btnBorrar", "text":"-"},
            "totalCells":7,
            "cellElement": [
                {"element":"input", "type":"text", "class":null, "name":"name[]"},
                {"element":"input", "type":"text", "class":null, "name":"lastname[]"},
                {
                    "element":"select",
                    "name":"country[]",
                    "options": [
                        {"element": "option", "value":"1", "text":"Option 1"},
                        {"element": "option", "value":"2", "text":"Option 2"},
                        {"element": "option", "value":"3", "text":"Option 3"},
                        {"element": "option", "value":"4", "text":"Option 4"},
                        {"element": "option", "value":"5", "text":"Option 5"},
                        {"element": "option", "value":"6", "text":"Option 6"}
                    ]
                },
                {
                    "element":"input",
                    "type":"radio",
                    "name":"radio_options[]",
                    "radioElements":[
                        {"element":"label", "text":"Radio 1", "value": 1},
                        {"element":"label", "text":"Radio 2", "value": 2},
                        {"element":"label", "text":"Radio 3", "value": 3}
                    ]
                },
                {
                    "element":"input",
                    "type":"checkbox",
                    "name":"checkbox_options[]",
                    "radioElements":[
                        {"element":"label", "text":"Checkbox 1", "value": 1},
                        {"element":"label", "text":"Checkbox 2", "value": 2},
                        {"element":"label", "text":"Checkbox 3", "value": 3}
                    ]
                },
                {
                    "element": "input", 
                    "list": "categories", 
                    "name":"categories[]",
                    "options": [
                        {"element": "option", "value":"Colombia", "text":"Colombia"},
                        {"element": "option", "value":"Brasil", "text":"Brasil"},
                        {"element": "option", "value":"Venezuela", "text":"Venezuela"},
                        {"element": "option", "value":"Perú", "text":"Perú"},
                        {"element": "option", "value":"Chile", "text":"Chile"},
                        {"element": "option", "value":"Argentina", "text":"Argentina"}
                    ]
                }
            ]
        }];
```

<a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/soloenbinario">
    <img src="https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/BMC-btn-logo.svg" alt="Buy me a coffee" />
    <span style="margin-left:5px">Buy me a coffee</span>
</a>
