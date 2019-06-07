//set up SVG
const SVGWIDTH = 960;
const SVGHEIGHT = 500;

let svg=d3.select('.scatter')
.append('svg')
.attr('with', SVGWIDTH)
.attr('height', SVGHEIGHT);

//set up margins
const MARGIN = {
    top: 10,
    right: 10, 
    bottom: 50,
    left: 40
};

const SCATTERWIDTH = SVGWIDTH - MARGIN.left - MARGIN.right;
const SCATTERHEIGHT = SVGHEIGHT - MARGIN.top - MARGIN.bottom;

//set up chartgroup as new group inside SVG
const CHARTGROUP = svg.append('g')
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

const CHOSENX = 'poverty';

//create scalar functions
function xScale(censusData,CHOSENX) {
    var xLinearScale = d3.scaleLinear().domain([d3.min(censusData, d=>d[CHOSENX]) * 0.8,
        d3.max(censusData, d=>d[CHOSENX]) * 2.1
        ]).range([0, SCATTERWIDTH]);
    return xLinearScale;
}
function yScale(censusData) {
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d=>d.smokes)])
    .range([SCATTERHEIGHT, 0]);
    return yLinearScale;
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition().duration(1000).call(bottomAxis);

    return xAxis;
}

function renderCircles(circlesGroup, newXScale, CHOSENX) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[CHOSENX]));
    return circlesGroup;
}
function updateToolTip(CHOSENX, circlesGroup) {
    if (CHOSENX === 'poverty') {
        var label = 'Poverty:';
    }
    else {
        var label = 'Smokers:'
    }
    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80,-60])
        .html(function(x) {
            return (`${x.state}<br>${label} ${x[CHOSENX]}`);
        });
    circlesGroup.call(toolTip);
    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data);
    });

    return circlesGroup;
}   

// READ IN DATA //

d3.csv("../assets/data/data.csv", function (censusData) {
   // console.log(parseFloat(censusData.smokes));
   
    //smokers vs. poverty
    //parse data
        Object.entries(censusData).forEach(function(d) {
       d.poverty = parseFloat(censusData.poverty);
       d.smokes = parseFloat(censusData.smokes);
       d.income = parseFloat(censusData.income);
       });

//x and y scale
    let xLinearScale = xScale(censusData, CHOSENX);
    let yLinearScale = yScale(censusData);
//builds bottom and left axis
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
//adds axes to chartgroup
    let xAxis = CHARTGROUP.append('g')
        .classed('x-axis', true)
        .attr('tranform', `translate(0, ${SCATTERHEIGHT})`)
        .call(bottomAxis);
    
    CHARTGROUP.append('g').call(leftAxis);
//adds circles
    var circlesGroup = CHARTGROUP.selectAll('circle')
        .data(censusData)
        .enter()
        .append('circle')
        .attr('cx', d=> xLinearScale(d[CHOSENX]))
        .attr('cy', d=> yLinearScale(d.smokes))
        .attr('r', 20)
        .attr('fill', 'blue')
        .attr('opacity', '.8');    
//create 2 x axis labels
    var labelsGroup = CHARTGROUP.append('g')
        .attr('transform', `translate(${SCATTERWIDTH/2}, ${SCATTERHEIGHT+20})`);
      
    let povertyLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('Poverty (%)');
    

    //y label
    var smokingLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'smokes')
        .classed('inactive', true)
        .text('Smokers (%)');
 
    //append y 

    CHARTGROUP.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - MARGIN.left)
        .attr('x', 0 - (SCATTERHEIGHT/2))
        .attr('dy', '1em')
        .classed('axis-text', true)
        .text('Average Household Income');
    
    var circlesGroup = updateToolTip(CHOSENX, circlesGroup);

    labelsGroup.selectAll('text')
        .on('click', function() {
        var value = d3.select(this).att('value');
        if (value !== CHOSENX) {
            CHOSENX = value;
            xLinearScale = xScale(censusData, CHOSENX);
            xAxis = renderAxes(xLinearScape, xAxis);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, CHOSENX);
            circlesGroup = updateToolTip(CHOSENX, circlesGroup);
        
        if (CHOSENX === 'smokes') {
            smokingLabel
                .classed('active', true)
                .classed('inactive', false);
            povertyLabel   
                .classed('active', false)
                .classed('inactive', true);
        }
        else {
            smokingLabel
                .classed('active', false)
                .classed('inactive', true);
            povertyLabel
                .classed('active', true)
                .classed('inactive', false);
        }
        }
    });          
    });
