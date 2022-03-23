/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .7;
const height = window.innerHeight * .7;
margin = {top: 10, bottom: 40, left: 80, right: 80};

/* LOAD DATA */
d3.csv("Citywide_Payroll_Data__Fiscal_Year_.csv", d3.autoType).then(data => {

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["OT Hours"])])
      .range([margin.left, width - margin.right])
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Regular Gross Paid"])])
      .range([height - margin.bottom, margin.top])
    
    const colorScale = d3.scaleOrdinal()
      .domain(["BROOKLYN", "MANHATTAN", "BRONX", "QUEENS"])
      .range(["red", "#6565FF", "#00FF00", "#FFFF65"])
   
    const dotsize = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d["Total OT Paid"])])
      .range([1, 5])

    /* HTML ELEMENTS */
    // Main svg
    const svg = d3.select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    
    // Axes and legend variables
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    const legend = ["BROOKLYN", "MANHATTAN", "BRONX", "QUEENS"];
    const legendcolor = ["red", "#6565FF", "#00FF00", "#FFFF65"];

    // Svg for legend
    const svglegend = d3.select("#legendbox")
        .append("svg")
        .attr("width", 200)
        .attr("height", 150)

    // Append axes
    svg.append("g")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(xAxis)
        .append("text")
        .attr("fill", "lightgrey")
        .attr("transform", `translate(${width*.5}, 40)`)
        .text("Overtime hours")
        .style("font-size", 20)

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("fill", "lightgrey")
        .attr("transform", `translate(-60, ${(height*.4)-margin.bottom-margin.top})rotate(-90)`)
        .text("Regular gross paid")
        .style("font-size", 20)

    // Append legend svg text to window
    legend.forEach((element, index) => 
      svglegend.append("text")
          .attr("x", 50)
          .attr("y", 10 + index*30)
          .style("text-anchor", "start")
          .style("alignment-baseline", "middle")
          .style("font-size", 20)
          .style("fill", "white")
          .text(element)
    )
    
    // Append legend color to window
    legendcolor.forEach((element, index) => 
      svglegend.append("circle")
          .attr("cx", 39)
          .attr("cy", 10 + index*30)
          .attr("alignment-baseline", "middle")
          .style("fill", element)
          .attr("r", 6)
    )

    /* create circles for main svg via Select-data-join */
    svg.selectAll("circle")
        .data(data)
        .join(enter => enter
            .append("circle")
            .attr("cx", d => xScale(d["OT Hours"]))
            .attr("cy", d => yScale(d["Regular Gross Paid"]))
            .attr("fill", "white")
              .transition()
              .duration(4000)
              .delay(200)
                .attr("r", 1.5)
                .attr("fill", d => colorScale(d["Work Location Borough"]))
                .attr("r", d => dotsize(d["Total OT Paid"]))
              )
});