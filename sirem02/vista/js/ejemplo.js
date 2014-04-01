/**
 * Compendio de funciones CRUD para ...
 */

$( function () {
    
    /* Inicio de lo que se ejecutará cuando el formulario Localidades.html cargue */
    
    var jqGridXxxxxxxxxxx;

    crearTablaXxxxxxxxxxx();
    
    /* Fin de lo que se ejecutará cuando el formulario Localidades.html cargue */
    
    /* Implementación necesaria */
    
    /**
     * Muestra una tabla con la información de los temas de congresos a partir de
     * la información recibida de TemaCongreso.seleccionar()
     */
    function crearTablaXxxxxxxxxxx() {
        jqGridXxxxxxxxxxx = jQuery("#tablaXxxxxxx").jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Xxxxxxxxx',
                oper:'select'
            },
            colNames:['Título Col1','Título Col2',  /***/  , 'Título ColN'],
            colModel:[
                // recomiendo que en lo posible, name e index correspondan a los nombres de las columnas de la tabla o vista
                {name:'id', index:'id', width:55, align:'center', editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                //
                //  ...  las columnas se pueden formatear, ejemplo: edittype:"checkbox", formatter:"checkbox", editoptions:{value:"true:false"}
                //                                                  editoptions:{dataInit: function (elem) { $(elem).datepicker();
                //
                {name:'nombre', index:'nombre', width:500, editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }}
            ],
            rowNum:100,
            width:700,
            rowList:[100,200,300],
            pager: '#pTablaXxxxxxx',
            sortname: 'xxxxxxxxxx',  // nombre de columna(s) de la tabla que se utilizarán para ordenar la tabla
            viewrecords: true,
            sortorder: "asc",
            caption:"Gestión de Xxxxxxxxx",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Xxxxxxxxx"
        }).jqGrid('navGrid', '#pTablaXxxxxxx', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {   // Antes de enviar a Xxxxxxxxx->edit(...) se agrega un POST
            modal:true, jqModal:true,
            width:500
        },
        {   // Antes de enviar a TemaCongreso->add(...) se agrega un POST
            modal:true, jqModal:true,
            width:500,
            afterSubmit: function (response, postdata) {
                // Enseguida se muestran lo fundamental de las validaciones de errores ocurridos en el servidor
                console.log(response);  // 
                var respuesta = jQuery.parseJSON(response.responseText)
                return respuesta.ok ? [true, "", ""] : [false, respuesta.mensaje, ""];
            }
        },
        {modal:true, jqModal:true,
            width:300
        },
        {multipleSearch:true, multipleGroup:true}
    )
    }
    
})

