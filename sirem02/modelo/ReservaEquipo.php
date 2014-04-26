<?php

$conteo = 0;

class ReservaEquipo {
    //Esta función se encarga de ejecutar la función almacenada, que se encarga de revisar si las fechas
    //que se ingresan, no colisionen; además se valida si el equipo a ingresar en dichas fechas, es el mismo
    //de la reserva colisionada; para así evitar que no hayan conflictos con equipos difrerentes ingresados en fechas
    //colisionadas
    public function disponible($start, $end, $fk_equipo) {
              
        $disponible = FALSE;        
        if (($rs = UtilConexion::$pdo->query("select colision2('$start'::TIMESTAMP, '$end'::TIMESTAMP, $fk_equipo)"))) {
            if (($fila = $rs->fetch(PDO::FETCH_ASSOC))) {
              
                UtilConexion::getEstado();
                if (isset($fila['colision2'])) {
                    $disponible = $fila['colision2'] ? TRUE : FALSE;
                }
            }
        }
        
        return $disponible;
    }

    public function actualizarHorarioReserva($argumentos) {
        extract($argumentos);
        $sql = "UPDATE reserva_equipo set fecha_inicio='$start', fecha_fin='$end' WHERE id=$id";
        UtilConexion::$pdo->exec($sql);
        echo UtilConexion::getEstado();
    }

    public function mostrarInvalidos($argumentos) {
        $sql = "SELECT * from reserva_equipo  WHERE estado <> 1 and (fecha_inicio+interval '10 minute')<current_timestamp";
        UtilConexion::$pdo->exec($sql);
        echo UtilConexion::getEstado();
    }

    /**
     * Inserta una o varias reservas de un equipo de acuerdo a la información recibida como argumentos
     * @param type $argumentos un array asociativo con los datos de la(s) reserva(s)
     */
    public function insertarReserva($argumentos) {
        extract($argumentos);
        $inicio = new DateTime($start);
        $fin = new DateTime($end);
        $horaInicio = substr($start, 11);
        $horaFin = substr($end, 11);
        $interval = DateInterval::createFromDateString('1 day');
        $fechas = new DatePeriod($inicio, $interval, $fin);
        //validamos si está disponible el equipo que ingresamos con la fecha de inicio y fin
        if ($this->disponible($start, $end, $fk_equipo)==FALSE) {
            $sql = "INSERT INTO reserva_equipo(fecha_inicio, fecha_fin, color, fk_usuario, fk_equipo, estado, observaciones, fk_responsable) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";
            $stmt = UtilConexion::$pdo->prepare($sql);
            $mensaje = '';
            foreach ($fechas as $fecha) {
                $fecha = $fecha->format('Y-m-d');
                $inicio = "$fecha $horaInicio";
                $fin = "$fecha $horaFin";
                $diaSemana = date("w", strtotime($fecha));
                if (count($dias) == 0) {
                    $dias[] = $diaSemana;
                }
                if (in_array($diaSemana, $dias)) {
                    $ok = $stmt->execute(array($inicio, $fin, $color, $fk_usuario, $fk_equipo, $estado, $observaciones, $fk_responsable));
                    if (!$ok) {
                        $mensaje .= "$inicio - $fin\n";
                    }
                }
            }
            $ok = TRUE;
            if ($mensaje) {
                $mensaje = "Falló la inserción de los siguientes registros:\n$mensaje";
                $ok = FALSE;
            }
        }
        else{            
            $mensaje = "Falló la inserción de los siguientes registros:\n$mensaje";
            $ok=FALSE;
        }
        echo json_encode(['ok' => $ok, 'mensaje' => $mensaje]);
    }

    //--------------------------------------------------------

    public function limpiarReserva($argumentos) {
        // El formato que espera postgres es: SELECT sede_eliminar('{v1,...,vn}');
        $ok = UtilConexion::$pdo->exec("select limpiar_reserva()");
        echo UtilConexion::getEstado();
    }

    function responder($argumentos) {
        //iniciamos la sesión
        session_start();
        //comprobamos si la sesión existe
        if (!isset($_SESSION["conteo"])) {
            //si no es el caso, iniciamos la sesión con 1
            $_SESSION["conteo"] = 1;
        } else {
            //si la sesión existe la sumamos
            $_SESSION["conteo"]++;
            //si la sesión es 10
            if ($_SESSION["conteo"] == 10) {
                //cuando vale 10 limpiamos todas las reservas                 
                $ok = UtilConexion::$pdo->exec("select limpiar_reserva()");
                //la sesión la reiniciamos con 1
                $_SESSION["conteo"] = 1;
            }
        }
        echo 'OK';
    }

    //--------------------------------------------------------

    //Esta función se encarga de eliminar uno o varias reservas similares
    public function eliminarReserva($argumentos) {
        extract($argumentos);
        if ($multi) {
            /* error_log("select min(r.id), max(r.id) FROM reserva_equipo r WHERE r.fk_usuario = '$fk_usuario' AND r.fk_responsable = '$fk_responsable'
              AND r.observaciones = '$observaciones' AND TO_CHAR(r.fecha_inicio,'HH24:MI') = substr('$start',12,5)
              AND TO_CHAR(r.fecha_fin,'HH24:MI') = substr('$end',12,5)"); */
            UtilConexion::$pdo->exec("DELETE FROM reserva_equipo r WHERE r.fk_usuario = '$fk_usuario' AND r.fk_responsable = '$fk_responsable'
                                        AND r.observaciones = '$observaciones' AND TO_CHAR(r.fecha_inicio,'HH24:MI') = substr('$start',12,5)
                                        AND TO_CHAR(r.fecha_fin,'HH24:MI') = substr('$end',12,5)");
            echo UtilConexion::getEstado();
        } else {
            UtilConexion::$pdo->exec("DELETE FROM reserva_equipo WHERE id = $idReserva");
            echo UtilConexion::getEstado();
        }
    }
    
    //Esta función se encarga de actualizar uno o más reservas similares

    public function actualizarReserva($argumentos) {
        extract($argumentos);
        if ($multi) {
            UtilConexion::$pdo->exec("UPDATE reserva_equipo SET fk_equipo=$fk_equipo, fk_usuario='$fk_usuario', color='$color', estado=$estado, observaciones='$observaciones', fk_responsable='$fk_responsable' 
                                        WHERE fk_usuario = '$fk_usuario' AND fk_responsable = '$fk_responsable'
                                        AND TO_CHAR(fecha_inicio,'HH24:MI') = substr('$start',12,5)
                                        AND TO_CHAR(fecha_fin,'HH24:MI') = substr('$end',12,5)");
            echo UtilConexion::getEstado();
        } else {
            UtilConexion::$pdo->exec("UPDATE reserva_equipo SET fk_equipo=$fk_equipo, fecha_inicio='$start', fk_usuario='$fk_usuario', fecha_fin='$end', color='$color', estado=$estado, observaciones='$observaciones', fk_responsable='$fk_responsable' WHERE id=$idReserva");
            echo UtilConexion::getEstado();
        }
    }

    
    private static function getUsuario($user) {
        $nombre = 'Usuario desconocido';
        $usuario = UtilConexion::$pdo->query("SELECT nombre,apellido FROM usuario WHERE codigo = '$user'")->fetch();
        $x = UtilConexion::getEstado();
        if ($usuario['nombre']) {
            $nombre = $usuario['nombre'];
            $apellido = $usuario['apellido'];
        }
        return $nombre . " " . $apellido;
    }

    public function getEventos($argumentos) {
        extract($argumentos);
        if ($idEquipo) {
            $where = "WHERE fk_equipo = $idEquipo";
        }
        $eventos = [];
        foreach (UtilConexion::$pdo->query("SELECT * FROM reserva_equipo $where") as $fila) {
            $eventos[] = [
                'id' => "{$fila['id']}",
                'title' => self::getUsuario($fila['fk_usuario']),
                'start' => "{$fila['fecha_inicio']}",
                'end' => "{$fila['fecha_fin']}",
                'fk_usuario' => "{$fila['fk_usuario']}",
                'fk_equipo' => "{$fila['fk_equipo']}",
                'estado' => "{$fila['estado']}",
                'observaciones' => "{$fila['observaciones']}",
                'fk_responsable' => "{$fila['fk_responsable']}",
                color => "{$fila['color']}",
                allDay => false
            ];
        }
        echo json_encode($eventos);
    }

}


?>
