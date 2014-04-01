/**
 * Compendio de funciones CRUD para departamentos, ciudades y zonas
 */
var localidadInicial;

$( function () {
    
    /* Inicio de lo que se ejecutará cuando el formulario Localidades.html cargue */
    
    var jqGridDeptos, jqGridCiudades, jqGridZonas,
        idDepto, datosDepto, idCiudad, datosCiudad;

    crearTablaDepartamentos();
    crearTablaCiudades();
    crearTablaZonas();
    
    /* Fin de lo que se ejecutará cuando el formulario Localidades.html cargue */
    
    /* Implementación necesaria */
    
    /**
     * Muestra una tabla con la información de los temas de congresos a partir de
     * la información recibida de TemaCongreso.seleccionar()
     */
    function crearTablaDepartamentos() {
        jqGridDeptos = jQuery("#tablaDepartamentos").jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Departamento',
                oper:'select'
            },
            colNames:['ID','NOMBRE DEL DEPARTAMENTO'],
            colModel:[
                {name:'id', index:'id', width:55, align:'center', editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'nombre', index:'nombre', width:500, editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }}
            ],
            rowNum:100,
            width:700,
            rowList:[100,200,300],
            pager: '#pTablaDepartamentos',
            sortname: 'id',
            viewrecords: true,
            sortorder: "asc",
            caption:"Gestión de departamentos",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Departamento",
            onSelectRow: function(id) {
                idDepto = id
                datosDepto = $(this).getRowData(idDepto);   // Recuperar los datos de la fila seleccionada
                idCiudad = ''
                crearTablaCiudades()
                crearTablaZonas()
            }
        }).jqGrid('navGrid', '#pTablaDepartamentos', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {   // Antes de enviar a Departamento->edit(...) se agrega un POST
            modal:true, jqModal:true,
            width:500,
            beforeSubmit: function(postdata) {
//              acceder a los datos de la fila seleccionada:
//              var fila = $(this).getRowData($(this).getGridParam("selrow"));

//              agregar un parámetro a los datos enviados (ej. el ID introducido en el formulario de edición)
                postdata.idNuevo = $('#id').val();
                return[true, ''];
            },
            afterSubmit: function (response, postdata) {
                var respuesta = jQuery.parseJSON(response.responseText);
                return [respuesta.ok, respuesta.mensaje, ''];
            }
        },
        {   // Antes de enviar a Departamento->add(...) se agrega un POST
            modal:true, jqModal:true,
            width:500,
            afterSubmit: function (response, postdata) {
                var respuesta = jQuery.parseJSON(response.responseText);
                return [respuesta.ok, respuesta.mensaje, ''];
            }
        },
        {   modal:true, jqModal:true,
            width:300,
            afterSubmit: function (response, postdata) {
                var respuesta = jQuery.parseJSON(response.responseText);
                return [respuesta.ok, respuesta.mensaje, ''];
            }
        },
        {multipleSearch:true, multipleGroup:true}
    )
    }

    /**
     * Muestra una tabla con la información de las ciudades a partir de
     * la información recibida de obj.seleccionar()
     * Argumentos:
     * Agregar, editar, eliminar, buscar: true o false, dependiendo de las opciones que se quieran habilitar
     */
    function crearTablaCiudades() {
        if (jqGridCiudades) {
            jqGridCiudades.jqGrid('setGridParam', {postData: {id: idDepto}})
            if (!idDepto) {
                jqGridCiudades.jqGrid('setCaption', "Ciudades").trigger("reloadGrid")
            } else {
                jqGridCiudades.jqGrid('setCaption', "Ciudades de " + datosDepto['nombre'].capitalize()).trigger("reloadGrid")
            }
            return
        }
        jqGridCiudades = jQuery('#tablaCiudades').jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Ciudad',
                oper:'select'
            },
            colNames:['ID','NOMBRE DE LA CIUDAD', 'DEPARTAMENTO'],
            colModel:[
                {name:'ciudad_id', index:'ciudad_id', width:55, align:'center', editable:true, editoptions:{size:44,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'ciudad_nombre', index:'ciudad_nombre', width:250, editable:true, editoptions:{size:44,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'fk_departamento', index:'fk_departamento', hidden: false, width:200, editable:true, edittype:'select',
                    editoptions: {
                        dataInit: function(elemento) {$(elemento).width(292)}, 
                        dataUrl:'controlador/fachada.php?clase=Departamento&oper=getSelect',
                        defaultValue: idDepto
                    }
                }
            ],
            rowNum:200,
            width:700,
            rowList:[200, 700, 1300],
            pager: '#pTablaCiudades',
            sortname: 'ciudad_nombre',
            viewrecords: true,
            sortorder: "asc",
            caption:"Ciudades",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Ciudad",
            onSelectRow: function(id) {
                idCiudad = id
                datosCiudad = jQuery(jqGridCiudades).getRowData(idCiudad);   // Recuperar los datos de la fila seleccionada
                crearTablaZonas()
            }
        }).jqGrid('navGrid', '#pTablaCiudades', {
                refresh: true,
                edit: true,
                add: true,
                del: true,
                search: true
            }, 
            {   // Antes de enviar a obj->edit(...) se agrega un POST
                modal:true, jqModal:true,
                width:465,
            },
            {   // Antes de enviar a obj->add(...) se agrega un POST
                modal:true, jqModal:true,
                width:465,
                afterShowForm: function() {
                    $('#fk_departamento').val(idDepto)
                },
            },
            {modal:true, jqModal:true,
                width:300
            },
            {multipleSearch:true, multipleGroup:true}
        )
    }

    /**
     * Muestra una tabla con la información de las ciudades a partir de
     * la información recibida de obj.seleccionar()
     * Argumentos:
     * Agregar, editar, eliminar, buscar: true o false, dependiendo de las opciones que se quieran habilitar
     */
    function crearTablaZonas() {
        if (jqGridZonas) {  // Luego de creado el grid no se re-crea sino que se actualizan los parametros y se recarga
            jqGridZonas.jqGrid('setGridParam', {postData: {id: idCiudad}})
            if (!idCiudad) {
                jqGridZonas.jqGrid('setCaption', "Zonas de las ciudades").trigger("reloadGrid")
            } else {
                jqGridZonas.jqGrid('setCaption', "Zonas de las ciudades").trigger("reloadGrid")
                jqGridZonas.jqGrid('setCaption', "Zonas de " + datosCiudad['ciudad_nombre'] + ' ' + datosCiudad['fk_departamento'].capitalize()).trigger("reloadGrid")
            }
            return;
        }
        jqGridZonas = jQuery('#tablaZonas').jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Zona',
                oper : 'select'
            },
            colNames:['Id','Nombre de la zona', 'Tipo', 'Departamento', 'Ciudad'],
            colModel:[
                {name:'id_zona', index:'id_zona', width:55, editable:false, hidden: true},
                {name:'nombre', index:'nombre', width:250, editable:true, editoptions:{size:47,
                        dataInit: function(elemento) {$(elemento).width(300)}
                    }},
                {name:'tipo', index:'tipo', width:200, editable:true, edittype:'select', 
                    editoptions:{
                        dataInit: function(elemento) {$(elemento).width(310)}, 
                        value: getElementos({'clase': 'Zona', 'oper': 'getTiposZonas'})
                    }},
                {name:'departamento', index: 'departamento_id', editable: true, hidden:true, editrules: {edithidden:true}, edittype:'select',
                    editoptions: {
                        dataInit: function(elemento) {$(elemento).width(310)},
                        value   : getElementos({'clase': 'Departamento', 'oper': 'getLista'}),
                        dataEvents: [{type: 'change', 
                                fn: function(e) {
                                    actualizarComboCiudades('#ciudad', $(e.target).val(), datosCiudad['ciudad_nombre'])
                                }}]}},
                {name:'ciudad', index:'ciudad_id', hidden: false, width:150, editable:true, edittype:'select',
                            editoptions: {
                                dataInit: function(elemento) {$(elemento).width(310)},
                                value   : getElementos({'clase': 'Ciudad', 'oper': 'getLista', 'departamento' : idDepto})
                            }
                        }
            ],
            rowNum:200,
            width:700,
            rowList:[200,400,600],
            pager: '#pTablaZonas',
            sortname: 'nombre',
            viewrecords: true,
            sortorder: "asc",
            caption:"Gestión de zonas",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Zona"
        }).jqGrid('navGrid', '#pTablaZonas', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {   // Antes de enviar a obj->edit(...) se agrega un POST
            modal:true, jqModal:true,
            width:455,
            beforeShowForm : function() {
                actualizarComboCiudades('#ciudad', idDepto, datosCiudad['ciudad_nombre'])
            }
        },
        {   // Antes de enviar a obj->add(...) se agrega un POST
            modal:true, jqModal:true,
            width:455,
            afterShowForm : function() {
                setTimeout(function() {  
                    actualizarComboCiudades('#ciudad', idDepto, datosCiudad['ciudad_nombre'])
                    $('#departamento').val(idDepto)
                }, 100)
            }
        },
        {modal:true, jqModal:true,
            width:300
        },
        {multipleSearch:true, multipleGroup:true}
    )
    }
    
    
    /**
     * Dado el id de un depto, genera la lista de ciudades respectivas y si se proporciona
     * el nombre de una ciudad, también se seleccionan las zonas de ésta. Si además se indica
     * una zona, ésta también se selecciona.
     * @param cboCiudad El nommbre del combo que se creará
     * @param idDepto   El ID del departamento del que se creará la lista de ciudades
     * @param ciudad    Opcional. El nombre de la ciudad de la lista que será seleccionada
     * @param zona      Opcional. El nombre de la zona que se seleccionará
     */
    function actualizarComboCiudades(cboCiudad, idDepto, ciudad, zona) {
        ciudad = ciudad || '0';
        if (localidadInicial) {
            if (idDepto == localidadInicial.idDepto && !ciudad) {
                ciudad = localidadInicial.ciudad;
            }
        }
        zona = zona || false;
        $(cboCiudad).agregarElementos(getElementos({'clase': 'Ciudad', 'oper': 'getLista', 'departamento': idDepto})).on('change', function() {
            $('#zona').empty().getElementos({'clase': 'Zona', 'oper': 'getZonas', 'ciudad': $(this).val()});
            if (zona) {
                setTimeout(function() {
                    $('#zona').find("option:contains('" + zona + "')").attr("selected", "selected");
                }, 100);
            }
        });
        if (ciudad) {
            $(cboCiudad).find("option:contains('" + ciudad + "')").attr("selected", "selected");
        }
    }
    
})

