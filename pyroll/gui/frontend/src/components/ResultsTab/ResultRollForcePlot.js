import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ResultRollForcePlot({ results }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!results || !results.passes || results.passes.length === 0) return;

    // Daten extrahieren - nur Passes mit roll_force
    const data = results.passes
      .filter(pass => pass.roll_force !== undefined)
      .map(pass => ({
        label: pass.label || `Pass ${pass.pass}`,
        force: Array.isArray(pass.roll_force) ? pass.roll_force[0] : pass.roll_force
      }));

    if (data.length === 0) return;

    // SVG Setup
    const margin = { top: 40, right: 30, bottom: 70, left: 80 };
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
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.force) * 1.1])
      .range([height, 0]);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.2)
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
      );

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => (d / 1e6).toFixed(1)))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -60)
      .attr('fill', '#555')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('Roll Force');

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label))
      .attr('y', d => yScale(d.force))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.force))
      .attr('fill', '#FFDD00')
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('fill', '#FFDD00');

        // Tooltip
        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', xScale(d.label) + xScale.bandwidth() / 2)
          .attr('y', yScale(d.force) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', '#333')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text(`${(d.force / 1e6).toFixed(2)}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.8)
          .attr('fill', '#FFDD00');
        svg.selectAll('.tooltip').remove();
      });

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#555')
      .text('Roll Force');

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