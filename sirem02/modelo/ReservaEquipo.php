<?php

class ReservaEquipo {
    
    
     
    

    public function actualizarHorarioReserva($argumentos) {
        extract($argumentos);
        $sql = "UPDATE reserva_equipo set fecha_solicitud='$start', fecha_fin='$end' WHERE id=$id";
        UtilConexion::$pdo->exec($sql);
        echo UtilConexion::getEstado();
    }

    public function actualizarReserva($argumentos) {
        extract($argumentos);
        $sql = "UPDATE reserva_equipo SET fk_equipo='$fk_equipo', fecha_solicitud='$start', fk_usuario='$fk_usuario', estado='$estado', observaciones='$observaciones', fecha_fin='$end', color='$color' WHERE id=$idReserva";
        UtilConexion::$pdo->exec($sql);
        echo UtilConexion::getEstado();
    }

//    public function insertarReserva($argumentos) {
//        extract($argumentos);
//        $sql = "INSERT INTO reserva_equipo( fk_equipo, fecha_solicitud, fk_usuario, estado, observaciones, fecha_fin,color) VALUES ($fk_equipo,'$start', $fk_usuario, '$estado', '$observaciones', '$end','$color') RETURNING id";
//        UtilConexion::$pdo->exec($sql);
//        $x = UtilConexion::getEstado();
//        $id = UtilConexion::$pdo->lastInsertId();
//        $x = UtilConexion::getEstado();
//        echo json_encode(['id' => $id]);
//    }
    
    public function eliminarReserva($argumentos) {
        extract($argumentos);
        error_log("DELETE FROM reserva_equipo WHERE id = $idReserva");
        UtilConexion::$pdo->exec("DELETE FROM reserva_equipo WHERE id = $idReserva");
        echo UtilConexion::getEstado();
    }

    private static function getUsuario($user) {
        $nombre = 'Usuario desconocido';
        $usuario = UtilConexion::$pdo->query("SELECT nombre, apellidos FROM usuario WHERE cedula = '$user'")->fetch();
        $x = UtilConexion::getEstado();
        if ($usuario['nombre']) {
            $nombre = $usuario['nombre'];
            $apellido = $usuario['apellidos'];
        }
        return $nombre . " " . $apellido;
    }

    public function getEventos($argumentos) { // OJO debe filtrarse además de la sala el rango de fechas recibido 
        extract($argumentos);
        if ($idEquipo) {
            $where = "WHERE fk_equipo = $idEquipo";
        }
        $eventos = [];
        foreach (UtilConexion::$pdo->query("SELECT * FROM reserva_equipo $where") as $fila) {
            $eventos[] = [
                'id' => "{$fila['id']}",
                'title' => self::getUsuario($fila['fk_usuario']),
                'start' => "{$fila['fecha_solicitud']}",
                'end' => "{$fila['fecha_fin']}",
                'fk_usuario' => "{$fila['fk_usuario']}",
                'observaciones' => "{$fila['observaciones']}",
                'estado' => "{$fila['estado']}",
                color => "{$fila['color']}",
                allDay => false
            ];
        }
        echo json_encode($eventos);
    }

}

?>
