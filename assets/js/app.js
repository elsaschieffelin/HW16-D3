
const SVGWIDTH = 960;
const SVGHEIGHT = 500;

let svg=d3.select('.scatter').append('svg').attr('with', SVGWIDTH).attr('height', SVGHEIGHT);


const MARGIN = {
    top: 20,
    right: 40, 
    bottom: 60,
    left: 50
};

const SCATTERWIDTH = SVGWIDTH - MARGIN.left - MARGIN.right;
const SCATTERHEIGHT = SVGHEIGHT - MARGIN.top - MARGIN.bottom;


const CHARTGROUP = svg.append('g')
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

const CHOSENX = 'poverty';

function xScale(data,CHOSENX) {
    var xLinearScale = d3.scaleLinear().domain([d3.min(data, d=>d[CHOSENX]) * 0.8,
        d3.max(data, d=>d[CHOSENX]) * 2.1
        ]).range([0, SCATTERWIDTH]);
    return xLinearScale;
}
function yScale(data) {
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d=>d.smokes)])
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

d3.csv("../assets/data/data.csv", function (data) {
    console.log(data);
   /*
    //smokers vs. poverty
   data.forEach(function(data) {
       data.poverty = parseFloat(data.poverty);
       data.smokes = parseFloat(data.smokes);
       data.income = parseFloat(data.income);
   });
   */
    var xLinearScale = xScale(data, CHOSENX);
    var yLinearScale = yScale(data);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = CHARTGROUP.append('g')
        .classed('x-axis', true)
        .attr('tranform', `translate(0, ${SCATTERHEIGHT})`)
        .call(bottomAxis);
    
    CHARTGROUP.append('g').call(leftAxis);

    var circlesGroup = CHARTGROUP.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=> xLinearScale(d[CHOSENX]))
        .attr('cy', d=> yLinearScale(d.smokes))
        .attr('r', 20)
        .attr('fill', 'blue')
        .attr('opacity', '.8');    

    var labelsGroup = CHARTGROUP.append('g')
        .attr('transform', `translate(${SCATTERWIDTH/2}, ${SCATTERHEIGHT+20})`);
    
    /*
        //x label
    var povertyLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classes('active', true)
        .text('Poverty (%)');
    
    
    //y label
    var smokingLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'smokes')
        .classes('inactive', true)
        .text('Smokers (%)');
    */
    //append y axis

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
            xLinearScale = xScale(data, CHOSENX);
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