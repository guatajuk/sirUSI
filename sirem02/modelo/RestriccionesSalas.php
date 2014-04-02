<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of RestriccionesSalas
 *
 * @author USUARIO
 */
class RestriccionesSalas {

    /**
     * 
     * @param type $argumentos
     */
    public function mostrarRestricciones($argumentos) {
        extract($argumentos);
        
        
        error_log("select g.fecha_inicio||' '||rc.hora_inicio finicio, g.fecha_fin||' '||rc.hora_fin ffin, rc.dia, rc.id, rc.color,rc.fk_grupo,rc.fk_sala, u.nombre||' '|| u.apellido usuario
  from grupos g, restriccion_calendario rc,usuario u 
                where rc.fk_sala='F' and rc.fk_grupo=g.id
                and rc.fk_usuario = u.codigo;");
        $sql = "select g.fecha_inicio||' '||rc.hora_inicio finicio, g.fecha_fin||' '||rc.hora_fin ffin, rc.dia, rc.id, rc.color,rc.fk_grupo,rc.fk_sala, u.nombre||' '|| u.apellido usuario
  from grupos g, restriccion_calendario rc,usuario u 
                where rc.fk_sala='$idSala' and rc.fk_grupo=g.id
                and rc.fk_usuario = u.codigo;";

        $restricciones = [];
        foreach (UtilConexion::$pdo->query($sql) as $restriccion) {
            $inicio = new DateTime($restriccion['finicio']);
            $fin = new DateTime($restriccion['ffin']);
            $hora_inicio = $inicio->format('H:i:s');
            $hora_fin = $fin->format('H:i:s');
            $dias [] = $restriccion['dia'];
            $interval = dateInterval::createFromDateString('1 day');
            $fechas = new DatePeriod($inicio, $interval, $fin);
//            error_log("$hora_inicio--- $hora_fin");

            foreach ($fechas as $fecha) {
                $fecha = $fecha->format('Y-m-d');
//                error_log($fecha);
                $inicio = "$fecha $hora_inicio";
                $fin = "$fecha $hora_fin";
                $diaSemana = date("w", strtotime($fecha));
                if (count($dias) == 0) {
                    $dias[] = $diaSemana;
                }
                if (in_array($diaSemana, $dias)) {
                    $restricciones[] = [
                        'id' => $restriccion['id'],
                        'title' => $restriccion['usuario'],
                        'sala' => $restriccion['fk_sala'],
                        'start' => $inicio,
                        'end' => $fin,
                        'grupo' => $restriccion['fk_grupo'],
                        'color' => $restriccion['color'],
                        'allDay' => FALSE
                    ];
                }
            }
        }
        echo json_encode($restricciones);
                return $restricciones;

    }

    public function getReservas($argumentos) {
        extract($argumentos);
        $sql = "SELECT  rc.id, modalidad,rc.hora_inicio fecha_inicio, rc.hora_fin fecha_fin ,u.nombre || ' ' ||u.apellido as usuario ,color,fk_sala sala, fk_grupo grupo, dia
                FROM usuario u  inner join restriccion_calendario rc on u.codigo=rc.fk_usuario
                WHERE rc.fk_sala ='$idSala'
                order by usuario;";
        $reservas = [];
        foreach (UtilConexion::$pdo->query($sql) as $lista) {
            $reservas[] = [
                'id' => $lista['id'],
                'modalidad' => $lista['modalidad'],
                'title' => $lista['usuario'],
                'sala' => $lista['sala'],
                'start' => $lista['fecha_inicio'],
                'end' => $lista['fecha_fin'],
                'grupo' => $lista['grupo'],
                'dia' => $lista['dia'],
                'color' => $lista['color'],
                'allDay' => FALSE
//              'anotacion' => $evento['anotacion'] // no puede faltar el campo para observaciones
            ];
        }
        echo json_encode($reservas);
    }

    public function actualizarProgramacion($argumentos) {
        extract($argumentos);
        error_log("UPDATE restriccion_calendario
                   SET hora_inicio=$hora_inicio, hora_fin=$hora_fin
                   WHERE id=$idReserva");
        UtilConexion::$pdo->exec("UPDATE restriccion_calendario
                   SET hora_inicio=$hora_inicio, hora_fin=$hora_fin
                   WHERE id=$idReserva");

        UtilConexion::getEstado();
    }

    public function eliminarProgramacion($argumentos) {
        extract($argumentos);
        error_log($argumentos, 1);
        error_log("DELETE FROM restriccion_calendario WHERE id='$idReserva'");
        UtilConexion::$pdo->exec("DELETE FROM restriccion_calendario WHERE id=$idReserva");
        UtilConexion::getEstado();
    }

}

?>
