/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .8;
const height = window.innerHeight * .8;

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType).then(data => {
    console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, width])

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.activity))
      .range([0, height])
    
    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    const svg = d3.select("#barchart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const yAxis = d3.axisLeft(yScale)
    
    /* Select - join - draw */
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth() - 30)
      .attr("x", 0)
      .attr("y", d => yScale(d.activity))

    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.count) + 30)
      .attr("y", d => yScale(d.activity) + 75)
      .text(d => d.activity)
      .attr("font-size", "35px")
    
    let textelements = document.getElementsByTagName("text");
    let foraging = textelements[4].getAttribute("x")
    let x_proper = foraging - 205;
    textelements[4].setAttribute("x", x_proper)
    textelements[4].setAttribute("fill", "white")

    svg.append("g").call(yAxis)
  });