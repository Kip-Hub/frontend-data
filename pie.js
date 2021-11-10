const width = 450,
    height = 450,
    margin = 40

const radius = Math.min(width, height) / 2 - margin;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`)

const data = { a: 9.5, b: 20.2, c: 0.9, d: 8.7, e: 12.1 }

const color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

const pie = d3.pie()
    .value((d) => { return d[1] })
const data_ready = pie(Object.entries(data))

svg
    .selectAll('test')
    .data(data_ready)
    .join('path')
    .attr('d', d3.arc()
        .innerRadius(radius / 2)
        .outerRadius(radius)
    )
    .attr('fill', (d) => { return (color(d.data[1])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

// let data;

// d3.json('https://api.tvmaze.com/shows/30202/episodes')
//     .then((json) => {
//         data = json;
//         update(data);
//     });

// function update(new_data) {
//     const color = d3.scaleOrdinal()
//         .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"])

//     const pie = d3.pie()
//         .value(function(d) { return d[1] })
//     const data_ready = pie(Object.entries(new_data, (d) => d.rating.average));


//     svg
//         .selectAll('test')
//         .data(data_ready)
//         .join('path')
//         .attr('d', d3.arc()
//             .innerRadius(radius / 2)
//             .outerRadius(radius)
//         )
//         .attr('fill', (d) => { return (color(d.data[1])) })
//         .attr("stroke", "white")
//         .style("stroke-width", "2px")
//         .style("opacity", 1)

// }