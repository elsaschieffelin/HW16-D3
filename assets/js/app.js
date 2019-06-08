//set up SVG
const SVGWIDTH = 900;
const SVGHEIGHT = 600;

let svg=d3.select('.scatter')
.append('svg')
.attr('width', SVGWIDTH)
.attr('height', SVGHEIGHT);

//set up margins
const MARGIN = {
    top: 100,
    right: 50, 
    bottom: 100,
    left: 100
};

const SCATTERWIDTH = SVGWIDTH - MARGIN.left - MARGIN.right;
const SCATTERHEIGHT = SVGHEIGHT - MARGIN.top - MARGIN.bottom;

//set up chartgroup as new group inside SVG
const CHARTGROUP = svg.append('g')
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

let chosenX = 'poverty';
let chosenY = 'smokes';

//create scalar functions

function xScale(censusData,chosenX) {
    let xLinearScale = d3.scaleLinear()
       .domain([d3.min(censusData, function(d) {return parseFloat(d[chosenX]) * 0.90}), d3.max(censusData, function(d) {return parseFloat(d[chosenX]) * 1.2})])
       .range([0, SCATTERWIDTH]);
    return xLinearScale;
}
function yScale(censusData) {
    let yLinearScale =d3.scaleLinear()
    .domain([d3.min(censusData, function(d) {return parseFloat(d[chosenY]) *0.75}), d3.max(censusData, function(d) {return parseFloat(d[chosenY]) * 1.2})])
    .range([SCATTERHEIGHT, 0]);
    return yLinearScale;
}

// READ IN DATA //

d3.csv("../assets/data/data.csv").then(function (censusData) {
    console.log(d3.max(censusData, d => d.poverty));
    //smokers vs. poverty
    //parse data
       censusData.forEach(function(d) {
       d.poverty = parseFloat(d.poverty);
       d.smokes = parseFloat(d.smokes);
        });
    

//x and y scale
    let xLinearScale = xScale(censusData, chosenX);
    let yLinearScale = yScale(censusData);

//builds bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
//adds axes to chartgroup
    CHARTGROUP.append('g')
        .attr('transform', `translate(0, ${SCATTERHEIGHT})`)
        .call(bottomAxis);
    
    CHARTGROUP.append('g').call(leftAxis);


    //adds circles
    var circlesGroup = CHARTGROUP.selectAll('circle')
        .data(censusData)
        .enter()
        .append('circle')
        .attr('cx', d=> xLinearScale(d[chosenX]))
        .attr('cy', d=> yLinearScale(d[chosenY]))
        .attr('r', '15')
        .attr('fill', 'lightblue')
        .attr('opacity', '1')
        .attr('class', 'stateCircle')
     
    CHARTGROUP.selectAll('stateCircle')
        .data(censusData)
        .enter()
        .append('text')
        .attr('stateText', 'text')
        .attr('x', d=>xLinearScale(d[chosenX]))
        .attr('y', d=>yLinearScale(d[chosenY]))
        .attr('dy', '0.3em')
        .attr('dx', '-0.6em')
        .text(d=>d.abbr);

   
        //.attr('text', `${censusData, d=> d.abbr}`);


    
    
//labels

    CHARTGROUP.append("text")
    .attr("transform", `translate(${SCATTERWIDTH / 2}, ${SCATTERHEIGHT + MARGIN.top-50})`)
    .attr("class", "x-axisText")
    .text("State Population under Poverty Line (%)");

    CHARTGROUP.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - MARGIN.left + 10)
        .attr('x', 0 - (SCATTERHEIGHT/2))
        .attr('dy', '1em')
        .attr('class', 'y-axisText')
        .text('Smokers per State (%)');
    });