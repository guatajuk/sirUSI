var anchoContenedor; // El ancho disponible en el contenedor
var fechaInicio, fechaFin;
var usuario;

$(document).on('ready', function() {

    // CUIDADO: para pruebas se está suponiendo el usuario autenticado:
    usuario = {id: '0002', nombre: 'Darwin Cuesta'};

    anchoContenedor = $('#columnaContenido').outerWidth() * 0.94;

    $('#index-frmautentica').dialog({
        autoOpen: true,
        width: 355,
        height: 200,
        modal: true,
        open: function() {
            $("#index-frmautentica label").css("width", "70px");
            $("#index-frmautentica input").css("width", "180");

            $(".ui-dialog-titlebar-close").hide();
            $("#autentica-aceptar").button({icons: {primary: "ui-icon-check"}});
            $("#autentica-cancelar").button({icons: {primary: "ui-icon-close"}});
        },
        buttons: [
            {id: "autentica-aceptar", text: "Aceptar", click: function() {
                    var opciones = autenticar();
                    // en esta parte se valida el acceso o no a la aplicación **********************
                    if (opciones.hasOwnProperty('Cerrar sesión')) { // si existe esta opción...
//                        alert('Hola ' + $('#index-nombre-usuario').val() + '. Te haz autenticado correctamente.');
                        mostrarMenu(opciones);
                    } else {
                        // ¿permitir reintentar? ¿qué hacer?
//                        alert($('#index-nombre-usuario').val() + '. Tu usuario o contraseña no son correctos.');
                    }
                    $(this).dialog("close");
                }},
            {id: "autentica-cancelar", text: "Cancelar", click: function() {
                    $(this).dialog("close");
                }}
        ]
    });
    $(".ui-dialog, .ui-dialog-titlebar, .ui-dialog-buttonpane").css({"font-size": "95%"});


    $(window).on('resize', function() {
        anchoContenedor = $('#columnaContenido').outerWidth() * 0.94;
        if (grid = $('.ui-jqgrid-btable:visible')) {
            grid.each(function(index) {
                var gridId = $(this).attr('id');
                gridParentWidth = $('#gbox_' + gridId).parent().width() * 0.99;
                jQuery('#' + gridId).setGridWidth(gridParentWidth);
            });
        }
    });

    /**
     * Crear el menú de la aplicación
     * @param {array} opciones las opciones que se reciben al autenticarse
     * @returns {undefined}
     */
    function mostrarMenu(opciones) {
        // ver en ../includes/slideMenu cómo se implementó este plugin
        var menu = $("#leftcolumn").sliderMenu({// elemento al que se agrega el menú
            ancho: '160px', // ancho del panel que contiene el menú
            opciones: opciones, // las opciones para las cuales tiene privilegios el usuario, normalmente se cargan desde el servidor
            menu: {// el menú de opciones que se muestra
                'Recursos tecnológicos': [
                    'Detalle de equipos',
                    'Reserva de equipos'
                ],
                'Espacios de trabajo': [
                    'Detalle de salas',
                    'Reserva de salas'
                ],
                'Monitorías': [
                    'Asignación',
                    'Control'
                ],
                'Usuarios': [
                    'Comunidad',
                    'Privilegios'
                ],
                'Sistema': [
                    'Cerrar sesión',
                    'Configuración',
                    'Mantenimiento',
                    'Reportes',
                    'Utilidades'
                ]
            },
            vincular: function(linksDeOpciones) {
                var menu = $(this);
                // <linksDeOpciones> son los hipervículos correspondientes a la propiedad <menu>
                // para cada link (<a href="">) activo de la lista del menú hacer algo
                $(linksDeOpciones).each(function() {
                    var opcion = $(this).text(); // el nombre de una opción del menú

                    $(this).on('click', function(event) {
                        if (opcion === "Cerrar sesión") {
                            // al dar clic sobre una opción se pueden ejecutar directamente acciones como se muestra aquí
                            // Más adelante se supone que habrá un método cerrarSesion() en la clase Usuario
                            // $.post("controlador/fachada.php", {clase: 'Usuario', oper: 'cerrarSesion'}, function() {
                            if (opciones[opcion]) {  // si la opción no está bloqueada...
                                window.location.href = "index.html";
                            }
                            //})
                        } else {
                            // al dar clic sobre una opción también se puede cargar una página en un contenedor de la aplicación
                            menu.sliderMenu('cargar', {contenedor: $("#contentcolumn"), pagina: opciones[opcion]});
                        }
                        event.preventDefault();
                    });
                });
            }
        }).sliderMenu('opcionesBloqueadas'); // un simple ejemplo cuyo resultado se puede ver en la consola
    }

});

/**
 * Permite autenticar los usuarios que hacen uso del sistema y guarda en sesión
 * los datos necesarios
 * ¡¡¡¡IMPORTANTE!!!!! Faltan implementar la funcionalidad real de autenticación
 * y la posibilidad de cambiar de contraseña.
 */
function autenticar() {
    var opciones;
    // debe ser síncrono, por eso se utiliza $.ajax
    $.ajax({
        type: "POST",
        url: "controlador/fachada.php",
        data: {
            clase: "Usuario",
            oper: 'autenticar',
            usuario: $('#index-nombre-usuario').val(),
            contrasena: MD5($('#index-contrasena').val())
        },
        async: false,
        dataType: "json"
    }).done(function(data) {
        opciones = data;
    }).fail(function() {
        alert("Error en la autenticación");
    }).always(function() {
        $('#index-nombre-usuario').val('');
        $('#index-contrasena').val('');
//        if (aviso) {
//            $.unblockUI();
//        }
    });
    return opciones;
}

/**
 * Elimina los actuales elementos de un combo y agrega los del argumento.
 * @param {Array} elementos Un array asociativo con los elementos 
 * @returns {jQuery.fn.agregarElementos}
 */
jQuery.fn.agregarElementos = function(elementos) {
    var combo = this;
    combo.empty();

    if (typeof elementos[0] === 'object') {  // los datos vienen de tipo PDO::FETCH_ASSOC
        for (var i in elementos) {
            var elemento = $.map(elementos[i], function(value, index) {
                return [value];
            });
            combo.append($("<option></option>").attr("value", elemento[0]).text(elemento[1]));
        }
    } else {  // los datos vienen de tipo FETCH_KEY_PAIR
        $.each(elementos, function(indice, valor) {
            combo.append($("<option></option>").attr("value", indice).text(valor));
        });
    }
    return combo;
};

jQuery.fn.getSelectList = function(parametros) {
    var combo = this;
    var asincrono = ("async" in parametros) ? parametros['async'] : false;
    var aviso = ("aviso" in parametros) ? parametros['aviso'] : false;

    if (!("id" in parametros)) {
        parametros['id'] = $(this).attr('id');
    }
    if (!("dataType" in parametros)) {
        parametros['dataType'] = 'json';
    }

    $.ajax({
        type: "POST",
        url: "controlador/fachada.php",
        beforeSend: function(xhr) {
            if (aviso) {
                // $.blockUI({message: getMensaje(aviso)});
            }
        },
        data: parametros,
        async: asincrono,
        tipoRetorno: parametros['dataType']  // [xml|html|json|jsonp|text]
    }).done(function(data) {
        combo.html(data);
    }).fail(function() {
        console.log("Error de carga de datos: " + JSON.stringify(parametros));
        alert("Error de carga de datos");
    }).always(function() {
        if (aviso) {
            // $.unblockUI();
        }
    });
    return combo;
};

/**
 * Retorna una lista de elementos creados a partir de una tabla
 * @param {object} parametros clase, operacion y argumentos adicionales de la forma {p1:v1, .. pN:vN}, incluso el parámetro asincrono[true|false] por defecto false
 * @returns Object Un objeto con la lista de la forma {id1:elemento1, .. idN:elementoN}
 */
function getElementos(parametros) {
    var asincrono = false, aviso = false, elementos = new Object();
    aviso = ("aviso" in parametros) ? parametros['aviso'] : false;
    asincrono = ("async" in parametros) ? parametros['async'] : false;
    mapear = ("mapear" in parametros) ? parametros['mapear'] : false;

    $.ajax({
        type: "POST",
        url: "controlador/fachada.php",
        beforeSend: function(xhr) {
            if (aviso) {
                // $.blockUI({message: getMensaje(aviso)});
            }
        },
        data: parametros,
        async: asincrono,
        dataType: "json"
    }).done(function(data) {
        elementos = data;
    }).fail(function() {
        console.log("Error de carga de datos: " + JSON.stringify(parametros));
        alert("Error de carga de datos");
    }).always(function() {
        if (aviso) {
            // $.unblockUI();
        }
    });
    return elementos;
}

/**
 * Descarga de manera controlada un archivo
 * @param String nombreArchivo El nombre del archivo a descargar
 */
function descargar(nombreArchivo) {
    $.fileDownload('controlador/fachada.php', {
        httpMethod: "POST",
        data: {
            clase: 'Utilidades',
            oper: 'descargar',
            archivo: nombreArchivo
        },
        failCallback: function(respuesta, url) {
            console.log('OJO: ' + respuesta)
            if (respuesta) {
                respuesta = jQuery.parseJSON(respuesta);
                alert('El intento de descarga reporta el siguiente error:<br>' + respuesta.mensaje);
            } else {
                alert('Sucedió un error inesperado intentando la descarga');
            }
        }
    });
}

/**
 * Devuelve la cadena con mayúsculas iniciales
 * @returns {String}
 */
String.prototype.capitalize = function() {
    return this.replace(/[^\s]+/g, function(str) {
        str = str.toLowerCase();
        if ('de del el la los las y o'.indexOf(str) > 0) {
            return str;
        } else {
            return str.substr(0, 1).toUpperCase() + str.substr(1);
        }
    });
};

