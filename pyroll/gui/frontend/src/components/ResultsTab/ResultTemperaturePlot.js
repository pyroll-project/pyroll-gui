import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

export default function ResultTemperaturePlot({results}) {
    const svgRef = useRef();

    useEffect(() => {
        if (!results || !results.passes || results.passes.length === 0) return;

        const data = [];

        if (results.passes[0].in_profile_temperature !== undefined) {
            data.push({
                x: -0.5,
                temperature: results.passes[0].in_profile_temperature,
                label: 'Input'
            });
        }

        results.passes.forEach((pass, i) => {
            if (pass.out_profile_temperature !== undefined) {
                data.push({
                    x: i + 0.5,
                    temperature: pass.out_profile_temperature,
                    label: pass.label || `Pass ${pass.pass}`
                });
            }
        });

        if (data.length === 0) return;

        const margin = {top: 20, right: 30, bottom: 90, left: 60};
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([
                d3.min(data, d => d.temperature) * 0.95,
                d3.max(data, d => d.temperature) * 1.05
            ])
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

        const xAxis = svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(results.passes.length + 1));

        xAxis.selectAll('text').remove();

        data.forEach(d => {
            svg.append('text')
                .attr('x', xScale(d.x))
                .attr('y', height + 20)
                .attr('text-anchor', 'end')
                .attr('fill', '#555')
                .attr('font-size', '13px')
                .attr('transform', `rotate(-45, ${xScale(d.x)}, ${height + 20})`)
                .text(d.label);
        });

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 5)
            .attr('fill', '#555')
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .text('Pass');

        svg.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d => d.toString().replace(',', '')))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -45)
            .attr('fill', '#555')
            .attr('font-size', '16px')
            .attr('text-anchor', 'middle')
            .text('Temperature T');

        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.temperature));

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
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.temperature))
            .attr('r', 5)
            .attr('fill', '#FFDD00')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .on('mouseover', function (event, d) {
                d3.select(this).attr('r', 7);

                svg.append('text')
                    .attr('class', 'tooltip')
                    .attr('x', xScale(d.x))
                    .attr('y', yScale(d.temperature) - 20)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#333')
                    .attr('font-size', '14px')
                    .attr('font-weight', 'bold')
                    .text(`${d.temperature.toFixed(4)}`);
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