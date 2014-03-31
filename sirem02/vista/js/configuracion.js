/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
    $('#configuracion-tonteria').html('Regla para definir todos los componentes de esta pagina: "<b>configuracion</b>-nombre-control"');

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
        alert('falta enviar/recibir estos datos en formato JSON')
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
        uploader.start();
        event.preventDefault();
    });
    uploader.init();



});
