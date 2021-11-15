const margin = { top: 40, bottom: 10, left: 160, right: 20 };
let width = 800 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;
let data;

const svg = d3
    .select("body")
    .append("svg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")


const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const url =
    "https://api.tvmaze.com/shows/169/episodes";

const color = d3.scaleOrdinal()
    .domain(["a", "b", "c", "d", "e"])
    .range(d3.schemeDark2);


d3.json(url, createChart);

d3.json('https://api.tvmaze.com/shows/169/episodes')
    .then((json) => {
        data = json;
        createChart(data);
    });



function createChart(data) {
    const { xscale, yscale } = createAxis(data);
    // const Tooltip = createTooltip();
    createBars(data, xscale, yscale);
}

function createAxis(data) {
    const xscale = d3.scaleLinear().range([0, width]);
    const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.15);

    const xaxis = d3.axisTop().scale(xscale);
    const g_xaxis = g.append('g').attr('class', 'x axis');
    const yaxis = d3.axisLeft().scale(yscale);
    const g_yaxis = g.append('g').attr('class', 'y axis');

    xscale.domain([0, d3.max(data, (d) => d.rating.average)]);
    yscale.domain(data.map((d) => d.name));

    g_xaxis.transition().call(xaxis);
    g_yaxis.transition().call(yaxis);

    return { g_xaxis, g_yaxis, xscale, yscale };

}

function createBars(data, xscale, yscale) {
    const rect = g.selectAll('rect')
        .data(data, (d) => d.name).join(
            (enter) => {
                const rect_enter = enter
                    .append('rect')
                    .attr('x', 0)
                    .attr('fill', (d) => { return (color(d.name)) });
                rect_enter.append('title');
                return rect_enter;
            },

            (update) => update,

            (exit) => exit.remove()
        );
    rect
        .attr('height', yscale.bandwidth())
        .attr('y', (d) => yscale(d.name))
        .transition()
        .duration(400)
        .ease(d3.easeBackOut.overshoot(1.7))
        .delay((d, i) => {
            return i * 10
        })
        .attr('width', d => xscale(d.rating.average))

    rect.select('title').text((d) => d.rating.average);
}

d3.selectAll('#filter').on('change', (e) => {
    const selectedValue = e.target.value;
    const seasonValue = +selectedValue.split('_')[1];
    console.log(seasonValue);
    const filtered_data = data.filter(d => d.season === seasonValue);
    createChart(filtered_data)
    cleanUpAxis();
})


const cleanUpAxis = () => {
    const oldXAxis = document.getElementsByClassName("x axis")[0];
    const oldYAxis = document.getElementsByClassName("y axis")[0];
    oldXAxis.remove();
    oldYAxis.remove();
}