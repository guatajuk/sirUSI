/*
     CACU hizo cambios marcados con // --> OJO
	 Editar con Notepad++ ya que NetBeans se tira el idioma original
 */
(function($){
    $.fn.validationEngineLanguage = function(){
    };
    $.validationEngineLanguage = {
        newLang: function(){
            $.validationEngineLanguage.allRules = {
                "required": { // Add your regex rules here, you can take telephone as an example
                    "regex": "none",
                    "alertText": "Dato requerido",
                    "alertTextCheckboxMultiple": "Por favor seleccione una opción",
                    "alertTextCheckboxe": "Casilla requerida"
                },
                "minSize": {
                    "regex": "none",
                    "alertText": "Mínimo ",
                    "alertText2": " caracteres"
                },
				"groupRequired": {
                    "regex": "none",
                    "alertText": "Debe marcar al menos uno de los siguientes campos"
                },
                "maxSize": {
                    "regex": "none",
                    "alertText": "Máximo ",
                    "alertText2": " caracteres"
                },
		        "min": {
                    "regex": "none",
                    "alertText": "El valor mínimo es "
                },
                "max": {
                    "regex": "none",
                    "alertText": "El valor máximo es "
                },
		        "past": {
                    "regex": "none",
                    "alertText": "Fecha posterior a "
                },
                "future": {
                    "regex": "none",
                    "alertText": "Fecha inferior a "
                },	
                "maxCheckbox": {
                    "regex": "none",
                    "alertText": "Se ha excedido el número de opciones permitidas"
                },
                "minCheckbox": {
                    "regex": "none",
                    "alertText": "Por favor seleccione ",
                    "alertText2": " opciones"
                },
                "equals": {
                    "regex": "none",
                    "alertText": "Los datos no coinciden"
                },
				"creditCard": {
                    "regex": "none",
                    "alertText": "La tarjeta de crédito no es válida"

                },
                "phone": {
                    // credit: jquery.h5validate.js / orefalo
                    "regex": /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
                    "alertText": "Número de teléfono inválido"
                },
                "email": {
                    // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
                    "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,
                    "alertText": "Correo inválido"
                },
                "integer": {
                    "regex": /^[\-\+]?\d+$/,
                    "alertText": "No es un valor entero válido"
                },
                "number": {
                    // Number, including positive, negative, and floating decimal. credit: orefalo
                    "regex": /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/,
                    "alertText": "No es un valor decimal válido"
                },
                "date": {
                    "regex": /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/,
                    "alertText": "Fecha inválida, por favor utilice el formato AAAA-MM-DD"
                },
                "ipv4": {
                	"regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                    "alertText": "Direccion IP inválida"
                },
                "url": {
                    "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
                    "alertText": "URL Inválida"
                },
                "onlyNumberSp": {
                    "regex": /^[0-9\ ]+$/,
                    "alertText": "Sólo números"
                },
			    "onlyLetterSp": {
                    "regex": /^[a-zA-Z\ \']+$/,
                    "alertText": "Sólo letras"
                },
                "onlyLetterNumber": {
                    "regex": /^[0-9a-zA-Z]+$/,
                    "alertText": "No se permiten caracteres especiales"
                },
				// --- CUSTOM RULES -- Those are specific to the demos, they can be removed or changed to your likings
			    "phoneColombia": {  // <-- OJO, sin terminar de pulir. Ej.: 313714555, 8#6 8765555 ext 251, (057) 0#6-8765960
                    "regex": /^((\([0-9]{3}\))?( )?([0-9#]{1,3}[- ])(?!\d{10}))?\d{3}(\d{3})?\d{2}\d{2}( (Ext|ext) \d{1,4})?$/,
                    "alertText": "Ej.: 313714555, 8#6 8765555 ext 251, (057) 0#6-8765960"
                },
			    "nit": {  // <-- OJO, se deja entre 8 y 15 y no entre 9 y 10 para permitir CC cuando no haya nit
                    "regex": /^[0-9]{8,15}(\-[0-9]?)?$/,
                    "alertText": "Sólo dígitos con dígito de verificación opcional"
                },
				"filename": {  // <-- OJO
                    "regex": /^[áéíóúñÁÉÍÓÚÑ\w\-. ]+$/,
                    "alertText": "No use \\ / : * ? < > " + '"'
                },
			    "onlyLetterSpComma": {  // <-- OJO
                    "regex": /^\s*\d[\d\s\,]*$/,
                    "alertText": "Sólo números espacios y comas"
                },
                "onlyNumber": {  // <-- OJO
                    "regex": /^[0-9]+$/,
                    "alertText": "Sólo dígitos"
                },
                "password": {  // <-- OJO
                    "regex": /^(?=.*[A-Za-z])(?=.*[0-9])(?!.*[^A-Za-z0-9])(?!.*\s).{5,12}$/,
                    "alertText": "Se aceptan entre 5 y 12 caracteres, al menos una letra y un número. No se permiten caracteres especiales"
                },
                "ajaxUserCall": {
                    "url": "ajaxValidateFieldUser",
					// you may want to pass extra data on the ajax call
                    "extraData": "name=eric",
                    "alertTextLoad": "Cargando, espere por favor",
                    "alertText": "Este nombre de usuario ya se encuentra usado"
                },
                "ajaxNameCall": {
					// remote json service location
                    "url": "ajaxValidateFieldName",
					// error
                    "alertText": "Este nombre ya se encuentra usado",
					// if you provide an "alertTextOk", it will show as a green prompt when the field validates
                    "alertTextOk": "Este nombre está disponible",
					// speaks by itself
                    "alertTextLoad": "Cargando, espere por favor"
                },
                "validate2fields": {
                    "alertText": "Por favor entrar HELLO"
                }
            };
            
        }
    };
    $.validationEngineLanguage.newLang();
})(jQuery);

