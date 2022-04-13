/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .75,
  height = window.innerHeight * .75;

// // since we use our scales in multiple functions, they need global scope
let xScale;
let yScale;
let svg;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedActivity: "All"
};

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  xScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.count)])
    .range([0, width])

  yScale = d3.scaleBand()
    .domain(state.data.map(d => d.activity))
    .range([0, height])

  colorscale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.count)])
    .range(["white", "green"])
  
  // Axis, dropdown menu
  const yAxis = d3.axisLeft(yScale)
  const selectElement = d3.select("#dropdown")

  // Dropdown menu
  selectElement.selectAll("option")
    .data([{key: "All", label: "All"},
            {key: "running", label: "Running"},
            {key: "chasing", label: "Chasing"},
            {key: "climbing", label: "Climbing"},
            {key: "eating", label: "Eating"},
            {key: "foraging", label: "Foraging"}])
    .join("option")
    .attr("value", d => d.key)
    .text(d => d.label)

  // Change
  selectElement.on("change", event => 
  {
    state.selectedActivity = event.target.value
    draw()
  })

  // SVG
  svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // Call axes
  svg.append("g")
    .attr("color", "white")
    .call(yAxis)
    .append("text")
    .attr("fill", "white")
    .attr("transform", `translate(-8, ${(height*.5) - 20})rotate(-90)`)
    .text("Activity!")
    .style("font-size", 20)
  
  // Color gradient (instead of colorscale). Define defs, lineargradient, and get counts data to define gradient offset by count
  const counts = state.data.map(d => d.count)
  const defs = svg.append("defs")
  const gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    /*.attr("x1", "0%")
    .attr("x2", "100%")
    .attr("y1", "0%")
    .attr("y2", "0%")*/
  
  gradient.append("stop")
    .attr("class", "start")
    .attr("offset", "0%")
    .attr("stop-color", "white")
  
  gradient.append("stop")
    .attr("class", "end")
    .attr("offset", function() {return counts[3]/10 + "%";})
    .attr("stop-color", "green")

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
  const filteredData = state.data
    .filter(d => state.selectedActivity === d.activity || state.selectedActivity === "All")
  
  const bar = svg.selectAll("rect")
    .data(filteredData, d => d.activity)
    .join(enter => enter
      .append("rect")
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth() - 40)
      .attr("x", 10)
      .attr("y", d => yScale(d.activity) + 15)
      .attr("fill", "url(#svgGradient)")
      .call(enter => enter
        .attr("opacity", 0.1)
        .transition()
        .duration(2000)
        .attr("opacity", 1)),

      update => update.call(update => update
        .attr("opacity", 0.1)
        .transition()
        .duration(2000)
        .attr("opacity", 1)),

      exit => exit.call(exit => exit
        .remove()
    ));
    
  const text = svg.selectAll("text.foo")
    .data(filteredData, d => d.activity)
    .join(enter => enter
      .append("text")
      .attr("x", d => xScale(d.count) + 30)
      .attr("y", d => yScale(d.activity) + 80)
      .attr("class", "foo")
      .attr("fill", "white")
      .text(d => d.activity)
      .attr("font-size", "35px")
      ,

      update => update,

      exit => exit.remove()
      );
  
  // Realign the "foraging" text. Get the svg width to test if the text has already been moved in a prior data state, and then move it if not.
  // Do this test by comparing "foraging" text position with width of the total svg
  let getsvg = document.querySelector("svg")
  let svgwidth = getsvg.getAttribute("width")

  if (state.selectedActivity === 'All') {
    let textelements = document.getElementsByClassName("foo");
    let foraging = textelements[4].getAttribute("x")
    if (foraging > svgwidth) {
      let x_proper = foraging - 205;
      textelements[4].setAttribute("x", x_proper)
      textelements[4].setAttribute("fill", "white")
    }
  } else if (state.selectedActivity === 'foraging') {
    let foragetext = document.getElementsByClassName("foo");
    let foraging = foragetext[0].getAttribute("x")
    if (foraging > svgwidth) {
      let x_proper = foraging - 205;
      foragetext[0].setAttribute("x", x_proper)
    }
  }
}