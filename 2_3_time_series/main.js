 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .8,
  height = window.innerWidth * .5,
  margin = 70;

/* LOAD DATA */
d3.csv('ERCOT_2019.csv', d => {
  return {
    time: new Date(d.EffectiveDate),
    Demand: +d.System_Demand,
    Generation: +d.Generation_capacity_total,
    WindSolar: +d.Wind_plus_Solar_Output
  }
}).then(data => {
  console.log(data)

  // For parsing EffectiveDate data which is a string --> unnecessary given "new Date(d.EffectiveDate)"
  // which d3 parses the same as the below code.
  // const readthedate = d3.timeParse("%m/%d/%Y %H:%M")
  // newdate = data.map(function(x) {
  //   return readthedate(x.time);
  //   }
  // );
  // console.log(newdate);
  
  // SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.time))
    .range([margin, width-margin])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Demand))
    .range([height-margin, margin])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  
  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  
  svg.append("g")
    .attr("transform", `translate(0, ${height-margin})`)
    .attr("color", "black")
    .call(xAxis)
    .append("text")
    .attr("fill", "black")
    .attr("transform", `translate(${width*.5}, 40)`)
    .text("2019")
    .style("font-size", 20)

  svg.append("g")
    .attr("transform", `translate(${margin - 5}, 0)`)
    .attr("color", "black")
    .call(yAxis)
    .append("text")
    .attr("fill", "black")
    .attr("transform", `translate(-50, ${(height*.5)-margin})rotate(-90)`)
    .text("Megawatts")
    .style("font-size", 20)
  
 
  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.Demand))

  // Area generator
  const areagen = d3.area()
    .x(d => xScale(d.time))
    .y0(height-margin)
    .y1(d => yScale(d.Demand))
  

  // DRAW LINE
  svg.selectAll("path.line")
    .data([data])
    .join("path")
    .attr("class", "line")
    .attr("stroke", "red")
    .attr("fill", "darkblue")
    .attr("d", d => areagen(d))
});