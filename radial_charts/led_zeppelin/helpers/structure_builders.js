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
          .style('transform', `translate(${this.dimensions.width / 2}px, ${this.dimensions.height / 2}px)`);

    this.svg = svg;
  }

  /**
   * Builds x scaler and band width to be used in arc drawing.
   * @param  {Object} domain_array   Array of all the possible dimensional values.
   * @param  {number} range_start    Min of the range (typically 0)
   * @param  {number} range_end      Max of the range, typically 2pi for radial bar.
   */
  scale_band(domain_array, range_start=0, range_end=(2*Math.PI)){
    this.x_scaler = d3
      .scaleBand()
      .domain(domain_array)
      .range([range_start, range_end]);

    this.bandwidth = this.x_scaler.bandwidth();

  }

  /**
   * Builds x scaler and band width to be used in arc drawing.
   * @param  {Object} domain_array   Array of all the possible dimensional values.
   * @param  {number} range_start    Min of the range (typically 0)
   * @param  {number} range_end      Max of the range, typically 2pi for radial bar.
   */
  scale_band2(domain_array, range_start=0, range_end=(2*Math.PI)){
    this.x_scaler2 = d3
      .scaleBand()
      .domain(domain_array)
      .range([range_start, range_end]);

    this.bandwidth2 = this.x_scaler2.bandwidth();

  }

  /**
   * Builds y scaler to be used in arc drawing.
   * @param  {Object}   dataset           Dataset used for the domain
   * @param  {Function} heightAccessor    Function accessor used to grab the height of a bar.
   * @param  {number}   innerRadius       Inner circle radius.
   * @param  {number}   outerRadius       Outer circle radius.
   */
  scale_radial(dataset, heightAccessor, innerRadius, outerRadius){
    const rad = d3.scaleLinear()
      .domain([0, d3.max(dataset, heightAccessor)])
      .range([innerRadius * innerRadius, outerRadius * outerRadius])
    const y_scale = (d) => Math.sqrt(rad(d));
    
    this.y_scaler = y_scale;

  }



}