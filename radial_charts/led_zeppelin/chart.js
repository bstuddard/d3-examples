async function renderMyChart() {
	// Load dataset
	const databinder_months = await DataBinder.build('./data/led_zep_months.json');
	const databinder_years = await DataBinder.build('./data/led_zep_years.json');
	const dataset = databinder_months.dataset;
	const dataset2 = databinder_years.dataset;

	// Accessor (convert datapoint to value)
	const monthAccessor = (d) => d.month;
	const heightAccessor = (d) => d.count;
	const yearAccessor = (d) => d.year;
	const radAccessor = (d) => d.count;

	// Build structure object given html selector and dimensions (Optional parameter)
	const custom_dimension = new Dimension(1000, 1000);
	const structure = new Structure('#wrapper', custom_dimension);

	// Radial specific parms
	const innerRadius = Math.min(custom_dimension.boundedWidth, custom_dimension.boundedHeight) / 7.0;
	const outerRadius = innerRadius * 2.0;

	// Build out scales and bind to class
	structure.scale_band(dataset.map(monthAccessor));	
	structure.scale_band2(dataset2.map(yearAccessor));	
	structure.scale_radial(dataset, heightAccessor, innerRadius, outerRadius);

	// Bar Color scale
	const color_max_padding_factor = 1.1;
	const color_scale = d3.scaleLinear().domain([0, d3.max(dataset, (d) => heightAccessor(d) * color_max_padding_factor)]).range(['beige', '#AB281E']);

	// Add bars
	structure.svg
		.append('g')
		.selectAll('path')
		.data(dataset)
		.enter()
		.append('path')
			.attr('fill', (d) => color_scale(heightAccessor(d)))
			.attr('d', 
				d3.arc()
					.innerRadius(innerRadius)
					.outerRadius(d => structure.y_scaler(heightAccessor(d)))
					.startAngle(d => structure.x_scaler(monthAccessor(d)))
					.endAngle(d => structure.x_scaler(monthAccessor(d)) + structure.bandwidth)
					.padAngle(0.15)
					.padRadius(innerRadius)
			);

	
	// Add Month text
	structure.svg
		.append('g')
		.selectAll('g')
		.data(dataset)
		.enter()
		.append('g')
		.attr('text-anchor', 'middle')
		.attr('transform', (d) => `
			rotate(${((structure.x_scaler(monthAccessor(d)) + structure.bandwidth / 2) * 180 / Math.PI - 90)})
			translate(${innerRadius}, 0)
		`)
		.call(g =>
			g.append('line')
			.attr('stroke', (d) => color_scale(heightAccessor(d)))
			.attr('x2', -5)
		)
		.call(g =>
			g.append('text')
			.attr("transform", d => (structure.x_scaler(monthAccessor(d)) + structure.bandwidth / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
				? "rotate(90)translate(0,30)"
				: "rotate(-90)translate(0,-15)")
				.attr('fill',  (d) => color_scale(heightAccessor(d)))
				.attr('class', 'simple_text')
				.text((d) => monthAccessor(d).substring(0,3))
		);

	// Header text
	structure.svg
		.append('g')
			.attr('text-anchor', 'middle')
			.call(g => g.append('text')
				.attr('y', -450)
				.attr('class', 'header_text')
				.text('Led Zeppelin')
			)
			.call(g => g.append('text')
				.attr('y', -420)
				.attr('class', 'header_text')
				.text('When did they play?')
			)
			.call(g => g.append('text')
				.attr('y', -outerRadius - 80)
				.attr('class', 'base_text')
				.text('Concerts')
			)
			.call(g => g.append('text')
				.attr('y', -outerRadius - 60)
				.attr('class', 'base_text')
				.text('by Year')
			);
	
	// Inner Legend Text
	structure.svg
		.append('g')
			.attr('text-anchor', 'middle')
			.call(g => g.append('text')
				.attr('class', 'base_text')
				.attr('y', -10)
				.text('All Time')
			)
	structure.svg
		.append('g')
			.attr('text-anchor', 'middle')
			.call(g => g.append('text')
				.attr('class', 'base_text')
				.attr('y', 10)
				.text('Concerts by Month')
			)
	
	// Individual Bar Heights
	structure.svg
		.append('g')
		.selectAll('g')
		.data(dataset)
		.enter()
		.append('g')
		.attr('text-anchor', 'middle')
		.attr('transform', (d) => `
			rotate(${((structure.x_scaler(monthAccessor(d)) + structure.bandwidth / 2) * 180 / Math.PI - 90)})
			translate(${innerRadius + 40}, 0)
		`)
		.call(g =>
			g.append('text')
			.attr("transform", d => (structure.x_scaler(monthAccessor(d)) + structure.bandwidth / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
				? "rotate(90)translate(0,20)"
				: "rotate(-90)translate(0,-10)")
				.attr('class', 'base_text')
				.text((d) => heightAccessor(d))
		);

	// Add circles
	structure.svg
		.append('g')
		.selectAll('g')
		.data(dataset2)
		.enter()
		.append('g')
		.attr('text-anchor', 'middle')
		.attr('transform', (d) => `
			rotate(${((structure.x_scaler2(yearAccessor(d)) + structure.bandwidth2 / 2) * 180 / Math.PI - 90)})
			translate(${outerRadius + 50}, 0)
		`)
		.call(g =>
			g.append('circle')
			.attr('fill', 'white')
			.attr('r', (d) => {return radAccessor(d) * 0.2})
		)
		.call(g =>
			g.append('text')
			.attr("transform", d => (structure.x_scaler2(yearAccessor(d)) + structure.bandwidth2 / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
				? `rotate(90)translate(0,-${15 + radAccessor(d) * 0.3 + 20})`
				: `rotate(-90)translate(0,${20 + radAccessor(d) * 0.3})`)
				.attr('class',  'base_text')
				.text((d) => yearAccessor(d))
		)
		.call(g =>
			g.append('text')
			.attr("transform", d => (structure.x_scaler2(yearAccessor(d)) + structure.bandwidth2 / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
				? `rotate(90)translate(0,-${15 + radAccessor(d) * 0.3})`
				: `rotate(-90)translate(0,${20 + radAccessor(d) * 0.3 + 20})`)
				.attr('class',  'base_text')
				.text((d) => radAccessor(d))
		);
	
}

renderMyChart();