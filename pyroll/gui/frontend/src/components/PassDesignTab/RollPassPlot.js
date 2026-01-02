import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import {getRollPassContour} from '../../utils/GrooveApi';

export default function RollPassPlot({row, inProfile, outProfile}) {
    const svgRef = useRef();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!row || !row.groove || !svgRef.current) return;

        const fetchAndPlot = async () => {
            setLoading(true);
            setError(null);

            d3.select(svgRef.current).selectAll('*').remove();

            const width = 500;
            const height = 500;
            const margin = {top: 40, right: 40, bottom: 50, left: 60};

            const svg = d3.select(svgRef.current)
                .attr('width', width)
                .attr('height', height);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const plotWidth = width - margin.left - margin.right;
            const plotHeight = height - margin.top - margin.bottom;
            const plotSize = Math.min(plotWidth, plotHeight);

            const contourData = await getRollPassContour({
                grooveType: row.grooveType,
                groove: row.groove,
                gap: row.gap || 0,
                inscribed_circle_diameter: row.inscribed_circle_diameter,
                orientation: row.orientation,
                type: row.type,
                label: row.label,
            });

            console.log('Contour data received:', contourData);

            if (!contourData.success) {
                setError(contourData.error || 'Failed to load RollPass contour');
                g.append('text')
                    .attr('x', plotSize / 2)
                    .attr('y', plotSize / 2)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#f44336')
                    .style('font-size', '14px')
                    .text(`Error: ${contourData.error}`);
                setLoading(false);
                return;
            }

            let allPoints = [];

            if (contourData.pass_type === 'ThreeRollPass' && contourData.contours) {
                console.log('Processing ThreeRollPass with', contourData.contours.length, 'contours');
                contourData.contours.forEach(contour => {
                    contour.x.forEach((x, i) => {
                        allPoints.push({x: x, y: contour.y[i]});
                    });
                });
            } else if (contourData.upper && contourData.lower) {
                console.log('Processing TwoRollPass');
                contourData.upper.x.forEach((x, i) => {
                    allPoints.push({x: x, y: contourData.upper.y[i]});
                });
                contourData.lower.x.forEach((x, i) => {
                    allPoints.push({x: x, y: contourData.lower.y[i]});
                });
            } else {
                console.log('No valid contour data found');
                g.append('text')
                    .attr('x', plotSize / 2)
                    .attr('y', plotSize / 2)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text('Enter groove parameters to see roll pass');
                setLoading(false);
                return;
            }

            if (allPoints.length === 0) {
                g.append('text')
                    .attr('x', plotSize / 2)
                    .attr('y', plotSize / 2)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text('Enter groove parameters to see roll pass');
                setLoading(false);
                return;
            }

            if (inProfile && inProfile.x && inProfile.y) {
                inProfile.x.forEach((x, i) => {
                    allPoints.push({x: x, y: inProfile.y[i]});
                });
            }
            if (outProfile && outProfile.x && outProfile.y) {
                outProfile.x.forEach((x, i) => {
                    allPoints.push({x: x, y: outProfile.y[i]});
                });
            }

            const xCenter = d3.mean(allPoints.map(p => p.x));
            const yCenter = d3.mean(allPoints.map(p => p.y));

            allPoints = allPoints.map(p => ({
                x: p.x - xCenter,
                y: p.y - yCenter
            }));

            const centeredX = allPoints.map(p => p.x);
            const centeredY = allPoints.map(p => p.y);

            const xExtent = d3.extent(centeredX);
            const yExtent = d3.extent(centeredY);

            const dataWidth = xExtent[1] - xExtent[0];
            const dataHeight = yExtent[1] - yExtent[0];

            const xPadding = dataWidth * 0.1 || 0.01;
            const yPadding = dataHeight * 0.1 || 0.01;

            const maxDataRange = Math.max(dataWidth + 2 * xPadding, dataHeight + 2 * yPadding);

            const xScale = d3.scaleLinear()
                .domain([-maxDataRange / 2, maxDataRange / 2])
                .range([0, plotSize]);

            const yScale = d3.scaleLinear()
                .domain([-maxDataRange / 2, maxDataRange / 2])
                .range([plotSize, 0]);

            g.append('g')
                .attr('class', 'grid')
                .attr('opacity', 0.1)
                .call(d3.axisLeft(yScale).tickSize(-plotSize).tickFormat(''));

            g.append('g')
                .attr('class', 'grid')
                .attr('opacity', 0.1)
                .attr('transform', `translate(0,${plotSize})`)
                .call(d3.axisBottom(xScale).tickSize(-plotSize).tickFormat(''));

            g.append('g')
                .attr('transform', `translate(0,${plotSize})`)
                .call(d3.axisBottom(xScale).ticks(8))
                .style('font-size', '12px')
                .selectAll('line, path')
                .style('stroke-width', '2px');

            g.append('g')
                .call(d3.axisLeft(yScale).ticks(8))
                .style('font-size', '12px')
                .selectAll('line, path')
                .style('stroke-width', '2px');

            g.append('text')
                .attr('x', plotSize / 2)
                .attr('y', plotSize + 40)
                .attr('text-anchor', 'middle')
                .style('font-size', '13px')
                .style('font-weight', 'bold')
                .text('Width');

            g.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -plotSize / 2)
                .attr('y', -45)
                .attr('text-anchor', 'middle')
                .style('font-size', '13px')
                .style('font-weight', 'bold')
                .text('Height');

            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            if (inProfile && inProfile.x && inProfile.y) {
                const inletPoints = inProfile.x.map((x, i) => ({
                    x: x - xCenter,
                    y: inProfile.y[i] - yCenter
                }));

                g.append('path')
                    .datum(inletPoints)
                    .attr('fill', 'none')
                    .attr('stroke', '#ff0000')  // Red
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }

            if (outProfile && outProfile.x && outProfile.y) {
                const outletPoints = outProfile.x.map((x, i) => ({
                    x: x - xCenter,
                    y: outProfile.y[i] - yCenter
                }));

                g.append('path')
                    .datum(outletPoints)
                    .attr('fill', 'none')
                    .attr('stroke', '#1f77b4')
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }

            if (contourData.pass_type === 'ThreeRollPass' && contourData.contours) {
                contourData.contours.forEach((contour) => {
                    const shiftedPoints = contour.x.map((x, i) => ({
                        x: x - xCenter,
                        y: contour.y[i] - yCenter
                    }));

                    g.append('path')
                        .datum(shiftedPoints)
                        .attr('fill', 'none')
                        .attr('stroke', '#000000')
                        .attr('stroke-width', 2.5)
                        .attr('d', line);
                });
            } else {
                const upperPoints = contourData.upper.x.map((x, i) => ({
                    x: x - xCenter,
                    y: contourData.upper.y[i] - yCenter
                }));

                const lowerPoints = contourData.lower.x.map((x, i) => ({
                    x: x - xCenter,
                    y: contourData.lower.y[i] - yCenter
                }));

                g.append('path')
                    .datum(upperPoints)
                    .attr('fill', 'none')
                    .attr('stroke', '#000000')
                    .attr('stroke-width', 2.5)
                    .attr('d', line);

                g.append('path')
                    .datum(lowerPoints)
                    .attr('fill', 'none')
                    .attr('stroke', '#000000')
                    .attr('stroke-width', 2.5)
                    .attr('d', line);

                const gapY = yScale(0);
                g.append('line')
                    .attr('x1', 0)
                    .attr('x2', plotSize)
                    .attr('y1', gapY)
                    .attr('y2', gapY)
                    .attr('stroke', '#f44336')
                    .attr('stroke-width', 1)
                    .attr('stroke-dasharray', '5,5');
            }

            const infoX = plotSize - 5;
            const infoY = 15;

            if (contourData.pass_type === 'ThreeRollPass') {
                g.append('text')
                    .attr('x', infoX)
                    .attr('y', infoY)
                    .attr('text-anchor', 'end')
                    .style('font-size', '12px')
                    .style('fill', '#333')
                    .style('font-weight', 'bold')
                    .text(`ICD: ${contourData.inscribed_circle_diameter?.toFixed(4)}`);
            } else {
                g.append('text')
                    .attr('x', infoX)
                    .attr('y', infoY)
                    .attr('text-anchor', 'end')
                    .style('font-size', '12px')
                    .style('fill', '#333')
                    .style('font-weight', 'bold')
                    .text(`Gap: ${contourData.gap?.toFixed(4)}`);
            }

            if (contourData.usable_width) {
                g.append('text')
                    .attr('x', infoX)
                    .attr('y', infoY + 20)
                    .attr('text-anchor', 'end')
                    .style('font-size', '11px')
                    .style('fill', '#666')
                    .text(`Usable Width: ${contourData.usable_width.toFixed(4)}`);
            }

            if (contourData.depth) {
                g.append('text')
                    .attr('x', infoX)
                    .attr('y', infoY + 35)
                    .attr('text-anchor', 'end')
                    .style('font-size', '11px')
                    .style('fill', '#666')
                    .text(`Depth: ${contourData.depth.toFixed(4)}`);
            }

            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .style('font-size', '15px')
                .style('font-weight', 'bold')
                .style('fill', '#333')
                .text(`Roll Pass: ${contourData.label || row.label || ''}`);

            setLoading(false);
        };

        fetchAndPlot();
    }, [row, inProfile, outProfile]);

    return (
        <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f9f9f9',
            borderRadius: '8px',
            border: '2px solid #FFDD00'
        }}>
            <div style={{fontWeight: 'bold', marginBottom: '15px', fontSize: '14px', color: '#333'}}>
                Roll Pass Visualization:
            </div>
            {loading && (
                <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                    Loading roll pass visualization...
                </div>
            )}
            {error && (
                <div style={{textAlign: 'center', padding: '40px', color: '#f44336'}}>
                    Error: {error}
                </div>
            )}
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
}