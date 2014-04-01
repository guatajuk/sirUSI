<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Bloque
 *
 * @author Sebas
 */
class Bloque implements Persistible {

    /**
     * Inserta una nueva fila enviada por $_POST
     * @param <type> $argumentos El array que contiene los argumentos enviados por $_POST
     */
    function add($argumentos) {
        error_log(print_r($argumentos));
        extract($argumentos);
        // Observe que se están usando procedimientos almacenados, se hubiera podido usar directamente un INSERT ...
        $ok = UtilConexion::$pdo->exec("insert into bloque(nombre,fk_sede) values ('$nombre','$fk_sede')");
        error_log("insert into bloque(nombre,fk_sede) values ('$nombre','$fk_sede')");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "No se pudo agregar el bloque"));
    }

    /**
     * Actualiza una fila.
     * @param <type> $argumentos Un array con el id a buscar y el nuevo tema
     */
    function edit($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("UPDATE bloque SET nombre='$nombre',fk_sede='$fk_sede' where id=$id");
        error_log("UPDATE bloque SET nombre='$nombre',fk_sede='$fk_sede' where id=$id");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Fallo la actualización de los datos"));
    }

    /**
     * Elimina las filas cuyos IDs se pasen como argumentos.
     * @param <type> $argumentos los IDs de las salas a ser eliminados.
     * $argumentos es un cadena que contiene uno o varios números separados por
     * comas, que corresponden a los IDs de las filas a eliminar.
     */
    function del($argumentos) {
        extract($argumentos);
        //$ok = UtilConexion::$pdo->exec("DELETE FROM sala WHERE idsala=".$argumentos['id']."");
        $ok = UtilConexion::$pdo->exec("DELETE FROM bloque WHERE id=$id");
        error_log("DELETE FROM bloque WHERE id=$id");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Fallo la eliminacion"));
    }

    /**
     * Devuelve los datos necesarios para construir una tabla dinámica.
     * @param <type> $argumentos los argumentos enviados por:
     *               Sala.js.crearTablaSala()
     */
    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); // Se construye la clausula WHERE
        if ($where) {
            $where = $where . " AND id <> '0'";
        } else {
            $where = " WHERE id <> '0'";
        }
        extract($argumentos);
//error_log("SELECT sala.idsala, sala.nombre FROM sala $where");
        $count = UtilConexion::$pdo->query("SELECT bloque.id, bloque.nombre FROM bloque $where")->rowCount();



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

        $sql = "SELECT * FROM bloque $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";

        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['id'],
                'nombre' => [$fila['nombre']],
                'fk_sede' => [$fila['fk_sede']],
            ];
        }
// Quite los comentarios para ver el array original y el array codificado en JSON
//        error_log(print_r($respuesta, TRUE));
//        error_log(print_r(json_encode($respuesta), TRUE));
        echo json_encode($respuesta);
    }

    /**
     * Devuelve un array asociativo de la forma: {"id1":"Dato1", "id2":"Dato2", ...,"idN":"DatoN"}
     */
    public function getLista() {
        $filas['0'] = 'Seleccione un bloque';
        $filas += UtilConexion::$pdo->query("SELECT * FROM bloque ORDER BY id")->fetchAll(PDO::FETCH_KEY_PAIR);
        error_log(print_r($filas, TRUE));
        error_log(print_r(json_encode($filas), TRUE));
        echo json_encode($filas);
    }

}
?>
