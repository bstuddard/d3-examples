async function renderMyChart() {
	// Add an svg to our html document (under the wrapper element)
	const wrapper = d3.select('#wrapper')
		.append('svg')
			.attr('width', 200)
			.attr('height', 200);

	// Place a blue circle in the middle of that svg
	wrapper
		.append('circle')
			.attr('cx', 100)
			.attr('cy', 100)
			.attr('r', 10)
			.attr('fill', 'blue');
}

renderMyChart();