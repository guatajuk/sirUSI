/**
 * Ejemplos varios
 * @returns {undefined}
 */
$(function() {

    $("#ejemplos-varios").accordion({
        heightStyle: "content"
    });

    // Es posible que varias páginas tengan un botón Aceptar. Esta podría ser una forma de evitar conflictos:
    $("#demosvarios_aceptar").button().on("click", function(event) {
        window.open('http://www.google.com/search?q=jQuery+API+Documentation');
        event.preventDefault();
    });

    $("#demosvarios_prueba").button().on("click", function() {
        $.post("controlador/fachada.php", {// Comprobar comunicación C/S
            clase: 'Utilidades',
            oper: 'verificarComunicacion'
        }, function(data) {
            if (data.mensaje) {
                alert('El servidor responde: ' + data.mensaje);
            } else {
                alert("¡Houston, tenemos problemas!");
            }
        }, "json");
    });

    $("#demosvarios_probar_algo").button().on("click", function() {
        $.post("controlador/fachada.php", {// probar alguna función del servidor
            clase: 'DemoFancyTree',
            oper: 'crearHojaXLSXConBasura'
        }, function(data) {
            if (data.ok) {
                alert('Proceso realizado correctamente');
            } else {
                alert('Tenemos problemas: ' + data.mensaje);
            }
        }, "json");
    });

    // Llenar un combo dinámicamente con datos disponibles en la capa de presentación
    $("#demosvarios_cboprueba").agregarElementos({id1: 'HTML 5', id2: 'Javascript', id3: 'JQuery'});

    // Llenar un combo con datos desde el servidor
    var departamentos = getElementos({'clase': 'Departamento', 'oper': 'getLista'});
    $("#demosvarios_cbodeptos").agregarElementos(departamentos);

    // Listar las ciudades de Caldas y mostrar el código y el nombre de la ciudad seleccionada
    $("#demosvarios_cbociudades").agregarElementos(getElementos({'clase': 'Ciudad', 'oper': 'getLista', 'departamento': '17'})).change(function() {
        alert('Usted seleccionó a ' + $("#demosvarios_cbociudades").val() + '-' + $("#demosvarios_cbociudades :selected").text());
    });

    $("#demosvarios_descargar_backup").button().on("click", function() {
        descargar('democrud.backup');
    });

    $("#demosvarios_descargar_vista").button().on("click", function() {
        descargar('vista de ejecucion.png');
    });

})

/*
 * Una simple demostración de cómo puede subir archivos al sistema.
 * Puede controlarse mejor, dada la potencia del componente utilizado. 
 */
$("#demo_upload").pluploadQueue({
    runtimes: 'html5,flash,silverlight,html4',
    url: 'controlador/fachada.php',
    //chunk_size: '1mb',
    //unique_names: true,  // si quita el comentario se usará un nombre aleatorio
    multiple_queues: false, // true: volver a mostrar los botones 'Agregar archivos' e 'Iniciar carga'
    filters: {
        max_file_size: '10mb',
        mime_types: [
            {title: "Image files", extensions: "jpg,gif,png"},
            {title: "Zip files", extensions: "zip"}
        ]
    },
    flash_swf_url: '../includes/plupload/js/plupload.flash.swf',
    silverlight_xap_url: '../includes/plupload/js/plupload.silverlight.xap',
    // redimensionar las imágenes que se suben
    resize: {width: 320, height: 240, quality: 90},
    // enviar parámetros adicionales
    multipart_params: {
        "clase": "Utilidades",
        "oper": "subirArchivo"
    },
    init: {// Eventos posteriores al inicio que suceden después de los eventos internos
        beforeUpload: function(up, file) {
            // hacer algo antes de cargar cada archivo
        },
        StateChanged: function(up) { // Llamado cuando el estado cambia, bien porque inicia la carga o porque termina
            if (up.state === plupload.STARTED) {
                // hacer algo cuando se da inicio al proceso de carga de archivos
            } else if (up.state === plupload.STOPPED) {
                // hacer algo cuando se finaliza el proceso de carga de archivos (¿análogo a UploadComplete?)
            }
        },
        UploadComplete: function(up, file, info) { // termina la carga de todos los archivos
            // Cuando <multiple_queues: false> se puede dejar por unos segundos el mensaje de cuántos archivos se cargaron
            // y seguidamente hacer reaparecer los botones 'Agregar archivos' e 'Iniciar carga'
            setTimeout(function() {
                var uploader = $('#demo_upload').pluploadQueue();
                if (uploader.total.uploaded === uploader.files.length) {
                    up.splice();
                    up.refresh();
                    $("#demo_upload .plupload_upload_status").css("display", "none");
                    $("#demo_upload .plupload_buttons").css("display", "inline");
                }
            }, 2000);
        },
        FileUploaded: function(up, file, info) {
            // hacer algo cuando la carga de un archivo ha finalizado
        },
        Error: function(up, args) { // Se llama cuando un error se ha producido. Maneja el error de archivo específico y el error general
            // hacer algo cuando sucedan errores
        }
    }
});