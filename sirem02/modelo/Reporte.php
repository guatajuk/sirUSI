<?php

/*
 * *******************************************************************************************************
 * IMPORTANTE: en realidad esta clase no hace parte de los CONCEPTOS DEL DOMINIO
 * por lo tanto redefinirla como UtilReportes y pasarla a la carpeta Utilidades con métodos estáticos
 * ********************************************************************************************************
 */

/**
 * Description of Reporte
 *
 * @author ingsw1
 * patron fbrica pura
 */
class Reporte {

    public function getPrestamoEquipos($argumentos) {
        extract($argumentos);

        //crea el archivo nuevo      
        $objPHPExcel = new PHPExcel();
        //nombre la hoja
        $objPHPExcel->getActiveSheet()->setTitle('Reporte');

        //orientacion pagina
        $objPHPExcel->getActiveSheet()->getPageSetup()->setHorizontalCentered(true);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);


        //encabezado
        $objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddHeader('&C&HUniversidad de Caldas');
        $objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddFooter('&L&B' . 'Reporte Generado &D&T' . '&RPage &P of &N');

        $objPHPExcel->getActiveSheet()->setShowGridlines(false);
/////////// //formato de celdas

        $objPHPExcel->getDefaultStyle()->getFont()->setName('Arial')
                ->setSize(10);
//combinar celdas

        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('B3:L3');



        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B3', "REPORTE PRESTAMO EQUIPOS");
        $objPHPExcel->getActiveSheet()->getStyle('B3')
                ->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                ->getStartColor()->setARGB('033C68');
        $objPHPExcel->getActiveSheet()->getStyle('B3')
                ->getFont()
                ->setSize(14)
                ->getColor()->setARGB('F0FFFF');
        $objPHPExcel->getActiveSheet()->getStyle('B3:L3')
                ->getborders()
                ->getallborders()
                ->setborderStyle(PHPExcel_Style_Border::BORDER_MEDIUM);
        $objPHPExcel->getActiveSheet()->getStyle('B3:L3')
                ->getAlignment()->sethorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER_CONTINUOUS);

//              
//encabezados de la tabla
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('B4', "CODIGO\nRESERVA")
                ->setCellValue('C4', "ID\nEQUIPO")
                ->setCellValue('D4', "NOMBRE\nEQUIPO")
                ->setCellValue('E4', "FECHA\nSOLICITUD")
                ->setCellValue('F4', "ID\nUSUARIO")
                ->setCellValue('G4', "NOMBRE\nUSUARIO")
                ->setCellValue('H4', "APELLIDOS\nUSUARIO")
                ->setCellValue('I4', "ESTADO")
                ->setCellValue('J4', "OBSERVACIONES")
                ->setCellValue('K4', "FECHA\nFIN")
                ->setCellValue('L4', "COLOR");

        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')
                ->getAlignment()->setWrapText(true);

        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')
                ->getAlignment()->setvertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);


//        
//       
        $styleArray = array(
            'font' => array(
                'bold' => true,
            ),
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            ),
            'borders' => array(
                'inside' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'outline' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//		'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//                'right'		=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//                'left'		=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM)
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startcolor' => array(
                    'argb' => 'FFA0A0A0',
                ),
                'endcolor' => array(
                    'argb' => 'FFFFFFFF',
                ),
            ),
        );



        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')->applyFromArray($styleArray);



        $styleArray1 = array(
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_SOLID,
                'startcolor' => array(
                    'argb' => 'CAC8C8',
                ),
            ),
            'borders' => array(
                'allborders' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'left' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
                'right' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
            ),
        );

        //construccion de la clausula where
        $where = '';
        if (count($estado) == 1) {
            $where = "where r.estado = $estado[0]";
            error_log("     where --> $where");
        }
        if (count($estado) == 2) {
            $where = "where r.estado = $estado[0] or r.estado = $estado[1]";
        }


        $estados = array('0' => 'solicitado', '1' => 'en uso', '2' => 'entregado');

//consulta
        $reporte = UtilConexion::$pdo->query("select r.id reserva, r.fk_equipo id_equipo, e.alias nombre_equipo, r.fecha_solicitud , r.fk_usuario id_usuario, u.nombre nombre_usuario, u.apellidos apellidos_usuario,r.estado estado_reserva, r.observaciones , r.fecha_fin, r.color
                                                from (reserva_equipo r JOIN usuario u ON r.fk_usuario = u.cedula )JOIN equipo e ON r.fk_equipo=e.id $where");
        $f = 5;
        //escribe en la hoja de calculo el resultado de la consulta
        foreach ($reporte as $fila) {
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('B' . $f, $fila['reserva'])
                    ->setCellValue('C' . $f, $fila['id_equipo'])
                    ->setCellValue('D' . $f, $fila['nombre_equipo'])
                    ->setCellValue('E' . $f, $fila['fecha_solicitud'])
                    ->setCellValue('F' . $f, $fila['id_usuario'])
                    ->setCellValue('G' . $f, $fila['nombre_usuario'])
                    ->setCellValue('H' . $f, $fila['apellidos_usuario'])
                    ->setCellValue('I' . $f, $estados[$fila['estado_reserva']])
                    ->setCellValue('J' . $f, $fila['observaciones'])
                    ->setCellValue('K' . $f, $fila['fecha_fin'])
                    ->setCellValue('L' . $f, $fila['color']);
            $objPHPExcel->getActiveSheet()->getStyle('B' . $f . ':' . 'L' . $f)->applyFromArray($styleArray1);

            if ($f % 2 != 0) {
                $objPHPExcel->getActiveSheet()->getStyle('B' . $f . ':' . 'L' . $f)->getFill()
                        ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                        ->getStartColor()->setARGB('FFFFE0');
            }
            $f++;
        }
        $objPHPExcel->getActiveSheet()->getStyle('B3' . ':L' .
                        $objPHPExcel->getActiveSheet()->getHighestRow())->getborders()
                ->getoutline()
                ->setborderStyle(PHPExcel_Style_Border::BORDER_MEDIUM);


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);


        //guardar el archivo
        $callStartTime = microtime(true);
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $fecha = date('Y-m-d--h-i-s');
        $nombreArchivo = "ReportePrestamoEquipos $fecha.xlsx";
        $rutaArchivo = "sir06/reportes/$nombreArchivo";
        $objWriter->save(DOCUMENT_ROOT . $rutaArchivo);
        $callEndTime = microtime(true);
        $callTime = $callEndTime - $callStartTime;
//        echo json_encode($nombreArchivo);
        echo json_encode($rutaArchivo);
    }

    public function getPrestamoEquiposporFecha($argumentos) {
        extract($argumentos);
        $inicio = $fechainicial . ' 00:00:00';
        $fin = $fechafinal . ' 00:00:00';

//creacion y formato libro de exel
//crea el archivo nuevo      
        $objPHPExcel = new PHPExcel();
        //nombre la hoja
        $objPHPExcel->getActiveSheet()->setTitle('Reporte');

        //orientacion pagina
        $objPHPExcel->getActiveSheet()->getPageSetup()->setHorizontalCentered(true);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);


        //encabezado
        $objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddHeader('&C&HUniversidad de Caldas');
        $objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddFooter('&L&B' . 'Reporte Generado &D&T' . '&RPage &P of &N');
        $objPHPExcel->getActiveSheet()->setShowGridlines(false);
/////////// //formato de celdas

        $objPHPExcel->getDefaultStyle()->getFont()->setName('Arial')
                ->setSize(10);
//combinar celdas
//combinar celdas

        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('B3:L3');



        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B3', "REPORTE PRESTAMO EQUIPOS");
        $objPHPExcel->getActiveSheet()->getStyle('B3')
                ->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                ->getStartColor()->setARGB('033C68');
        $objPHPExcel->getActiveSheet()->getStyle('B3')
                ->getFont()
                ->setSize(14)
                ->getColor()->setARGB('F0FFFF');
        $objPHPExcel->getActiveSheet()->getStyle('B3:L3')
                ->getborders()
                ->getallborders()
                ->setborderStyle(PHPExcel_Style_Border::BORDER_MEDIUM);
        $objPHPExcel->getActiveSheet()->getStyle('B3:L3')
                ->getAlignment()->sethorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER_CONTINUOUS);

//              
//encabezados de la tabla
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('B4', "CODIGO\nRESERVA")
                ->setCellValue('C4', "ID\nEQUIPO")
                ->setCellValue('D4', "NOMBRE\nEQUIPO")
                ->setCellValue('E4', "FECHA\nSOLICITUD")
                ->setCellValue('F4', "ID\nUSUARIO")
                ->setCellValue('G4', "NOMBRE\nUSUARIO")
                ->setCellValue('H4', "APELLIDOS\nUSUARIO")
                ->setCellValue('I4', "ESTADO")
                ->setCellValue('J4', "OBSERVACIONES")
                ->setCellValue('K4', "FECHA\nFIN")
                ->setCellValue('L4', "COLOR");

        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')
                ->getAlignment()->setWrapText(true);

        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')
                ->getAlignment()->setvertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);


//        
//       
        $styleArray = array(
            'font' => array(
                'bold' => true,
            ),
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            ),
            'borders' => array(
                'inside' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'outline' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//		'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//                'right'		=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//                'left'		=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM)
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startcolor' => array(
                    'argb' => 'FFA0A0A0',
                ),
                'endcolor' => array(
                    'argb' => 'FFFFFFFF',
                ),
            ),
        );



        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')->applyFromArray($styleArray);



        $styleArray1 = array(
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_SOLID,
                'startcolor' => array(
                    'argb' => 'CAC8C8',
                ),
            ),
            'borders' => array(
                'allborders' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'left' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
                'right' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
            ),
        );




//construccion clausula where
        $where = "where fecha_solicitud between '$inicio' and '$fin'";
// error_log("    archivo where--> $where");
        $estados = array('0' => 'solicitado', '1' => 'en uso', '2' => 'entregado');
        $reporte1 = UtilConexion::$pdo->query("select r.id reserva, r.fk_equipo id_equipo, e.alias nombre_equipo, r.fecha_solicitud , r.fk_usuario id_usuario, u.nombre nombre_usuario,u.apellidos apellidos_usuario, r.estado estado_reserva, r.observaciones , r.fecha_fin, r.color
                                                from (reserva_equipo r JOIN usuario u ON r.fk_usuario = u.cedula )JOIN equipo e ON r.fk_equipo=e.id $where");
        $f = 5;
        //escribe en la hoja de calculo el resultado de la consulta
        foreach ($reporte1 as $fila) {
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('B' . $f, $fila['reserva'])
                    ->setCellValue('C' . $f, $fila['id_equipo'])
                    ->setCellValue('D' . $f, $fila['nombre_equipo'])
                    ->setCellValue('E' . $f, $fila['fecha_solicitud'])
                    ->setCellValue('F' . $f, $fila['id_usuario'])
                    ->setCellValue('G' . $f, $fila['nombre_usuario'])
                    ->setCellValue('H' . $f, $fila['apellidos_usuario'])
                    ->setCellValue('I' . $f, $estados[$fila['estado_reserva']])
                    ->setCellValue('J' . $f, $fila['observaciones'])
                    ->setCellValue('K' . $f, $fila['fecha_fin'])
                    ->setCellValue('L' . $f, $fila['color']);
            $objPHPExcel->getActiveSheet()->getStyle('B' . $f . ':' . 'L' . $f)->applyFromArray($styleArray1);

            if ($f % 2 != 0) {
                $objPHPExcel->getActiveSheet()->getStyle('B' . $f . ':' . 'L' . $f)->getFill()
                        ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                        ->getStartColor()->setARGB('FFFFE0');
            }
            $f++;
        }
        $objPHPExcel->getActiveSheet()->getStyle('B3' . ':L' .
                        $objPHPExcel->getActiveSheet()->getHighestRow())->getborders()
                ->getoutline()
                ->setborderStyle(PHPExcel_Style_Border::BORDER_MEDIUM);


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);


        //guardar el archivo
        $callStartTime = microtime(true);
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $fecha = date('Y-m-d--h-i-s');
        $nombreArchivo = "ReportePrestamoEquiposporfecha $fecha.xlsx";
        $rutaArchivo = "sir06/reportes/$nombreArchivo";
        $objWriter->save(DOCUMENT_ROOT . $rutaArchivo);
        $callEndTime = microtime(true);
        $callTime = $callEndTime - $callStartTime;
//        echo json_encode($nombreArchivo);
        echo json_encode($rutaArchivo);
    }

    public function getPrestamoEquiposporEquipo($argumentos) {
        extract($argumentos);



//crea el archivo nuevo      
        $objPHPExcel = new PHPExcel();
        //nombre la hoja
        $objPHPExcel->getActiveSheet()->setTitle('Reporte');

        //orientacion pagina
        $objPHPExcel->getActiveSheet()->getPageSetup()->setHorizontalCentered(true);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);


        //encabezado
        $objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddHeader('&C&HUniversidad de Caldas');
        $objPHPExcel->getActiveSheet()->getHeaderFooter()->setOddFooter('&L&B' . 'Reporte Generado &D&T' . '&RPage &P of &N');

        $objPHPExcel->getActiveSheet()->setShowGridlines(false);
/////////// //formato de celdas

        $objPHPExcel->getDefaultStyle()->getFont()->setName('Arial')
                ->setSize(10);
//combinar celdas
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('B3:L3');



        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B3', "REPORTE PRESTAMO EQUIPOS");
        $objPHPExcel->getActiveSheet()->getStyle('B3')
                ->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                ->getStartColor()->setARGB('033C68');
        $objPHPExcel->getActiveSheet()->getStyle('B3')
                ->getFont()
                ->setSize(14)
                ->getColor()->setARGB('F0FFFF');
        $objPHPExcel->getActiveSheet()->getStyle('B3:L3')
                ->getborders()
                ->getallborders()
                ->setborderStyle(PHPExcel_Style_Border::BORDER_MEDIUM);
        $objPHPExcel->getActiveSheet()->getStyle('B3:L3')
                ->getAlignment()->sethorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER_CONTINUOUS);

//              
//encabezados de la tabla
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('B4', "CODIGO\nRESERVA")
                ->setCellValue('C4', "ID\nEQUIPO")
                ->setCellValue('D4', "NOMBRE\nEQUIPO")
                ->setCellValue('E4', "FECHA\nSOLICITUD")
                ->setCellValue('F4', "ID\nUSUARIO")
                ->setCellValue('G4', "NOMBRE\nUSUARIO")
                ->setCellValue('H4', "APELLIDOS\nUSUARIO")
                ->setCellValue('I4', "ESTADO")
                ->setCellValue('J4', "OBSERVACIONES")
                ->setCellValue('K4', "FECHA\nFIN")
                ->setCellValue('L4', "COLOR");

        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')
                ->getAlignment()->setWrapText(true);

        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')
                ->getAlignment()->setvertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);


//        
//       
        $styleArray = array(
            'font' => array(
                'bold' => true,
            ),
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
            ),
            'borders' => array(
                'inside' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'outline' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//		'bottom'	=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//                'right'		=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
//                'left'		=> array('style' => PHPExcel_Style_Border::BORDER_MEDIUM)
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startcolor' => array(
                    'argb' => 'FFA0A0A0',
                ),
                'endcolor' => array(
                    'argb' => 'FFFFFFFF',
                ),
            ),
        );



        $objPHPExcel->getActiveSheet()->getStyle('B4:L4')->applyFromArray($styleArray);



        $styleArray1 = array(
            'alignment' => array(
                'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
            ),
            'fill' => array(
                'type' => PHPExcel_Style_Fill::FILL_SOLID,
                'startcolor' => array(
                    'argb' => 'CAC8C8',
                ),
            ),
            'borders' => array(
                'allborders' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                'left' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
                'right' => array('style' => PHPExcel_Style_Border::BORDER_MEDIUM),
            ),
        );
        //construccion clausula where
        $where = "where e.alias='$nombre'";

        $estados = array('0' => 'solicitado', '1' => 'en uso', '2' => 'entregado');
        $reporte2 = UtilConexion::$pdo->query("select r.id reserva, r.fk_equipo id_equipo, e.alias nombre_equipo, r.fecha_solicitud , r.fk_usuario id_usuario, u.nombre nombre_usuario, u.apellidos apellidos_usuario, r.estado estado_reserva , r.observaciones , r.fecha_fin, r.color
         
from (reserva_equipo r JOIN usuario u ON r.fk_usuario = u.cedula )JOIN equipo e ON r.fk_equipo=e.id $where");

        $f = 5;
        //escribe en la hoja de calculo el resultado de la consulta
        foreach ($reporte2 as $fila) {
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue('B' . $f, $fila['reserva'])
                    ->setCellValue('C' . $f, $fila['id_equipo'])
                    ->setCellValue('D' . $f, $fila['nombre_equipo'])
                    ->setCellValue('E' . $f, $fila['fecha_solicitud'])
                    ->setCellValue('F' . $f, $fila['id_usuario'])
                    ->setCellValue('G' . $f, $fila['nombre_usuario'])
                    ->setCellValue('H' . $f, $fila['apellidos_usuario'])
                    ->setCellValue('I' . $f, $estados[$fila['estado_reserva']])
                    ->setCellValue('J' . $f, $fila['observaciones'])
                    ->setCellValue('K' . $f, $fila['fecha_fin'])
                    ->setCellValue('L' . $f, $fila['color']);
            $objPHPExcel->getActiveSheet()->getStyle('B' . $f . ':' . 'L' . $f)->applyFromArray($styleArray1);

            if ($f % 2 != 0) {
                $objPHPExcel->getActiveSheet()->getStyle('B' . $f . ':' . 'L' . $f)->getFill()
                        ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                        ->getStartColor()->setARGB('FFFFE0');
            }
            $f++;
        }
        $objPHPExcel->getActiveSheet()->getStyle('B3' . ':L' .
                        $objPHPExcel->getActiveSheet()->getHighestRow())->getborders()
                ->getoutline()
                ->setborderStyle(PHPExcel_Style_Border::BORDER_MEDIUM);


// Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);




        //guardar el archivo
        $callStartTime = microtime(true);
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $fecha = date('Y-m-d--h-i-s');
        $nombreArchivo = "ReportePrestamoEquipospornombre $fecha.xlsx";
        $rutaArchivo = "sir06/reportes/$nombreArchivo";
        $objWriter->save(DOCUMENT_ROOT . $rutaArchivo);
        $callEndTime = microtime(true);
        $callTime = $callEndTime - $callStartTime;
//        echo json_encode($nombreArchivo);
        echo json_encode($rutaArchivo);
    }

    public function getLista() {
        $filas[] = ['id' => 0, 'valor' => 'Seleccione un equipo'];
        $filas += UtilConexion::$pdo->query("SELECT id,alias FROM equipo ORDER BY alias")->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($filas);
    }

}

?>
