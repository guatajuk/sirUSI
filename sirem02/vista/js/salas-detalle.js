/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
    $('#salas-detalle-tonteria').html('Regla para definir todos los componentes de esta pagina: "<b>salas-detalle</b>-nombre"');

var jqGridSalas,jqGridBloques,jqGridSedes;
    crearTablaSala();
    crearTablaBloque();
    crearTablaSedes();


function crearTablaSedes() {
        jqGridSedes = jQuery("#tablaSedes").jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Sede',
                oper:'select'
            },
            colNames:['SEDE','DIRECCION'],
            colModel:[
                {name:'nombre', index:'nombre', width:100, align:'center', editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'direccion', index:'direccion', width:100, editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }}
            ],
            rowNum:100,
            width:700,
            rowList:[100,200,300],
            pager: '#pTablaSedes',
            sortname: 'nombre',
            viewrecords: true,
            sortorder: "asc",
            caption:"Gestión de Sedes",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Sede",
//            onSelectRow: function(id) {
//                idSala = id
//                datosSalas = jQuery(jqGridSalas).getRowData(idSala);   // Recuperar los datos de la fila seleccionada
//                
//            }
        }).jqGrid('navGrid', '#pTablaSedes', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {   // Antes de enviar a Departamento->edit(...) se agrega un POST
            modal:true, jqModal:true,
            width:500,
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
            width:300,
        },
        {multipleSearch:true, multipleGroup:true}
    )
}

    
    function crearTablaBloque() {
        jqGridBloques = jQuery("#tablaBloques").jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'bloque',
                oper:'select'
            },
            colNames:['BLOQUE','SEDE'],
            colModel:[
                {name:'nombre', index:'nombre', width:100, align:'center', editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'sede', index:'sede', width:100, editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }}
            ],
            rowNum:100,
            width:700,
            rowList:[100,200,300],
            pager: '#pTablaBloques',
            sortname: 'nombre',
            viewrecords: true,
            sortorder: "asc",
            caption:"Gestión de Bloques",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=bloque",
//            onSelectRow: function(id) {
//                idSala = id
//                datosSalas = jQuery(jqGridSalas).getRowData(idSala);   // Recuperar los datos de la fila seleccionada
//                
//            }
        }).jqGrid('navGrid', '#pTablaBloques', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {   // Antes de enviar a Departamento->edit(...) se agrega un POST
            modal:true, jqModal:true,
            width:500,
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
            width:300,
        },
        {multipleSearch:true, multipleGroup:true}
    )
}

function crearTablaSala() {
        jqGridSalas = jQuery("#tablaSalas").jqGrid({
            url:'controlador/fachada.php',
            datatype: "json",
            mtype: 'POST',
            postData: {
                clase: 'Sala',
                oper:'select'
            },
            colNames:['SALA','CAPACIDAD','BLOQUE','SEDE'],
            colModel:[
                {name:'nombre', index:'nombre', width:100, align:'center', editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'capacidad', index:'capacidad', width:100, editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'bloque', index:'bloque', width:100, align:'center', editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }},
                {name:'sede', index:'sede', width:100, editable:true, editoptions:{size:37,
                        dataInit: function(elemento) {$(elemento).width(282)}
                    }}
            ],
            rowNum:100,
            width:700,
            rowList:[100,200,300],
            pager: '#pTablaSalas',
            sortname: 'nombre',
            viewrecords: true,
            sortorder: "asc",
            caption:"Gestión de Salas",
            multiselect: false,
            editurl: "controlador/fachada.php?clase=Sala",
//            onSelectRow: function(id) {
//                idSala = id
//                datosSalas = jQuery(jqGridSalas).getRowData(idSala);   // Recuperar los datos de la fila seleccionada
//                
//            }
        }).jqGrid('navGrid', '#pTablaSalas', {
            refresh: true,
            edit: true,
            add: true,
            del: true,
            search: true
        },
        {   // Antes de enviar a Departamento->edit(...) se agrega un POST
            modal:true, jqModal:true,
            width:500,
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
            width:300,
        },
        {multipleSearch:true, multipleGroup:true}
    )
}


});


    
    
    


    
