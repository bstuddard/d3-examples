# RHCP D3

### Overview
This repository is a demonstration of visualizing song data using d3. 

### Data Pull
**Initial Code**: Python and Beautiful Soup were used to pull popular song keys [here](https://www.songkeyfinder.com/). 

**Manual Cleanup**: Some manual cleanup was performed to remove songs without sufficient data as well as add album and year metadata.

### D3 Visualization
[D3](https://d3js.org/) was used as the tool/framework for building the visualization. The goal was to build a simple visual (bar chart), yet add time and animation components.

### Project Structure
<pre>
-Root <br />
    --README.md         This file. <br />
    --index.html        Final structure of viz/web page. <br />
    --chart.js          High level data loading and orchestration of the viz. <br />
    --customstyles.css  All static css styles, referenced in both html and d3 js code. <br />
    --helpers <br />
        --structure_builders.js     The primary methods for placing any objects onto the canvas. <br />
        --dimension.js              Helper class for building dimensions and calcs for view less margins. <br />
        --data_binding.js           Helper class for reading in json data. <br />
        --theme.js                  Static color strings. <br />
    --data <br />
        --data_pull.py              Python program that pulls and writes json data containing song and keys. <br />
        --selected_song_data.json   Result of program above, after manual cleanup and additions. <br />
    --lib <br />
        --d3.v5.js                  Copy of the d3 lib. <br />
    --gif <br />
        --rhcp-d3.gif               Final video result/visualization. <br />
</pre>