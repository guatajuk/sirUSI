<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Sala
 *
 * @author USUARIO
 */
class Sala {

//    public function getSelectXXXXXX() {
//        $select = "<select id='cbo_salas'>";
//        $select .= "<option value='0'>Seleccione una sala</option>";
//        foreach (UtilConexion::$pdo->query("SELECT cod_sala, 'Sala ' || cod_sala || ' bloque ' || fk_bloque AS nombre_sala
//                                            FROM salas
//                                            JOIN bloque ON bloque.nombre = salas.fk_bloque
//                                            ORDER BY bloque.nombre, salas.cod_sala") as $fila) {
//            $select .= "<option value='{$fila['cod_sala']}'>{$fila['nombre_sala']}</option>";
//        }
//        echo json_encode($select . "</select>");
//    }

    public function getSelect($argumentos) {
        $id = 'cbo' . rand(0, 99999);
        extract($argumentos);
        $select = "<select id='$id'>";
        $select .= "<option value='0'>Seleccione una sala</option>";
        foreach (UtilConexion::$pdo->query("SELECT cod_sala, 'Sala ' || cod_sala || ' bloque ' || fk_bloque AS nombre_sala
                                            FROM salas
                                            JOIN bloque ON bloque.nombre = salas.fk_bloque
                                            ORDER BY bloque.nombre, salas.cod_sala") as $fila) {
            $select .= "<option value='{$fila['cod_sala']}'>{$fila['nombre_sala']}</option>";
        }
        $select .= "</select>";
        echo tipoRetorno == 'json' ? json_encode($select) : $select;
    }

    public function insertarReserva($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("INSERT INTO reserva_sala (fk_cod_usuario, fk_cod_sala, fecha_inicio, fecha_fin, tipo_actividad,fk_responsable,color) VALUES ('$fk_usuario','$fk_sala','$start','$end','$tipo_actividad','$responsable','$color') RETURNING id_reserva_sala");
        error_log("INSERT INTO reserva_sala(fk_cod_usuario, fk_cod_sala, fecha_inicio, fecha_fin, tipo_actividad,fk_responsable,color) VALUES ('$fk_usuario','$fk_sala','$start','$end','$tipo_actividad','$responsable','$color') RETURNING id_reserva_sala");
        $id = UtilConexion::$pdo->lastInsertId();
        echo json_encode(['id' => $id]);
    }

    public function eliminarReserva($argumentos) {
        extract($argumentos);
        error_log($argumentos, 1);
        error_log("DELETE FROM reserva_sala WHERE id_reserva_sala=$idReserva");
        UtilConexion::$pdo->exec("DELETE FROM reserva_sala WHERE id_reserva_sala=$idReserva");
        UtilConexion::getEstado();
    }

    public function modificarReserva($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("UPDATE reserva_sala
                     SET fk_cod_usuario='$idUsuario', fk_cod_sala='$idSala', 
                     tipo_actividad='$tipoActividad', fk_responsable='$responsable', color='$color'
                     WHERE id_reserva_sala=$idReserva");
        UtilConexion::getEstado();
    }

    public function actualizarReserva($argumentos) {
        extract($argumentos);
        UtilConexion::$pdo->exec("UPDATE reserva_sala
                     SET  fecha_inicio='$start', fecha_fin='$end' 
                     WHERE id_reserva_sala=$idReserva");
        UtilConexion::getEstado();
    }

}

?>
