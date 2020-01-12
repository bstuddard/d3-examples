class Structure {
  /**
   * Builds a structure object given required paramaters or defaults.
   * @param  {String} divName   String that matches the div name in the index html file.
   * @param  {Object} dimensions (Optional) Dimension object that has been initialized.
   */
  constructor(divName, dimensions){
    this.divName = divName;
    this.dimensions;
    if(dimensions === undefined){
        this.dimensions = new Dimension();
    } else {
        this.dimensions = dimensions;
    }
    this.svg;
    this.add_svg_structure();
  }

  /**
   * Adds the svg structure to the main div.
   */
  add_svg_structure (){
    const wrapper = d3.select(this.divName);
    const svg = wrapper
        .append('svg')
          .attr('width', this.dimensions.width)
          .attr('height', this.dimensions.height)
        .append('g')
          .style('transform', `translate(${this.dimensions.margin.left}px, ${this.dimensions.margin.top}px)`);

    this.svg = svg;
  }

  /**
   * Adds x axis to a chart
   * @param {String}   xText            X axis text to add.
   */
  add_axis(xText='Keys'){

    // Setup Scale
    const domain = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const range = [0, this.dimensions.boundedWidth];
    const xScale = d3.scaleBand()
      .domain(domain)
      .range(range)
      .paddingInner(0)
      .paddingOuter(0)
      .align(0.5);
    

    // Add x axis
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    this.svg
        .append('g')
        .call(xAxisGenerator)
            .style('transform', `translateY(${this.dimensions.boundedHeight}px)`)
            .attr('class', 'axis_ticks')
            .style('font-size', '1.0em')
        .append('text')
            .attr('x', this.dimensions.boundedWidth / 2)
            .attr('y', this.dimensions.margin.bottom - 5)
            .style('font-size', '1.5em')
            .attr('class', 'axis_text')
            .html(xText);

    // Use d3 scale function to give scale info
    let vals = []
    for (var key in domain){
      vals.push(xScale(domain[key]));
    }
    vals.push(this.dimensions.boundedWidth);

    // Calculate centroids via start and end of scale
    let centroids = {}
    for (var bound in vals){
      if (parseInt(bound) === (parseInt(vals.length) - 1.0)){
        continue;
      } else {
        const next_bound = parseInt(bound) + 1.0;
        const start_bound_value = vals[bound];
        const end_bound_value = vals[next_bound];
        const centroid_value = (start_bound_value + end_bound_value) / 2.0;
        const key = domain[bound];
        const initial_height = 0.0;
        const struct = {
          'start_bound': start_bound_value,
          'end_bound': end_bound_value,
          'centroid': centroid_value,
          'height': initial_height
        };
        centroids[key] = struct;
      }
    }

    // Save to class
    this.centroids = centroids;
    
  }

  /**
   * Adds and animates a circle, updates bar value.
   * @param  {String}   song_name   Name of the song to change title.
   * @param  {String}   key         Key string to move dot towards.
   * @param  {String}   album_name  Name of the album.
   * @param  {String}   year        Year of the song/album.
   * @param  {number}   delay_time  Additional delay for this particular animation.
   */
  add_circle(song_name, album_name, year, key, delay_time){

    // Transition setup
    const transition_duration_one = 600;
    const transition_duration_two = 900;
    const bar_transition_length = 100 + transition_duration_two / 10.0;
    const displayTransition = d3.transition().delay(delay_time).duration(0);
    const initTransition = d3.transition().delay(delay_time).duration(transition_duration_one);
    const finalTransition = initTransition.transition().duration(transition_duration_two);
    const barTransition = initTransition.transition().delay(transition_duration_two - bar_transition_length).duration(bar_transition_length);

    // Calc final desired x and y coords
    const finalX = this.centroids[key]['centroid'];
    const finalY = this.dimensions.boundedHeight - this.centroids[key]['height'];

    // Create circle
    const current_x_value = this.dimensions.boundedWidth / 2.0;
    const circle = this.svg
      .append('circle')
          .attr('cx', current_x_value)
          .attr('cy', this.dimensions.boundedHeight / 6.0)
          .attr('r', 0)
          .attr('fill', Theme.color_circle)
          .attr('stroke', Theme.color_circle);

    // Update song, album name, and year
    d3.select('#song_name')
      .transition(displayTransition)
        .style('opacity', '1.0')
        .text(song_name);
    d3.select('#album_name')
      .transition(displayTransition)
        .style('opacity', '1.0')
        .text(album_name);
    d3.select('#year_number')
      .transition(displayTransition)
        .style('opacity', '1.0')
        .text(year);

    // Place
    circle.transition(displayTransition)
      .attr('r', 8);

    // Move 1
    circle.transition(initTransition)
      .attr('cy', this.dimensions.boundedHeight / 2.75);

    
    // Setup custom x tween function
    const tween_x = function(start_x, end_x){
     return function(){
        return function(t) {
          const x_dif = end_x - start_x;
          const numerator = Math.pow(Math.E, t * 6.0)
          const denominator = numerator + 1.0;
          const value = numerator / denominator * 2.0 - 1.0;
          return (x_dif * value) + start_x;
        };
      };
    }

   // Move 2
   circle.transition(finalTransition)
      .attrTween('cx', tween_x(current_x_value, finalX))
      .attr('cy', finalY);

    // Remove circle
    circle.transition(finalTransition).remove();

    // Increase bar height
    this.update_bar_height(key, barTransition);
    
  }

  /**
   * Initializes bars on page and binds to class for later manipulation.
   * @param  {number}   padding_ratio     Padding of the bar to be initialized.
   */
  initialize_bars(padding_ratio=0.4){
    // Calculate bar width
    const bounds_dif = this.centroids['A']['end_bound'] - this.centroids['A']['start_bound'];
    const padding = bounds_dif * padding_ratio;
    const bar_width = bounds_dif - padding;

    // Create a bar for each key
    let bars = {}
    let bars_text = {}
    for (var key in this.centroids){

      // Bar
      const bar = this.svg
        .append('rect')
        .attr('height', 0.0)
        .attr('x', this.centroids[key]['centroid'] - (bar_width / 2.0))
        .attr('y', this.dimensions.boundedHeight)
        .attr('width', bar_width)
        .attr('fill', Theme.color_bar);

      // Text (count)
      const bar_text = this.svg
        .append('text')
        .attr('x', this.centroids[key]['centroid'])
        .attr('y', this.dimensions.boundedHeight)
        .attr('fill', Theme.color_bar)
        .text('');
      
      // Bind to local objects
      bars[key] = bar;
      bars_text[key] = bar_text;
    }

    // Save to class
    this.bars = bars;
    this.bars_text = bars_text;
  }

  /**
   * Updates bar height for a particular key.
   * @param  {String}   key               Width of the bar to be initialized.
   * @param  {Object}   update_transition d3 transition.
   * @param  {number}   pixel_increment   Number of pixels to increase height by.
   */
  update_bar_height(key, update_transition, pixel_increment=35.0){
    // Update bar height
    const bar_to_update = this.bars[key];
    const text_to_update = this.bars_text[key];
    const new_height = this.centroids[key]['height'] + pixel_increment;
    const new_y_value = this.dimensions.boundedHeight - new_height;
    const num_songs = new_height / pixel_increment;

    // Update bar object
    bar_to_update
      .transition(update_transition)
      .attr('y', new_y_value)
      .attr('height', new_height);

    // Calculate text location
    const centroid = this.centroids[key]['centroid'];
    const offset = function(num_songs){
      if (parseInt(num_songs) < 10){
        return 5.0;
      } else {
        return 10.0;
      }
    }

    // Update text object
    text_to_update
      .transition(update_transition)
      .attr('y', new_y_value - 10)
      .attr('x', centroid - offset(num_songs))
      .attr('class', 'axis_text')
      .text(num_songs);

    // Bind new value to class (for later reference)
    this.centroids[key]['height'] = new_height;
  }  

}