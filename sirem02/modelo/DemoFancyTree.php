<?php

/**
 * Ejemplo para crear un arbol JSON a partir de una tabla "opciones_programa" como la que se 
 * muestra enseguida, dicha tabla se basa en la teoría de cómo crear un árbol a partir de un array
 *        |----------------------------|
 *        |id | id_padre| nombre       |
 *        |---+---------+--------------|
 *        | 1 |         | Opcion 1     |
 *        | 2 |    1    | Opcion 1.1   |
 *        | 3 |    2    | Opcion 1.1.1 |
 *        | 4 |    2    | Opcion 1.1.2 |
 *        | 5 |    1    | Opcion 1.2   |
 *        | 6 |    5    | Opcion 1.2.1 |
 *        |...|   ...   | ...          |
 *        |----------------------------|
 */
class DemoFancyTree {

    private $pdo;

    function __construct() {
        try {
            $baseDeDatos = 'geadbilab02013';
            $servidor = 'localhost';  // 127.0.0.1:80
            $puerto = '5432';  // puerto postgres
            $usuario = 'postgres';
            $contrasena = '1-876-888';
            $this->pdo = new PDO("pgsql:host=$servidor port=$puerto dbname=$baseDeDatos", $usuario, $contrasena);
        } catch (PDOException $e) {
            error_log('error: ' . $e->getMessage());
        }
    }

    /**
     * Devuelve una estructura JSON que representa el árbol resultante de evaluar 
     * el contenido de la tabla 'opciones_programa'. Dicha estructura cumple con
     * el estandar esperado por el plugin FancyTree
     */
    function getArbol() {
        ini_set('xdebug.max_nesting_level', 200);  // <-- OJO para que no aborte la recursividad luego de 100 llamados
        $sql = "SELECT id, id_padre, nombre FROM opciones_programa ORDER BY id";
        $filas = $this->pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([['key' => 0, 'title' => 'Opciones del programa', 'children' => $this->crearArbol($filas)]]);
    }

    function crearArbol($filas, $idPadre = null) {
        $elemento = [];
        foreach ($filas as $item) {
            if ($item['id_padre'] == $idPadre) {
                $children = $this->crearArbol($filas, $item['id']);

                $tmp = [
                    'key' => $item['id'],
                    'title' => $item['nombre'],
                    'id_padre' => $item['id_padre']
                ];

                if (count($children)) {
                    $tmp['children'] = $children;
                    $tmp['isFolder'] = TRUE;
                }
                $elemento[] = $tmp;
            }
        }
        return $elemento;
    }

    /**
     * Creating a multilevel array using parentIds in PHP
     * http://stackoverflow.com/questions/2273449/creating-a-multilevel-array-using-parentids-in-php
     * @param type $ar
     * @param type $pid
     * @return type
     */
    function buildTree($ar, $pid = null) {
        $op = array();
        foreach ($ar as $item) {
            if ($item['parentId'] == $pid) {
                $op[$item['id']] = array(
                    'name' => $item['name'],
                    'parentId' => $item['parentId']
                );
                // using recursion
                $children = buildTree($ar, $item['id']);
                if ($children) {
                    $op[$item['id']]['children'] = $children;
                }
            }
        }
        return $op;
    }

    /**
     * Cómo agregar hojas a un libro de Excel (también puede crear libros)
     * usando la libreria PHPExcel
     */
    function crearHojaXLSXConBasura() {
        $archivo = '../../xxxxxxx.xlsx';
        $objPHPExcel = PHPExcel_IOFactory::load($archivo);

        $objWorksheet = $objPHPExcel->createSheet();
        $objWorksheet->setTitle('H' . rand(0, 9999999));

        $objWorksheet->getColumnDimension('B')->setWidth(10);  // Código
        $objWorksheet->getColumnDimension('C')->setWidth(20);  // Tipo documento
        // ...

        $linea = 3;
        $objWorksheet->setCellValueByColumnAndRow(1, $linea, 'Código');
        $objWorksheet->setCellValueByColumnAndRow(2, $linea, 'T. Doc.');
        // ...

        $linea++;
        foreach ($this->pdo->query("SELECT * FROM ...") as $fila) {
            $objWorksheet->setCellValueByColumnAndRow(1, $linea, $fila['codigo']);
            $objWorksheet->setCellValueByColumnAndRow(2, $linea, $fila['tipo_documento']);
            // ...
            $linea++;
        }

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save($archivo);
    }

}

?>
