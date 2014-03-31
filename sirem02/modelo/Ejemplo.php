<?php

/**
 * Description of Xxxxxxxx
 * Las instancias de esta clase se conectan con la base de datos a traves de
 * una referencia que se tiene de PDO.
 * @author Carlos
 * 
 * 
 * IMPORTANTE: Realice cambios sólo en las líneas donde aparezca: <-------  OJO  ------<
 * 
 * 
 */
class Xxxxxxxx implements Persistible {

    /**
     * Inserta una nueva fila enviada por $_POST
     * @param <type> $argumentos El array que contiene los argumentos enviados por $_POST
     */
    function add($argumentos) {
        extract($argumentos);
        // Observe que se están usando procedimientos almacenados, se hubiera podido usar directamente un INSERT ...
        $ok = UtilConexion::$pdo->exec("INSERT INTO tabla_xxx(col1, .., colN) VALUES ($val1, $valN)");   // <-------  OJO  ------<
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "No se pudo agregar el registro"));
    }

    /**
     * Actualiza una fila.
     * @param <type> $argumentos Un array con el id a buscar y el nuevo tema
     */
    function edit($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("UPDATE tabla_xxx SET col1=$val1, .., colN=$valN WHERE condition");   // <-------  OJO  ------<
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la actualización de los datos"));
    }

    /**
     * Elimina la fila cuyos ID se pase como argumento.
     */
    function del($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("DELETE FROM tabla_xxx WHERE condition");   // <-------  OJO  ------<
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la eliminación"));
    }

    /**
     * Devuelve los datos necesarios para construir una tabla dinámica.
     * @param <type> $argumentos los argumentos enviados por:
     *               Xxxxxxxx.js.crearTablaXxxxxxxx()
     */
    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); // Se construye la clausula WHERE
        extract($argumentos);
        $count = UtilConexion::$pdo->query("SELECT id FROM tabla_xxx_select $where")->rowCount();   // <-------  OJO  ------<
        // Calcula el total de páginas por consulta
        if ($count > 0) {
            $total_pages = ceil($count / $rows);
        } else {
            $total_pages = 0;
        }

        // Si por alguna razón página solicitada es mayor que total de páginas
        // Establecer a página solicitada total paginas  (¿por qué no al contrario?)
        if ($page > $total_pages) {
            $page = $total_pages;
        }

        // Calcular la posición de la fila inicial
        $start = $rows * $page - $rows;
        //  Si por alguna razón la posición inicial es negativo ponerlo a cero
        // Caso típico es que el usuario escriba cero para la página solicitada
        if ($start < 0) {
            $start = 0;
        }

        $respuesta = [
            'total' => $total_pages,
            'page' => $page,
            'records' => $count
        ];

        $sql = "SELECT * FROM tabla_xxx_select $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";  // <-------  OJO  ------<
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['id'],                        // <-------  OJO  ------<
                'cell' => [$fila['id'], $fila['nombre']]    // <-------  OJO  ------<
            ];
        }
        // Quite los comentarios para ver el array original y el array codificado en JSON
        // error_log(print_r($respuesta, TRUE));
        // error_log(print_r(json_encode($respuesta), TRUE));
        echo json_encode($respuesta);
    }

    /**
     * Devuelve un array asociativo de la forma: {"id1":"Dato1", "id2":"Dato2", ...,"idN":"DatoN"}
     */
    public function getLista() {
        $filas['0'] = 'Seleccione un tabla_xxx';
        $filas += UtilConexion::$pdo->query("SELECT pkCol, colRepresentativa FROM tabla_xxx_select ORDER BY col_cualquiera")->fetchAll(PDO::FETCH_KEY_PAIR);
        echo json_encode($filas);
    }

}

?>
