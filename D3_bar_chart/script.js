const margin = { top: 40, bottom: 10, left: 160, right: 160 };
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

var colors = ['#69c242', '#64bbe3', '#ffcc00', '#ff7300', '#cf2030', '#ce23a9', '#8522cc', '#2522cc', '#2288cc', '#22c6cc'];

const url =
    "https://api.tvmaze.com/shows/169/episodes";

d3.json(url)
    .then((json) => {
        data = json;
        createChart(data);
    });



function createChart(data) {
    const { xscale, yscale } = createAxis(data);
    createTooltip();
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
    const color = d3.scaleOrdinal()
        .domain(data.length.toString())
        .range(["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]);
    const rect = g.selectAll('rect')
        .data(data).join(
            (enter) => {
                const rect_enter = enter
                    .append('rect')
                    .attr('x', 0)
                    .attr('fill', (d) => { return (color(d)) });
                return rect_enter;
            },

            (update) => update,

            (exit) => exit.remove()
        );
    rect
        .attr('height', yscale.bandwidth())
        .attr('y', (d) => yscale(d.name))
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove)
        .on("mouseleave", mouseOut)
        .transition()
        .duration(400)
        .ease(d3.easeBackOut.overshoot(1.7))
        .delay((d, i) => {
            return i * 10
        })
        .attr('width', d => xscale(d.rating.average))
}

function createTooltip() {
    d3
        .select("body")
        .append("p")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "rgb(231, 231, 231)")
        .style("padding", "0.2em")
        .style("position", "absolute");
}

function mouseOver() {
    d3.select(".tooltip")
        .style("opacity", 1)
};

function mouseOut() {
    d3.select(".tooltip")
        .style("opacity", 0)
}

function mouseMove(d, data) {
    let x = d.clientX;
    let y = d.clientY;
    d3.select(".tooltip")
        .text(data.rating.average)
        .style("left", x + "px")
        .style("top", y + "px")
};

d3.selectAll('#filter').on('change', (e) => {
    height = 400 - margin.top - margin.bottom;
    const selectedValue = e.target.value;
    const seasonValue = +selectedValue.split('_')[1];
    const filtered_data = data.filter(d => d.season === seasonValue);
    createChart(filtered_data);
    cleanUpAxis();
})


const cleanUpAxis = () => {
    const oldXAxis = document.getElementsByClassName("x axis")[0];
    const oldYAxis = document.getElementsByClassName("y axis")[0];
    oldYAxis.remove();
    oldXAxis.remove();
}