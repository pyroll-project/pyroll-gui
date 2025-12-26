import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getRollPassContour } from '../../utils/GrooveApi';

export default function RollPassPlot({ row }) {
  const svgRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!row || !row.groove || !svgRef.current) return;

    const fetchAndPlot = async () => {
      setLoading(true);
      setError(null);

      // Clear previous plot
      d3.select(svgRef.current).selectAll('*').remove();

      const width = 500;
      const height = 400;
      const margin = { top: 40, right: 40, bottom: 50, left: 60 };

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const plotWidth = width - margin.left - margin.right;
      const plotHeight = height - margin.top - margin.bottom;

      // Fetch contour from backend
      const contourData = await getRollPassContour({
        grooveType: row.grooveType,
        groove: row.groove,
        gap: row.gap || 0
      });

      if (!contourData.success) {
        setError(contourData.error || 'Failed to load roll pass contour');
        g.append('text')
          .attr('x', plotWidth / 2)
          .attr('y', plotHeight / 2)
          .attr('text-anchor', 'middle')
          .style('fill', '#f44336')
          .style('font-size', '14px')
          .text(`Error: ${contourData.error}`);
        setLoading(false);
        return;
      }

      if (!contourData.upper || !contourData.upper.x || contourData.upper.x.length === 0) {
        g.append('text')
          .attr('x', plotWidth / 2)
          .attr('y', plotHeight / 2)
          .attr('text-anchor', 'middle')
          .style('fill', '#999')
          .text('Enter groove parameters to see roll pass');
        setLoading(false);
        return;
      }

      // Prepare data points
      const upperPoints = contourData.upper.x.map((x, i) => ({
        x: x,
        y: contourData.upper.y[i]
      }));

      const lowerPoints = contourData.lower.x.map((x, i) => ({
        x: x,
        y: contourData.lower.y[i]
      }));

      const allY = [...contourData.upper.y, ...contourData.lower.y];
      const allX = [...contourData.upper.x];

      // Scales
      const xExtent = d3.extent(allX);
      const yExtent = d3.extent(allY);

      const xPadding = (xExtent[1] - xExtent[0]) * 0.1 || 5;
      const yPadding = (yExtent[1] - yExtent[0]) * 0.1 || 5;

      const xScale = d3.scaleLinear()
        .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
        .range([0, plotWidth]);

      const yScale = d3.scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([plotHeight, 0]);

      // Grid
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(yScale).tickSize(-plotWidth).tickFormat(''));

      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .attr('transform', `translate(0,${plotHeight})`)
        .call(d3.axisBottom(xScale).tickSize(-plotHeight).tickFormat(''));

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${plotHeight})`)
        .call(d3.axisBottom(xScale).ticks(8))
        .style('font-size', '12px');

      g.append('g')
        .call(d3.axisLeft(yScale).ticks(8))
        .style('font-size', '12px');

      // Axis labels
      g.append('text')
        .attr('x', plotWidth / 2)
        .attr('y', plotHeight + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .text('Width (mm)');

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -plotHeight / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .text('Height (mm)');

      // Line generator
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      // Draw upper roll (groove)
      g.append('path')
        .datum(upperPoints)
        .attr('fill', '#FFE680')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#FFDD00')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Draw lower roll (groove)
      g.append('path')
        .datum(lowerPoints)
        .attr('fill', '#FFE680')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#FFDD00')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Draw gap line (centerline)
      const gapY = yScale(0);
      g.append('line')
        .attr('x1', 0)
        .attr('x2', plotWidth)
        .attr('y1', gapY)
        .attr('y2', gapY)
        .attr('stroke', '#f44336')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5');

      // Add labels
      const infoX = plotWidth - 5;
      const infoY = 15;

      g.append('text')
        .attr('x', infoX)
        .attr('y', infoY)
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('fill', '#333')
        .style('font-weight', 'bold')
        .text(`Gap: ${contourData.gap?.toFixed(2) || 0} mm`);

      if (contourData.usable_width) {
        g.append('text')
          .attr('x', infoX)
          .attr('y', infoY + 20)
          .attr('text-anchor', 'end')
          .style('font-size', '11px')
          .style('fill', '#666')
          .text(`Usable Width: ${contourData.usable_width.toFixed(2)} mm`);
      }

      if (contourData.depth) {
        g.append('text')
          .attr('x', infoX)
          .attr('y', infoY + 35)
          .attr('text-anchor', 'end')
          .style('font-size', '11px')
          .style('fill', '#666')
          .text(`Depth: ${contourData.depth.toFixed(2)} mm`);
      }

      // Title
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '15px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(`Roll Pass: ${contourData.groove_type}`);

      setLoading(false);
    };

    fetchAndPlot();
  }, [row]);

  return (
    <div style={{
      marginTop: '20px',
      padding: '15px',
      background: '#f9f9f9',
      borderRadius: '8px',
      border: '2px solid #FFDD00'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '14px', color: '#333' }}>
        Roll Pass Visualization (from PyRoll):
      </div>
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Loading roll pass visualization...
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#f44336' }}>
          Error: {error}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}