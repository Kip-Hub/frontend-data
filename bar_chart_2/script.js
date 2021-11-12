const margin = { top: 40, bottom: 10, left: 160, right: 20 };
let width = 800 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;

const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const url =
    "https://api.tvmaze.com/shows/169/episodes";


d3.json(url, createChart);



function createChart(data) {
    const { x, y } = createAxis(data);
    const Tooltip = createTooltip();
    createBars(data, x, y, Tooltip);
}

function createAxis(data) {

}

function createBars(data, x, y, Tooltip) {

}

function createTooltip() {
    const Tooltip = d3
        .select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    return Tooltip;
}