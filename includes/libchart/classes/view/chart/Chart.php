<?php

/* Libchart - PHP chart library
 * Copyright (C) 2005-2010 Jean-Marc Trémeaux (jm.tremeaux at gmail.com)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

/* ! \mainpage Libchart
 *
 * This is the reference API, automatically compiled by <a href="http://www.stack.nl/~dimitri/doxygen/">Doxygen</a>.
 * You can find here information that is not covered by the <a href="../samplecode/">tutorial</a>.
 *
 */

/**
 * Base chart class.
 *
 * @author Jean-Marc Trémeaux (jm.tremeaux at gmail.com)
 */
abstract class Chart {

    /**
     * The chart configuration.
     */
    protected $config;
    /**
     * The data set.
     */
    protected $dataSet;
    /**
     * Plot (holds graphical attributes).
     */
    protected $plot;
    protected $highlightedValues;
    protected $labelBar;
    protected $drawBorders;

    /**
     * Abstract constructor of Chart.
     *
     * @param integer width of the image
     * @param integer height of the image
     */
    protected function Chart($width, $height, $logo) {
        // Initialize the configuration
        $this->config = new ChartConfig();

        // Creates the plot
        $this->plot = new Plot($width, $height);
        $this->plot->setTitle("Untitled chart");
        $this->plot->setLogoFileName($logo);
    }

    /**
     * Checks the data model before rendering the graph.
     */
    protected function checkDataModel() {
        // Check if a dataset was defined
        if (!$this->dataSet) {
            die("Error: No dataset defined.");
        }

        // Maybe no points are defined, but that's ok. This will yield and empty graph with default boundaries.
    }

    /**
     * Create the image.
     */
    protected function createImage() {
        $this->plot->createImage();
    }

    /**
     * Sets the data set.
     *
     * @param dataSet The data set
     */
    public function setDataSet($dataSet) {
        $this->dataSet = $dataSet;
    }

    /**
     * Return the chart configuration.
     *
     * @return configuration : ChartConfig
     */
    public function getConfig() {
        return $this->config;
    }

    /**
     * Return the plot.
     *
     * @return plot
     */
    public function getPlot() {
        return $this->plot;
    }

    /**
     * Sets the title.
     *
     * @param string New title
     */
    public function setTitle($title) {
        $this->plot->setTitle($title);
    }

    /**
     * Valores de la escala que deben aparecer resaltados
     * @param <type> $highlightedValues
     */
    public function setHighlightedValues($highlightedValues = array()) {
        $this->highlightedValues = $highlightedValues;
    }

    /**
     * Permite agregar una etiqueta a los elementos estadísticos (ej. barras)
     * Si es un valor, se usará dicho valor para construir un porcentaje. Ejemplo:
     * Si son barras con valores entre [0..X] el valor será 20 por aquello de X * 100 / 5
     * @param <type> $labelBar
     */
    public function setLabelBar($labelBar = NULL) {
        $this->labelBar = $labelBar;
    }

    public function setBorders() {
        $this->drawBorders = TRUE;
    }

}

?>