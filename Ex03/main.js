async function readJson(path) {
  const response = await fetch(path);
  const data = await response.json();
  return data;
}

/**
 *  Gets the maximum value in a collection of numbers.
 */
function getMax(collection) {
  let max = 0;

  collection.forEach((element) => {
    max = element > max ? element : max;
  });

  return max;
}

async function init() {
  const data = await readJson("future_cities_data.json");
  let simplifiedData = data.map((d) => {
    return {
      currentCity: d["current_city"],
      latitude: d["Latitude"],
      longitude: d["Longitude"],
      future_latitude: d["future_lat"],
      future_longitude: d["future_long"],
    };
  });

  const chartWidth = 5500;
  const chartHeight = 1080;

  const local = d3.local();

  const svg = d3
    .select("#d3")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

  const tooltip = d3
    .select("#d3")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip") // for styling in css
    .style("visibility", "hidden")
    .text("a simple tooltip");

  const selection = svg.selectAll("rect").data(simplifiedData).enter();
  selection
    .append("rect")
    .attr("fill", "blue")
    .attr("x", (value) => {
      return scale(value.longitude, -180, 180, chartWidth, 0);
    })
    .attr("y", (value) => {
      return scale(value.latitude, -90, 90, chartHeight, 0);
    })
    .attr("width", 10)
    .attr("height", 10)
    .attr("data-city", (value) => {
      return `${value.currentCity}`;
    });

  selection
    .append("rect")
    .attr("fill", "red")
    .attr("x", (value) => {
      return scale(value.longitude, -180, 180, chartWidth, 0);
    })
    .attr("y", (value) => {
      return scale(value.future_latitude, -90, 90, chartHeight, 0);
    })
    .attr("width", 10)
    .attr("height", 10)
    .attr("data-city", (value) => {
      return `${value.currentCity}`;
    });

    selection
    .append("line")
    .style("stroke", "grey")
    .style("stroke-width", 1)
    .attr("x1", (value) => {
      return scale(value.longitude, -180, 180, chartWidth, 0)+5;
    })
    .attr("y1", (value) => {
      return scale(value.latitude, -90, 90, chartHeight, 0);
    })
    .attr("x2", (value) => {
      return scale(value.longitude, -180, 180, chartWidth, 0)+5;
    })
    .attr("y2", (value) => {
      return scale(value.future_latitude, -90, 90, chartHeight, 0);
    });

  
  //LONGITUTE 0
  svg
    .append("line")
    .style("stroke", "grey")
    .style("stroke-width", 1)
    .attr("x1", 0)
    .attr("y1", chartHeight * 0.5)
    .attr("x2", chartWidth)
    .attr("y2", chartHeight * 0.5);

  svg
    .selectAll("rect")
    .on("mouseover", function () {
      const city = this.dataset.city;
      local.set(this, d3.select(this).attr("fill"));
      d3.select(this).attr("fill", "pink");
      // show tooltip
      d3.select("#tooltip").text(city).style("visibility", "visible");
    })
    .on("mousemove", function (event) {
      const coords = d3.pointer(event);
      // uncomment to see current x and y mouse positions
      console.log("x: ", coords[0], "y: ", coords[1]);

      d3.select("#tooltip")
        .style("left", coords[0] + 10 + "px")
        .style("top", coords[1] - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", local.get(this));
      d3.select("#tooltip").style("visibility", "hidden");
    });
}

init();

//Small Processing Like Map Function
function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
