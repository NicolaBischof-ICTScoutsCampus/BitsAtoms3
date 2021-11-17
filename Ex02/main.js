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

  const chartWidth = 7000;
  const chartHeight = 3500;

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

  // ------------------------------
  // DIFFERENCE BETWEEN DATA POINTS
  // ------------------------------
  selection
    .append("line")
    .style("stroke",  (value) => {
      if(higherLower(value.latitude, value.future_latitude) == 0){
        return "crimson";
      }
      else{
        return "DodgerBlue"
      }
    })
    .style("stroke-width", 3)
    .attr("x1", (value) => {
      return scale(value.longitude, -180, 180, 0, chartWidth) + 8;
    })
    .attr("y1", (value) => {
      return scale(value.latitude, -90, 90, chartHeight, 0);
    })
    .attr("x2", (value) => {
      return scale(value.longitude, -180, 180, 0, chartWidth) + 8;
    })
    .attr("y2", (value) => {
      return scale(value.future_latitude, -90, 90, chartHeight, 0);
    })
    .attr("data-city", (value) => {
      return `${value.currentCity} difference: ${Math.round(
        diff(value.latitude, value.future_latitude)
      )} `;
    });

  // ----------------
  // CURRENT LATITUDE
  // ----------------
  selection
    .append("rect")
    .attr("fill", (value) => {
      if(higherLower(value.latitude, value.future_latitude) == 0){
        return "crimson";
      }
      else{
        return "DodgerBlue"
      }
    })
    .attr("x", (value) => {
      return scale(value.longitude, -180, 180, 0, chartWidth);
    })
    .attr("y", (value) => {
      return scale(value.latitude, -90, 90, chartHeight, 0);
    })
    .attr("width", 16)
    .attr("height", 16)
    .attr("data-city", (value) => {
      return `${value.currentCity} now`;
    });

  // ---------------
  // FUTURE LATITUDE
  // ---------------
  selection
    .append("circle")
    .attr("stroke",  (value) => {
      if(higherLower(value.latitude, value.future_latitude) == 0){
        return "crimson";
      }
      else{
        return "DodgerBlue"
      }
    })
    .attr("cx", (value) => {
      return scale(value.longitude, -180, 180, 0, chartWidth) + 8;
    })
    .attr("cy", (value) => {
      return scale(value.future_latitude, -90, 90, chartHeight, 0);
    })
    .attr("r", 8)
    .attr("data-city", (value) => {
      return `${value.currentCity} in the future`;
    });

  // ------------
  // EQUATOR LINE
  // ------------
  svg
    .append("line")
    .style("stroke", "crimson")
    .style("stroke-width", 1)
    .attr("x1", 0)
    .attr("y1", chartHeight * 0.5)
    .attr("x2", chartWidth)
    .attr("y2", chartHeight * 0.5);

  // ------------
  // TOOLTIPS
  // ------------
  svg
    .selectAll("rect")
    .on("mouseover", function () {
      const city = this.dataset.city;
      local.set(this, d3.select(this).attr("fill"));
      d3.select(this).attr("fill", "white");
      // show tooltip
      d3.select("#tooltip").text(city).style("visibility", "visible");
    })
    .on("mousemove", function (event) {
      const coords = d3.pointer(event);

      d3.select("#tooltip")
        .style("left", coords[0] + 10 + "px")
        .style("top", coords[1] - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", local.get(this));
      d3.select("#tooltip").style("visibility", "hidden");
    });

  svg
    .selectAll("circle")
    .on("mouseover", function () {
      const city = this.dataset.city;
      local.set(this, d3.select(this).attr("fill"));
      d3.select(this).attr("fill", "white");
      // show tooltip
      d3.select("#tooltip").text(city).style("visibility", "visible");
    })
    .on("mousemove", function (event) {
      const coords = d3.pointer(event);

      d3.select("#tooltip")
        .style("left", coords[0] + 10 + "px")
        .style("top", coords[1] - 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", local.get(this));
      d3.select("#tooltip").style("visibility", "hidden");
    });

  svg
    .selectAll("line")
    .on("mouseover", function () {
      const city = this.dataset.city;
      local.set(this, d3.select(this).attr("stroke"));
      d3.select(this).attr("stroke", "black");
      // show tooltip
      d3.select("#tooltip").text(city).style("visibility", "visible");
    })
    .on("mousemove", function (event) {
      const coords = d3.pointer(event);

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

// ------------
// MAP FUNCTION
// ------------
function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// -------------
// DIFF FUNCTION
// -------------
function diff(num1, num2) {
  if (num1 > num2) {
    return num1 - num2;
  } else {
    return num2 - num1;
  }
}
function higherLower(num1, num2) {
  if (num1 > num2) {
    return 0;
  } else {
    return 1;
  }
}
