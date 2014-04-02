<?php

/**
 * Description of ReadFromExcel
 *
 * @author Sebas
 */
class UtilReadFromExcel {

    public static function prueba() {
        error_log("INGRESA A LA CLASE READ FROM EXCEL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    }

    public static function leerHojaHorarios() {
        $obj = new UtilReadFromExcel();






        
        $pdo = UtilConexion::$pdo;

        $pdo->exec('ALTER SEQUENCE grupos_id_seq RESTART WITH 1;');
        $pdo->exec('ALTER SEQUENCE horario_grupo_id_seq RESTART WITH 1;');
        $pdo->exec('ALTER SEQUENCE rol_id_seq RESTART WITH 1;');
        $pdo->exec('truncate table restriccion_calendario cascade;');
        $pdo->exec('truncate table reserva_equipo cascade;');
        $pdo->exec('truncate table rol cascade;');
        $pdo->exec('truncate table usuario cascade;');
        $pdo->exec('truncate table tipo_equipo cascade;');
        $pdo->exec('truncate table software cascade;');
        $pdo->exec('truncate table sede cascade;');
        $pdo->exec('truncate table asignatura cascade;');
        $pdo->exec('truncate table equipo cascade;');
        $pdo->exec('truncate table bloque cascade;');
        $pdo->exec('truncate table sala cascade;');
        $pdo->exec('truncate table equipo_sala cascade;');
        $pdo->exec('truncate table reserva_sala cascade;');
        $pdo->exec('truncate table programacion_monitores cascade;');
        $pdo->exec('truncate table control_monitorias cascade;');
        $pdo->exec('truncate table software_sala cascade;');
        $pdo->exec('truncate table registro_monitoria cascade;');
        $pdo->exec('truncate table login cascade;');
        $pdo->exec('truncate table grupos cascade;');
        $pdo->exec('truncate table reserva_equipo cascade;');
        $pdo->exec('truncate table dependencia cascade;');

        //$archivos = glob("../serviciosTecnicos/varios/*.xlsx");  // sensible a mayúsculas
        $archivos = ['../serviciosTecnicos/varios/Horarios.xlsx'];


        foreach ($archivos as $archivo) {
            error_log("entro al CICLO for each");

            $objPHPExcel = PHPExcel_IOFactory::load($archivo);

            $hojas = $objPHPExcel->getSheetNames();

            foreach ($hojas as $hoja) {
                $objWorksheet = $objPHPExcel->getSheetByName($hoja);
                //Obtener las posiciones de cada columna
                $posCodigo = $obj->getPosCodigo($objWorksheet);
                $posMateria = $obj->getPosMateria($objWorksheet);
                $posModalidad = $obj->getPosModalidad($objWorksheet);
                $posGrupo = $obj->getPosGrupo($objWorksheet);
                $posCupo = $obj->getPosCupo($objWorksheet);
                $posInscritos = $obj->getPosInscritos($objWorksheet);
                $posInicio = $obj->getPosInicio($objWorksheet);
                $posFin = $obj->getPosFin($objWorksheet);
                $posHorario = $obj->getPosHorario($objWorksheet);
                $posProfesor = $obj->getPosProfesor($objWorksheet);
                //Fin obtencion de posiciones

                $id = $obj->leerHojacedula($objWorksheet);
                $first_name = $obj->leerHojanombre($objWorksheet);
                $last_name = $obj->LeerHojaApellido($objWorksheet);
                for ($i = 0; $i < count($id); $i++) {
                    $usuarioQuery = "INSERT INTO usuario(codigo,nombre,apellido) VALUES('$id[$i]','$first_name[$i]','$last_name[$i]');";
//                    echo $usuarioQuery;
//                    echo '<br>';
                    $pdo->exec($usuarioQuery);
                }


                $highestRow = $objWorksheet->getHighestRow();
                $highestColumn = $objWorksheet->getHighestColumn();
                $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
                $row = array();
                $hojaEntera = array();
                for ($cont2 = 1; $cont2 < $highestRow; $cont2++) {
                    for ($cont1 = 0; $cont1 <= $highestColumnIndex; $cont1++) {
                        $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2)->getValue();
                        if (($cont1 === 6) || ($cont1 === 7)) {
                            if ((!strstr($data, '/')) && ($data != "Inicio") && ($data != "")) {



                                $timestamp = (intval($data) - 25569) * 86400;
                                $dateSwap = (string) date("m/d/Y", $timestamp);
                                array_push($row, $dateSwap);
                            } else {
                                array_push($row, $data);
                            }
                        } else {
                            array_push($row, $data);
                        }
                    }
                    array_push($hojaEntera, $row);
                    $row = array();
                }


                $posProfesor = $obj->getPosProfesor($objWorksheet);
                $objPHPExcel->disconnectWorksheets();
                unset($objPHPExcel);


                for ($cont3 = 1; $cont3 < $highestRow - 1; $cont3++) {
                    for ($cont4 = 0; $cont4 < count($hojaEntera[$cont3]); $cont4++) {
                        if ($cont4 === 0) {
                            if ($hojaEntera[$cont3][0] != '' && $hojaEntera[$cont3][1] != '' && $hojaEntera[$cont3][2] != '' && $hojaEntera[$cont3][1] != 'materia' && $hojaEntera[$cont3][1] != 'Materia') {
                                $programa = $hojaEntera[$cont3][$posModalidad];
                                $formatoModalidad = $obj->getFormatoModalidad($programa);
                                $asignaturaQuery = "INSERT INTO asignatura values('" . $hojaEntera[$cont3][$posCodigo] . "','" . $hojaEntera[$cont3][$posMateria] . "'," . $formatoModalidad . ");";
                                $pdo->exec($asignaturaQuery);
//                                echo($asignaturaQuery);
//                                echo '<br>';

                                $idgrupo = $hojaEntera[$cont3][0] . '-' . $hojaEntera[$cont3][3];
                                $fk_usuario_profe = $obj->getCodigoProfe($hojaEntera[$cont3][$posProfesor]);
                                $grupoQuery = "INSERT INTO grupos(id, fk_asignatura, fk_usuario_profe, cupos, fecha_inicio,fecha_fin)VALUES ('" . $idgrupo . "', '" . $hojaEntera[$cont3][$posCodigo] . "', '" . $fk_usuario_profe . "', " . $hojaEntera[$cont3][$posCupo] . ", to_date('" . $hojaEntera[$cont3][$posInicio] . "', 'DD-MM-YYYY') ,to_date('" . $hojaEntera[$cont3][$posFin] . "', 'DD-MM-YYYY'));";
                                $pdo->exec($grupoQuery);
//                                echo($grupoQuery);
//                                echo '<br>';
                                $horarios = $obj->disgregarHorario($hojaEntera[$cont3][8] . '');
                                $diasClases = $obj->getDias($horarios);
                                $sala;
                                $fk_grupo = $idgrupo;
                                $tipo = "Restrinccion";
                                if (isset($id[$cont3])) {
                                    $responsable = $id[$cont3];
                                } else {
                                    $responsable = 'Desconocido';
                                }

                                $inicio;
                                $duracion;
                                for ($i = 0; $i < count($horarios); $i++) {
                                    $sala = $obj->obtenerSala($horarios[$i],$pdo); //obtengo la sala para insertar en restrinccion_calendario

                                    $inicioDuracion = $obj->lexemaHorarios($pdo, $horarios[$i], $idgrupo); //retorno el un arreglo [INICIO,DURACION]
                                    $inicio = $inicioDuracion[0];
                                    $duracion = $inicioDuracion[1];
                                    $final = $inicioDuracion[2];
                                }
                                $obj->fecha($pdo, $hojaEntera[$cont3][$posInicio], $hojaEntera[$cont3][$posFin], $inicio, $final, $duracion, $responsable, $tipo, $fk_grupo, $sala, $diasClases, $hojaEntera[$cont3][$posMateria], $programa);
                            }
                        }
                    }
                }
            }
        }
        return 'recorrio';
    }

    public static function getDias($horarios) {
        $dias = array();
        for ($i = 0; $i < count($horarios); $i++) {
            $aux = $horarios[$i];
            array_push($dias, strstr($aux, " ", true));
        }
        return($dias);
    }

    //insersion horario_grupo
    public static function lexemaHorarios($pdo, $dato, $idgrupo) {
        $dia = '';
        $hora = '';
        $duracion = '';
        $largo = strlen($dato);
        $i = 0;
        //hallar lexema dia
        for ($i; $i < $largo; $i++) {
            if ($dato{$i} === ' ') {
                $i++;
                break;
            }
            $dia = $dia . $dato{$i};
        }
        //hallar lexema hora
        for ($i; $i < $largo; $i++) {
            if ($dato{$i} === '-') {
                $i++;
                break;
            }
            $hora = $hora . $dato{$i};
        }
        $horaNumero = $hora . ':00:00';

        //hallar lexema duracion Sa 8-10 OTRO ESPACIO
        for ($i; $i < $largo; $i++) {
            $duracion = $duracion . $dato{$i};
            if ($dato{$i} === ' ') {
                break;
            }
        }
        $duracionNumber = intval($duracion) * 60;

        $hora_fin = (intval($hora) + intval($duracion));
        $hora_fin = $hora_fin . ':00:00';
//        echo $hora_fin;
//        echo '<br>';
        //generar query para insercion en horario_grupo
//        $queryHorarioGrupo = "INSERT INTO horario_grupo (dia,hora_inicio,duracion,fk_grupo) VALUES('" . $dia . "','" . $horaNumero . "'," . $duracionNumber . ",'" . $idgrupo . "');";
//        echo $queryHorarioGrupo;
//        echo '<br>';
//
//        $pdo->exec($queryHorarioGrupo);

        $inicioDuracion = array();
        array_push($inicioDuracion, $horaNumero);
        array_push($inicioDuracion, $duracion);
        array_push($inicioDuracion, $hora_fin);
        return $inicioDuracion;
    }

    public static function disgregarHorario($horario) {
        $aux = '';
        $horarios = array();
        $largo = strlen($horario);
        $dato = 0;
        for ($i = 0; $i < $largo - 1; $i++) {
            if ($horario{$i} === '[') {
                $dato = 1;
                $aux = '';
                $i++;
            }
            if ($horario{$i} === ']') {
                $dato = 0;
            }
            if ($dato === 1) {
                $aux = $aux . $horario{$i};
            }
            if (($dato === 0) && ($horario{$i} != ' ')) {
                $var = '';
                $var = $aux;
                array_push($horarios, $var);
            }
        }
        return ($horarios);
    }

    //insersion restriccion_calendario
    public static function fecha($pdo, $fechaInicio, $fechaFin, $inicio, $final, $duracion, $responsable, $tipo, $fk_grupo, $sala, $clase, $fk_asignatura, $programa) {





        $timestamp = strtotime($fechaInicio);
        $day = date('D', $timestamp); //dia en letra que comenzaron clase

        $diaOrigen = intval($fechaInicio{0} . $fechaInicio{1}); //dia en numero en que comenzaron la clase
        $mesOrigen = intval($fechaInicio{3} . $fechaInicio{4});
        $anioOrigen = intval($fechaInicio{6} . $fechaInicio{7} . $fechaInicio{8} . $fechaInicio{9});
        $diaDestino = intval($fechaFin{0} . $fechaFin{1});
        $mesDestino = intval($fechaFin{3} . $fechaFin{4});
        $anioDestino = intval($fechaFin{6} . $fechaFin{7} . $fechaFin{8} . $fechaFin{9});



        $days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


        $diasDiferencia = $diaDestino - $diaOrigen;
        $mesesDiferencia = $mesDestino - $mesOrigen;
        $deltadias = ($mesesDiferencia * 30) + ($diasDiferencia);



        for ($i = 0; $i < count($clase); $i++) {

            $dia = $clase[$i]; //dia de la clase
            $diaNum = -1;
            if ($dia == "Lu") {
                $dia = "Mon";
                $diaNum = 1;
            }
            if ($dia == "Ma") {
                $dia = "Tue";
                $diaNum = 2;
            }
            if ($dia == "Mi") {
                $dia = "Wed";
                $diaNum = 3;
            }
            if ($dia == "Ju") {
                $dia = "Thu";
                $diaNum = 4;
            }
            if ($dia == "Vi") {
                $dia = "Fri";
                $diaNum = 5;
            }
            if ($dia == "Sa") {
                $dia = "Sat";
                $diaNum = 6;
            }
            if ($dia == "Dom") {
                $dia = "Sun";
                $diaNum = 0;
            }
            if ($day != $dia) {
                $contadorDias = 0;
                $posdiaclase = 0; //inicio de la clase
                $posdiainicio = 0;
                for ($k = 0; $k < count($days); $k++) {//obtengo la posicion del dia en la semana
                    if ($dia == $days[$k]) {
                        $posdiaclase = $k;
                    }
                    if ($day == $days[$k]) {
                        $posdiainicio = $k;
                    }
                }
                $bol = 1;
                while ($bol == 1) {

                    if ($posdiainicio === 7) {
                        $posdiainicio = 0;
                    }
                    if ($days[$posdiainicio] === $dia) {

                        $bol = 0;
                    }
                    $contadorDias++;
                    $posdiainicio++;
                }
                $diaClase = $diaOrigen + $contadorDias - 1;
                $mes = $mesOrigen;


                $contsemanas = 0;
                while ($contsemanas < $deltadias) {
                    if ($diaClase <= $diaDestino && $mes <= $mesDestino) {
                        $horarios = "$diaClase-$mes-$anioOrigen";

                        $queryRestriccionCalendario = "INSERT INTO restriccion_calendario(hora_inicio,hora_fin,fk_usuario,color,fk_sala,fk_grupo,dia) values(to_timestamp('" . $inicio . "', 'HH24:MI:SS'),to_timestamp('" . $final . "', 'HH24:MI:SS'),'" . $responsable . "','turquesa','" . $sala . "','" . $fk_grupo . "'," . $diaNum . ");";

                      $pdo->exec($queryRestriccionCalendario);
//                        echo $queryRestriccionCalendario;
//                        echo '<br>';
                    }

                    $contsemanas+=7;
                    $diaClase+=7;
                    if ($diaClase > 30) {
                        $diaClase - 30;
                        $mes++;
                    }
                }
            } else {
                $diaClase = $diaOrigen;
                $contsemanas = 0;
                $mes = $mesOrigen;
                while ($contsemanas < $deltadias) {
                    if ($diaClase <= $diaDestino && $mes <= $mesDestino) {
                        $horarios = "$diaClase-$mes-$anioOrigen";
                        $queryRestriccionCalendario = "INSERT INTO restriccion_calendario(hora_inicio,hora_fin,fk_usuario,color,fk_sala,fk_grupo,dia) values(to_timestamp('" . $inicio . "', 'HH24:MI:SS'),to_timestamp('" . $final . "', 'HH24:MI:SS'),'" . $responsable . "','#0FD9AA','" . $sala . "','" . $fk_grupo . "','" . $fk_asignatura . "','" . $programa . "'," . $diaNum . ");";
                        $pdo->exec($queryRestriccionCalendario);
//                        echo $queryRestriccionCalendario;
//                        echo '<br>';
                    }

                    $contsemanas+=7;
                    $diaClase+=7;
                    if ($diaClase > 30) {
                        $diaClase - 30;
                        $mes++;
                    }
                }
            }
        }
    }

    public static function obtenerSala($inicial,$pdo) {
        $espacios = 0;
        $sala = '';
        for ($i = 0; $i < strlen($inicial); $i++) {
            if ($inicial{$i} === " ") {
                $espacios++;
            }
            if ($espacios >= 2) {
                $sala = $sala . $inicial{$i};
            }
        }
        
        $querySala = "INSERT INTO sala(nombre) values('" . $sala . "');";
//        echo ($querySala);
//        echo '<br>';
        $pdo->exec($querySala);
        return $sala;
    }

    public static function leerHojacedula($objWorksheet) {


        $coordenada = 0;


        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Profesor") {
                    $coordenada = $cont1;
                }
            }
        }
        $identidades = array();
        for ($cont3 = $coordenada; $cont3 <= $coordenada; $cont3++) {
            for ($cont4 = 3; $cont4 <= $highestRow; $cont4++) {
                $cedula = $objWorksheet->getCellByColumnAndRow($coordenada, $cont4);
                if ($cedula != "Profesor") {

                    $identificacion = strchr($cedula, ':', true); //strstr desde un caracter hasta el final   
                    array_push($identidades, $identificacion); //SE AGREGA LA CEDULA AL VECTOR 
                }
            }
        }
        return $identidades;
    }

    public static function LeerHojaApellido($objWorksheet) {

        $coordenada = 0;

        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $celda = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($celda == "Profesor") {

                    $coordenada = $cont1;
                }
            }
        }
        $nombres = array();
        for ($cont3 = $coordenada; $cont3 <= $coordenada; $cont3++) {
            for ($cont4 = 3; $cont4 <= $highestRow; $cont4++) {
                $name = $objWorksheet->getCellByColumnAndRow($coordenada, $cont4);
                if ($name != "Profesor") {
                    $name = strstr($name, ':'); //strstr desde un caracter hasta el final   :n
                    if ($name === ':N/I') {
                        $name = 'DESCONOCIDO';
                    } else {
                        $name = strstr($name, $name{1});
                        $name = strchr($name, ' ', true);
                    }
                    array_push($nombres, $name); //SE AGREGA EL APELLIDO AL ARRAY
                }
            }
        }
        return $nombres;
    }

    public static function leerHojanombre($objWorksheet) {


        $coordenada = 0;

        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $celda = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($celda == "Profesor") {

                    $coordenada = $cont1;
                }
            }
        }
        $names = array();
        for ($cont3 = $coordenada; $cont3 <= $coordenada; $cont3++) {
            for ($cont4 = 3; $cont4 <= $highestRow; $cont4++) {
                $nombre = $objWorksheet->getCellByColumnAndRow($coordenada, $cont4);
                if ($nombre != "Profesor") {
                    $nombre = strstr($nombre, ':'); //strstr desde un caracter hasta el final   :n
                    if ($nombre === ':N/I') {
                        $nombre = 'DESCONOCIDO';
                        array_push($names, $nombre); //SE AGREGA EL APELLIDO AL ARRAY
                    } else {
                        $nombre = strstr($nombre, $nombre{1});
                        $nombre = strstr($nombre, ' ');
                        $espacios = 0;
                        $apellido = '';
                        for ($i = 0; $i < strlen($nombre); $i++) {    //strlen($nombre)
                            if ($nombre{$i} === " ") {
                                $espacios++;
                            }// }
                            if ($espacios === 2) {
                                $contes = 0;
                                for ($i = 0; $i < strlen($nombre); $i++) {
                                    if ($nombre{$i} === " ") {
                                        $contes++;
                                    }
                                    if ($contes >= 2) {
                                        $apellido = $apellido . $nombre{$i};
                                    }
                                }
                            }
                            if ($espacios === 3) {
                                $contador = 0;
                                for ($i = 0; $i < strlen($nombre); $i++) {
                                    if ($nombre{$i} === " ") {
                                        $contador++;
                                    }
                                    if ($contador >= 3) {
                                        $apellido = $apellido . $nombre{$i};
                                    }
                                }
                            }
                        }
                        array_push($names, $apellido); //SE AGREGA EL APELLIDO AL ARRAY
                    }
                }
            }
        }
        return $names;
    }

    public static function getCodigoProfe($cod) {
        $identificacion = strchr($cod, ':', true);
        return $identificacion;
    }

    /* INICIO DE METODOS PARA OBTENER LAS POSICIONES DE CADA CAMPO */

    public static function getPosCodigo($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Codigo") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSCODIGO: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosMateria($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Materia") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSMATERIA: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosModalidad($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Modalidad") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSModalidad: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosGrupo($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Grupo") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSGrupo: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosCupo($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Cupo") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSCupo: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosInscritos($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Inscritos") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSInscritos: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosInicio($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Inicio") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSInicio: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosFin($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Fin") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSFin: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosHorario($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Horario") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSHorario: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getPosProfesor($objWorksheet) {
        $coordenada = 0;
        $highestRow = $objWorksheet->getHighestRow();
        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);
        for ($cont1 = 1; $cont1 < $highestRow; $cont1++) {
            for ($cont2 = 0; $cont2 <= $highestColumnIndex; $cont2++) {
                $data = $objWorksheet->getCellByColumnAndRow($cont1, $cont2);
                if ($data == "Profesor") {
                    $coordenada = $cont1;
                    break;
                }
            }
        }
//        echo 'POSPROFESOR: ';
//        echo $coordenada;
//        echo '<br>';
        return $coordenada;
    }

    public static function getFormatoModalidad($modalidad) {
        $formato;
        switch ($modalidad) {
            case "Presencial":
                $formato = 0;
                break;
            case "semipresencial":
                $formato = 1;
                break;
            case "No presencial":
                $formato = 2;
                break;
            case "Formal":
                $formato = 3;
                break;
            case "No formal":
                $formato = 4;
                break;
            case "Pregrado":
                $formato = 5;
                break;
            case "Postgrado":
                $formato = 6;
                break;
            default:
                $formato = -1;
        }
        return $formato;
    }

}

?>
