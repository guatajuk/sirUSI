/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {

    $.post("controlador/fachada.php", {// Comprobar comunicación C/S
        clase: 'Configuracion',
        oper: 'leerJson'
    }, function(data) {
        if (data.mensaje) {
            $("#configuracion-inicio").val($('#configuracion-inicio').val() + data.mensaje[0]);
            $("#configuracion-fin").val($('#configuracion-fin').val() + data.mensaje[1]);
        } else {
            alert("¡leerJson no responde nada!!!!");
        }
    }, "json");


});



$(function() {
    

    /*
     * Mostrar las fecha de inicio y finalización de fase (semestre) cargadas en libreria.js 
     * Pregunte al docente cómo llevar a cabo esto:
     * La función en el servidor que cargue los valores por defecto deberá tener lo siguiente para leer los valores guardados:
     * extract($argumentos);
     * $algunaVariable = json_decode(file_get_contents("../serviciosTecnicos/varios/config.json"), TRUE);
     * 
     * Para guardar, simplemente:
     * file_put_contents("../serviciosTecnicos/varios/config.json", json_encode($algunaVariable));
     */

    $("#configuracion-aceptar-rango-fechas").button().on('click', function(event) {
        /*
         * Aquí se deben modificar las variables globales fechaInicio y fechaFin definidas en Libreria
         * y enviarlas al servidor al archivo config.js
         */
        var configuracion_fecha_inicio = $("#configuracion-inicio").val();
        var configuracion_fecha_fin = $("#configuracion-fin").val();
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Configuracion',
            oper: 'escribirJson',
            inicio: configuracion_fecha_inicio,
            fin: configuracion_fecha_fin
        }, function(data) {
            if (data.mensaje) {
                alert("Fecha Modificada a:\n fecha inicial: " + data.mensaje[0] + " \n fecha final: " + data.mensaje[1]);

            } else {
                alert("¡La fecha no pudo ser modificada!!!!");
            }
        }, "json");

        event.preventDefault();
    });
    $("#configuracion-seleccionar-archivos").button();

    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'configuracion-seleccionar-archivos', // OJO se hace referencia a $("#configuracion-subir").button()
        container: $('#configuracion-contenedor-plupload').attr('id'), // ... or DOM Element itself
        url: 'controlador/fachada.php',
        multipart_params: {
            "clase": "Utilidades",
            "oper": "subirArchivo"
        },
        flash_swf_url: '../includes/plupload/js/Moxie.swf',
        silverlight_xap_url: '../includes/plupload/js/Moxie.xap',
        filters: {
            max_file_size: '50mb',
            mime_types: [
                {title: "Archivos de Microsoft Excel", extensions: "xlsx,xls"}
            ]
        },
        multi_selection: false,
        init: {
            StateChanged:function(up){
                if (up.state === plupload.STARTED) {
                    console.log("entro 1");
                    $.blockUI({ message: 'Espere mientras se procesa el archivo!'});
                }else if(up.state === plupload.STOPPED){
                    console.log("entro 2");
                    /*$.unblockUI();*/
                }
            },
            PostInit: function() {
                $('#configuracion-mensajes-carga').html('');
            },
            FilesAdded: function(up, files) {
                uploader.splice(1, 1); // reinicia la lista de archivos
                plupload.each(files, function(file) {
                    $('#configuracion-mensajes-carga').html('&nbsp;' + file.name + ' (' + plupload.formatSize(file.size) + ') listo para ser subido.');
                });
            },
            UploadProgress: function(up, file) {
                $('#configuracion-mensajes-carga').html('&nbsp;' + file.name + " (" + file.percent + "% subido)");
            },
            UploadComplete: function(uploader, files) { // Cuando termine de subir quedar listo para reiniciar subida
                $.unblockUI();
                console.log("entro 3");
                uploader.splice();
            },
            'FileUploaded': function(up, file, info) {
                var respuesta = jQuery.parseJSON(info.response);
                if (respuesta.error.message) {
                    $('#configuracion-mensajes-carga').html(respuesta.error.message);
                }
            },
            Error: function(up, err) {
                console.log("\nError #" + err.code + ": " + err.message);
            }
        }
    });

    $("#configuracion-subir-archivos").button().on('click', function(event) {
        if (confirm("Procesar este archivo causara que toda la programacion\n procesada al principio de semestre sea reemplazada por la actual.\n Esta udsted seguro/a?"))
        {
            
            uploader.start();
            event.preventDefault();
        }
        else
        {
            alert('El archivo no será procesado.');
            e.preventDefault();
        }

    });
    uploader.init();



});
