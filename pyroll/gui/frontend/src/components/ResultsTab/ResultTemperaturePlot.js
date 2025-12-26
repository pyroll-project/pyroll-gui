import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ResultTemperaturePlot({ results }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!results || !results.passes || results.passes.length === 0) return;

    // Daten extrahieren - ähnlich wie die Python-Funktion gen_seq()
    const data = [];

    // Erster Punkt: in_temperature vom ersten Pass
    if (results.passes[0].in_temperature !== undefined) {
      data.push({
        x: -0.5,
        temperature: results.passes[0].in_temperature,
        label: 'Input'
      });
    }

    // Alle out_temperatures
    results.passes.forEach((pass, i) => {
      if (pass.out_temperature !== undefined) {
        data.push({
          x: i + 0.5,
          temperature: pass.out_temperature,
          label: pass.label || `Pass ${pass.pass}`
        });
      }
    });

    if (data.length === 0) return;

    // SVG Setup
    const margin = { top: 20, right: 30, bottom: 70, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.temperature) * 0.95,
        d3.max(data, d => d.temperature) * 1.05
      ])
      .range([height, 0]);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.2)
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
      );

    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .attr('opacity', 0.2)
      .call(d3.axisBottom(xScale)
        .tickSize(-height)
        .tickFormat('')
      );

    // Add X axis
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(results.passes.length + 1));

    // Custom X-axis labels
    xAxis.selectAll('text').remove();

    data.forEach(d => {
      svg.append('text')
        .attr('x', xScale(d.x))
        .attr('y', height + 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#555')
        .attr('font-size', '11px')
        .attr('transform', `rotate(-45, ${xScale(d.x)}, ${height + 15})`)
        .text(d.label);
    });

    // X axis title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('fill', '#555')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('Pass');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('fill', '#555')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('Temperature T');

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.temperature));

    // Add line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#FFDD00')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Add data points (marker="x" im Original)
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.label))
      .attr('cy', d => yScale(d.temperature))
      .attr('r', 5)
      .attr('fill', '#FFDD00')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 7);

        // Tooltip
        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', xScale(d.x))
          .attr('y', yScale(d.temperature) - 20)
          .attr('text-anchor', 'middle')
          .attr('fill', '#333')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(`${d.temperature.toFixed(4)}`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('font-size', '16px');
        svg.selectAll('.tooltip').remove();
      });

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#555')
      .text('Mean Profile Temperatures');

  }, [results]);

  return (
    <div style={{
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}