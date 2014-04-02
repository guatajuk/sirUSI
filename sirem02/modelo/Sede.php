<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Sede
 *
 * @author EQUIPO
 */
class Sede {
    
    function add($argumentos) {
        extract($argumentos);
//        error_log("INSERT INTO sede(nombre,direccion)('$nombre', '$direccion')");
        // Observe que se están usando procedimientos almacenados, se hubiera podido usar directamente un INSERT ...
        $ok = UtilConexion::$pdo->exec("INSERT INTO sede(nombre,direccion) values('$nombre', '$direccion')");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "No se pudo agregar la sede"));
    }

    /**
     * Actualiza una fila.
     * @param <type> $argumentos Un array con el id a buscar y el nuevo tema
     */
    function edit($argumentos) {
        extract($argumentos);
        $ok = UtilConexion::$pdo->exec("UPDATE sede SET nombre='$nombre', direccion='$direccion' WHERE nombre='$nombre';");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la actualización de los datos"));
    }

    /**
     * Elimina las filas cuyos IDs se pasen como argumentos.
     * @param <type> $argumentos los IDs de los departamentos a ser eliminados.
     * $argumentos es un cadena que contiene uno o varios números separados por
     * comas, que corresponden a los IDs de las filas a eliminar.
     */
    function del($argumentos) {
        $datos = "" . $argumentos['id'] . "";
        error_log("DELETE FROM sede WHERE nombre='$datos'");
        $ok = UtilConexion::$pdo->exec("DELETE FROM sede WHERE nombre='$datos'");
        echo json_encode($ok ? array('ok' => $ok, "mensaje" => "") : array('ok' => $ok, "mensaje" => "Falló la eliminación"));
    }
    
    
    function select($argumentos) {
        $where = UtilConexion::getWhere($argumentos); // Se construye la clausula WHERE
//        if ($where) {
//            $where = $where . " AND nombre <> '0'";
//        } else {
//            $where = " WHERE nombre <> '0' ";
//        }
        extract($argumentos);
        error_log("SELECT nombre FROM sede $where");
        $count = UtilConexion::$pdo->query("SELECT nombre FROM sede $where")->rowCount();
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
 
        $sql = "SELECT nombre, direccion  FROM sede  $where ORDER BY $sidx $sord LIMIT $rows OFFSET $start";
        foreach (UtilConexion::$pdo->query($sql) as $fila) {
            $respuesta['rows'][] = [
                'id' => $fila['nombre'],
                'cell' => [$fila['nombre'], $fila['direccion']]
            ];
        }
        // Quite los comentarios para ver el array original y el array codificado en JSON
        // error_log(print_r($respuesta, TRUE));
        // error_log(print_r(json_encode($respuesta), TRUE));
        error_log(print_r($respuesta,1));
        echo json_encode($respuesta);
    }
}
