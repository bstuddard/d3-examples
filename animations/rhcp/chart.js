async function drawChart() {

  // Load dataset
  const databinder = await DataBinder.build('./data/selected_song_data.json');
  const dataset = databinder.dataset;

  // Accessor (convert datapoint to value)
  const albumAccessor = (d) => d.album;
  const songNameAccessor = (d) => d.song_name;
  const keyAccessor = (d) => d.key;
  const yearAccessor = (d) => d.year;

  // Build structure object given html selector and dimensions (Optional parameter)
  const custom_dimension = new Dimension(800, 600);
  const structure = new Structure('#wrapper', custom_dimension);

  // Setup axis (keys)  
  structure.add_axis();

  // Draw initial bars  
  structure.initialize_bars();

  // Opacity change
  const opacity_zero = 1500;
  const start_time = 3600;

  // Fade Out
  const zero_transition = d3.transition().duration(opacity_zero).ease(d3.easeCubic);
  d3.select('#album_name')
    .transition(zero_transition)
      .style('opacity', '0.0')


  // Loop through data values, adding circles and updating bars
  for (var datapoint in dataset){
    structure.add_circle(
        songNameAccessor(dataset[datapoint]),
        albumAccessor(dataset[datapoint]),
        yearAccessor(dataset[datapoint]),
        keyAccessor(dataset[datapoint]), 
        datapoint * 1800.0 - 1800.0 + start_time
    );
  }


  
}

drawChart();