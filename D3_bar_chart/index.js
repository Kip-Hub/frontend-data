const margin = { top: 40, bottom: 10, left: 160, right: 160 }; // default sizing 
let width = 800 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;

let data;

const svg = d3 // creating the svg element to contain the datavis 
    .select("body")
    .append("svg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`); // creating g element

const url =
    "https://api.tvmaze.com/shows/169/episodes";

d3.json(url)
    .then((json) => { // fetching the data 
        data = json;
        createChart(data); // calling the createChart() function with the fetched data
    });

function createChart(data) {
    const { xscale, yscale } = createAxis(data); // assigning values of scales to what createAxis() returns
    createTooltip(); // calls createTooltip() function
    createBars(data, xscale, yscale); // calls createBars() with given data, and scales
};

function createAxis(data) { // creating the axis
    const xscale = d3.scaleLinear().range([0, width]); // setting up the scales
    const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.15);

    const xaxis = d3.axisTop().scale(xscale); // setting up axis
    const g_xaxis = g.append('g').attr('class', 'x axis');
    const yaxis = d3.axisLeft().scale(yscale);
    const g_yaxis = g.append('g').attr('class', 'y axis');

    xscale.domain([0, d3.max(data, (d) => d.rating.average)]); // adjusting the scales to the data
    yscale.domain(data.map((d) => d.name));

    g_xaxis.transition().call(xaxis); // show values on the axis
    g_yaxis.transition().call(yaxis);

    return { g_xaxis, g_yaxis, xscale, yscale }; // return the values needed to create the chart
};

function createBars(data, xscale, yscale) { // creating the rects and assigning the data to them
    const color = d3.scaleOrdinal()
        .domain(data.length.toString()) // domain of given data
        .range(["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]); // range of available colors
    const rect = g.selectAll('rect') // select the rectangles
        .data(data).join( //assign the data to the rectangles and join it
            (enter) => {
                const rect_enter = enter
                    .append('rect')
                    .attr('x', 0) // start at 0 on the x axis
                    .attr('fill', (d) => { return (color(d)) }); // fill the rect
                return rect_enter;
            },

            (update) => update, // updating the data (not used)

            (exit) => exit.remove() // removing the data thats not assigned (not used)
        );

    rect
        .attr('height', yscale.bandwidth())
        .attr('y', (d) => yscale(d.name))
        .on("mouseover", mouseOver)
        .on("mousemove", mouseMove) // mouse events that call functions
        .on("mouseleave", mouseOut)
        .transition() // create transition on the rendering of the width of the bar
        .duration(600)
        .ease(d3.easeBackOut.overshoot(1.7)) // easing with an effect
        .attr('width', d => xscale(d.rating.average))
};

function createTooltip() { // appends tooltip element thats invisible by default
    d3
        .select("body")
        .append("p")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "rgb(231, 231, 231)")
        .style("padding", "0.2em")
        .style("position", "absolute");
};

function mouseOver() { // when mouseOver is called the tooltip element is visible
    d3.select(".tooltip")
        .style("opacity", 1)
};

function mouseOut() { // when mouseOut is called the tooltip element is invisble
    d3.select(".tooltip")
        .style("opacity", 0)
};

function mouseMove(d, data) { // the d argument handles mouse events
    let x = d.clientX; // variables with cursor positions
    let y = d.clientY;
    d3.select(".tooltip") // select tooltip element
        .text(data.rating.average) // show the requested data in the element 
        .style("left", x + "px") // assign the position of the  tooltip element to the cursor
        .style("top", y + "px")
};

d3.selectAll('#filter').on('change', (e) => { // handler for changes on filter radiobuttons
    const selectedValue = e.target.value; // value of the element thats changed
    if (selectedValue == 'alldata') {
        height = 800 - margin.top - margin.bottom; // redefine the height to make the svg taller to fit all data 
        createChart(data); // call createChart to re-render the chart
    } else { // if radio value isnt all data
        height = 400 - margin.top - margin.bottom; // redefine the height to make the svg smaller 
        const seasonValue = +selectedValue.split('_')[1]; // split the value of the selected radio, make it a numeric value and keep the number 
        const filtered_data = data.filter(d => d.season === seasonValue); // create filter and filter fetched data
        createChart(filtered_data); // call createChart() with the filtered data
    }
    cleanUpAxis(); // calls cleanupAxis() 
});

const cleanUpAxis = () => { // removes duplicate axis © Suwi
    const oldXAxis = document.getElementsByClassName("x axis")[0]; // selects first element with the given classname
    const oldYAxis = document.getElementsByClassName("y axis")[0];
    oldYAxis.remove(); // remove the elements
    oldXAxis.remove();
};