import * as d3 from "d3";

// Load your JSON
d3.json("chord_data.json").then(data => {
  const nodes = [...new Set(data.flatMap(d => [d.source, d.target]))];

  const matrix = Array.from({ length: nodes.length }, () => Array(nodes.length).fill(0));

  data.forEach(d => {
    const i = nodes.indexOf(d.source);
    const j = nodes.indexOf(d.target);
    matrix[i][j] += d.value;
  });

  const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(matrix);

  const width = 600, height = 600, innerRadius = 250, outerRadius = 260;

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const ribbon = d3.ribbon().radius(innerRadius);

  const svg = d3.select("body").append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Groups (nodes)
  svg.append("g")
    .selectAll("g")
    .data(chord.groups)
    .join("g")
    .append("path")
    .attr("fill", d => color(d.index))
    .attr("d", arc);

  // Ribbons (links)
  svg.append("g")
    .selectAll("path")
    .data(chord)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", d => color(d.source.index))
    .attr("opacity", 0.7);
});
