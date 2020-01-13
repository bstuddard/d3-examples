# Visualizing Led Zeppelin Concerts

### Overview
This is an example of visualizing Led Zeppelin concerts by month and year using radial charts in D3. The all time number of concerts in a month was summarized by using bars and number of concerts in a year by sized circles (outer edge). 

### Final Product
![Led Zeppelin Concert Visualization](https://github.com/bstuddard/d3-examples/blob/master/radial_charts/led_zeppelin/img/final_result.PNG)

### Sources and Inspiration
1. Data sourced from [Led Zeppelin shows page](https://www.ledzeppelin.com/shows/all).
1. Inspired by Mike Bostock's example of [Radial Bar Charts in D3](https://observablehq.com/@d3/radial-stacked-bar-chart).

### Project Structure
<pre>
-Root <br />
    --README.md          This file. <br />
    --index.html         Final structure of viz/web page. <br />
    --chart.js           Data loading and orchestration of the viz. <br />
    --custom_styles.css  All static css styles, referenced primarily in the d3 js code. <br />
    --helpers <br />
        --structure_builders.js     Helper methods for initial canvas structuring. <br />
        --dimension.js              Helper class for building dimensions and calcs for view less margins. <br />
        --data_binding.js           Helper class for reading in json data. <br />
    --data <br />
        --data_pull.py              Python program that pulls and writes json data from concert source. <br />
        --*.json                    Various outputs from data pull above. <br />
    --img <br />
        --final_result.png          Final result/visualization. <br />
</pre>