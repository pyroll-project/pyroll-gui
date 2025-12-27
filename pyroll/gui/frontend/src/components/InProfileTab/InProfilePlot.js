import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { getInProfileContour } from "../../utils/ProfileAPI";

export default function ProfilePlot({ inProfile }) {
  const plotRef = useRef(null);

  const renderProfilePlot = useCallback(async () => {
    const result = await getInProfileContour(inProfile);

    if (!result.success) {
      console.error("Error fetching profile contour:", result.error);
      return;
    }

    const contour = result.contour;
    if (!contour || !contour.x || !contour.y) {
      console.error("Invalid contour data");
      return;
    }

    d3.select(plotRef.current).selectAll("*").remove();

    const width = 600;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 50, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const svg = d3.select(plotRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(contour.x);
    const yExtent = d3.extent(contour.y);

    const xRange = xExtent[1] - xExtent[0] || 1;
    const yRange = yExtent[1] - yExtent[0] || 1;
    const maxRange = Math.max(xRange, yRange);
    const padding = maxRange * 0.1;

    const xCenter = (xExtent[0] + xExtent[1]) / 2;
    const yCenter = (yExtent[0] + yExtent[1]) / 2;

    const xScale = d3.scaleLinear()
      .domain([xCenter - maxRange / 2 - padding, xCenter + maxRange / 2 + padding])
      .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
      .domain([yCenter - maxRange / 2 - padding, yCenter + maxRange / 2 + padding])
      .range([plotHeight, 0]);

    const xGrid = d3.axisBottom(xScale)
      .tickSize(-plotHeight)
      .tickFormat("");

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-plotWidth)
      .tickFormat("");

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(xGrid)
      .selectAll("line")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-dasharray", "2,2");

    g.append("g")
      .attr("class", "grid")
      .call(yGrid)
      .selectAll("line")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-dasharray", "2,2");

    const line = d3.line()
      .x((d, i) => xScale(contour.x[i]))
      .y((d, i) => yScale(contour.y[i]));

    const indices = d3.range(contour.x.length);

    g.append("path")
      .datum(indices)
      .attr("d", line)
      .attr("fill", "#1f77b4")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 2.5);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(xAxis)
      .attr("stroke", "#333");

    g.append("g")
      .call(yAxis)
      .attr("stroke", "#333");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("z");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#666")
      .text("y");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Input Profile");
  }, [inProfile]); // ← NUR inProfile als Dependency

  useEffect(() => {
    renderProfilePlot();
  }, [renderProfilePlot]);

  return (
    <div style={{
      marginTop: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div ref={plotRef}></div>
    </div>
  );
}