import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

export default function ResultCrossSectionPlot({results}) {
    const svgRef = useRef();

    useEffect(() => {
        if (!results || !results.passes || results.passes.length === 0) return;

        const data = results.passes
            .filter(pass => pass.filling_ratio !== undefined)
            .map(pass => ({
                label: pass.label || `Pass ${pass.pass}`,
                filling_ratio: Array.isArray(pass.filling_ratio) ? pass.filling_ratio[0] : pass.filling_ratio
            }));

        if (data.length === 0) return;

        const margin = {top: 20, right: 30, bottom: 70, left: 60};
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scalePoint()
            .domain(data.map(d => d.label))
            .range([0, width])
            .padding(0.5);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.filling_ratio) * 1.1])
            .range([height, 0]);

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
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '0.15em');

        svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -45)
            .attr('fill', '#555')
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .text('Filling Ratio i');

        const line = d3.line()
            .x(d => xScale(d.label))
            .y(d => yScale(d.filling_ratio))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#FFDD00')
            .attr('stroke-width', 2.5)
            .attr('d', line);

        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.label))
            .attr('cy', d => yScale(d.filling_ratio))
            .attr('r', 5)
            .attr('fill', '#FFDD00')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('r', 7);

                svg.append('text')
                    .attr('class', 'tooltip')
                    .attr('x', xScale(d.label))
                    .attr('y', yScale(d.filling_ratio) - 15)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#333')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .text(`${d.filling_ratio.toFixed(4)}`);
            })
            .on('mouseout', function () {
                d3.select(this).attr('r', 5);
                svg.selectAll('.tooltip').remove();
            });

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('fill', '#555')
            .text('Roll Pass Filling Ratios');

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