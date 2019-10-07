# TableJsApi
API Javascript para el manejo de tablas.

El API se encarga de:

1. Crear nuevas filas.
2. Remover filas de cualquier posición en la tabla.
3. Mediante un objeto JSON puedes crear los configuraciones iniciales de la tabla y crear los elementos de cada celda.

# h1 Objeto JSON

```javascript
{
    "tableId":"tabla",
    "addButton":"btnAgregar",
    "deleteButton":"btnBorrar",
    "totalCells":5,
    "cellElement": [
        {"element":"input", "type":"text", "class":null, "name":"name[]"},
        {"element":"input", "type":"text", "class":null, "name":"lastname[]"},
        {"element":"input", "type":"text", "class":null, "name":"phone_number[]"},
        {
            "element":"select",
            "name":"country[]",
            "options": [
                {"element": "option", "value":"1", "text":"Option 1"},
                {"element": "option", "value":"2", "text":"Option 1"},
                {"element": "option", "value":"2", "text":"Option 1"},
                {"element": "option", "value":"2", "text":"Option 1"},
                {"element": "option", "value":"2", "text":"Option 1"},
                {"element": "option", "value":"2", "text":"Option 1"}
            ]
        }
    ]
}
```