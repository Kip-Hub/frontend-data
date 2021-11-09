const margin = { top: 40, bottom: 10, left: 120, right: 20 };
const width = 800 - margin.left - margin.right;
const height = 1200 - margin.top - margin.bottom;
const seasons = 5;

// Creates sources <svg> element
const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

let data;

const xscale = d3.scaleLinear().range([0, width]);
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.4);

const xaxis = d3.axisTop().scale(xscale);
const g_xaxis = g.append('g').attr('class', 'x axis');
const yaxis = d3.axisLeft().scale(yscale);
const g_yaxis = g.append('g').attr('class', 'y axis');

d3.json('https://api.tvmaze.com/shows/169/episodes')
    .then((json) => {
        data = json;
        update(data);
    });

function update(new_data) {
    //update the scales
    xscale.domain([0, d3.max(new_data, (d) => d.rating.average)]);
    yscale.domain(new_data.map((d) => d.name));
    //render the axis
    g_xaxis.transition().call(xaxis);
    g_yaxis.transition().call(yaxis);


    // Render the chart with new data

    // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
    const rect = g.selectAll('rect').data(new_data, (d) => d.name).join(
        // ENTER 
        // new elements
        (enter) => {
            const rect_enter = enter.append('rect').attr('x', 0);
            rect_enter.append('title');
            return rect_enter;
        },
        // UPDATE
        // update existing elements
        (update) => update,
        // EXIT
        // elements that aren't associated with data
        (exit) => exit.remove()
    );

    // ENTER + UPDATE
    // both old and new elements
    rect.transition()
        .attr('height', yscale.bandwidth())
        .attr('width', (d) => xscale(d.rating.average))
        .attr('y', (d) => yscale(d.name));

    rect.select('title').text((d) => "season " + d.season + " episode " + d.number);
}



d3.select('#season_1').on('change', function() {
    // This will be triggered when the user selects or unselects the checkbox
    const checked = d3.select(this).property('checked');
    if (checked === true) {
        // Checkbox was just checked

        // Keep only data element whose country is US
        const filtered_data = data.filter((d) => d.season === 1);

        update(filtered_data); // Update the chart with the filtered data
    } else {
        // Checkbox was just unchecked
        update(data); // Update the chart with all the data we have
    }
});

d3.select('#season_2').on('change', function() {
    // This will be triggered when the user selects or unselects the checkbox
    const checked = d3.select(this).property('checked');
    if (checked === true) {
        // Checkbox was just checked

        // Keep only data element whose country is US
        const filtered_data = data.filter((d) => d.season === 2);

        update(filtered_data); // Update the chart with the filtered data
    } else {
        // Checkbox was just unchecked
        update(data); // Update the chart with all the data we have
    }
});

d3.select('#season_3').on('change', function() {
    // This will be triggered when the user selects or unselects the checkbox
    const checked = d3.select(this).property('checked');
    if (checked === true) {
        // Checkbox was just checked

        // Keep only data element whose country is US
        const filtered_data = data.filter((d) => d.season === 3);

        update(filtered_data); // Update the chart with the filtered data
    } else {
        // Checkbox was just unchecked
        update(data); // Update the chart with all the data we have
    }
});

d3.select('#season_4').on('change', function() {
    // This will be triggered when the user selects or unselects the checkbox
    const checked = d3.select(this).property('checked');
    if (checked === true) {
        // Checkbox was just checked

        // Keep only data element whose country is US
        const filtered_data = data.filter((d) => d.season === 4);

        update(filtered_data); // Update the chart with the filtered data
    } else {
        // Checkbox was just unchecked
        update(data); // Update the chart with all the data we have
    }
});

d3.select('#season_5').on('change', function() {
    // This will be triggered when the user selects or unselects the checkbox
    const checked = d3.select(this).property('checked');
    if (checked === true) {
        // Checkbox was just checked

        // Keep only data element whose country is US
        const filtered_data = data.filter((d) => d.season === 5);

        update(filtered_data);
        // Update the chart with the filtered data
    } else {
        // Checkbox was just unchecked
        update(data); // Update the chart with all the data we have
    }
});