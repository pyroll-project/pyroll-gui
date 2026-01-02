import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const PassSequenceVisualizer = ({pass, results}) => {
    const svgRef = useRef();
    const textBoxRef = useRef();

    useEffect(() => {
        if (!pass || !results) return;

        d3.select(svgRef.current).selectAll('*').remove();

        const width = 1200;
        const height = 800;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        let allPoints = [];

        if (results.roll_contour) {
            // ThreeRollPass
            if (results.roll_contour.contours) {
                results.roll_contour.contours.forEach(contour => {
                    if (contour.x && contour.y) {
                        contour.x.forEach((x, i) => {
                            allPoints.push({x: x, y: contour.y[i]});
                        });
                    }
                });
            }
            // TwoRollPass
            else {
                if (results.roll_contour.upper && results.roll_contour.upper.x) {
                    results.roll_contour.upper.x.forEach((x, i) => {
                        allPoints.push({x: x, y: results.roll_contour.upper.y[i]});
                    });
                }
                if (results.roll_contour.lower && results.roll_contour.lower.x) {
                    results.roll_contour.lower.x.forEach((x, i) => {
                        allPoints.push({x: x, y: results.roll_contour.lower.y[i]});
                    });
                }
            }
        }

        if (results.in_profile_contour && results.in_profile_contour.x) {
            results.in_profile_contour.x.forEach((x, i) => {
                allPoints.push({x: x, y: results.in_profile_contour.y[i]});
            });
        }
        if (results.out_profile_contour && results.out_profile_contour.x) {
            results.out_profile_contour.x.forEach((x, i) => {
                allPoints.push({x: x, y: results.out_profile_contour.y[i]});
            });
        }

        if (allPoints.length === 0) {
            g.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .style('fill', '#999')
                .text('No profile data available');
            return;
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

        const xPadding = dataWidth * 0.15 || 0.01;
        const yPadding = dataHeight * 0.15 || 0.01;

        const maxDataRange = Math.max(dataWidth + 2 * xPadding, dataHeight + 2 * yPadding);

        const plotSize = Math.min(width, height) - 100;

        const xScale = d3.scaleLinear()
            .domain([-maxDataRange / 2, maxDataRange / 2])
            .range([0, plotSize]);

        const yScale = d3.scaleLinear()
            .domain([-maxDataRange / 2, maxDataRange / 2])
            .range([plotSize, 0]);

        g.attr('transform', `translate(${(width - plotSize) / 2}, ${(height - plotSize) / 2})`);

        const centerY = yScale(0);
        const centerX = xScale(0);

        g.append('line')
            .attr('x1', 0)
            .attr('x2', plotSize)
            .attr('y1', centerY)
            .attr('y2', centerY)
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '8,4');

        g.append('line')
            .attr('x1', centerX)
            .attr('x2', centerX)
            .attr('y1', 0)
            .attr('y2', plotSize)
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '8,4');

        g.append('g')
            .attr('transform', `translate(0,${plotSize})`)
            .call(d3.axisBottom(xScale).ticks(8))
            .style('font-size', '16px')

        g.append('g')
            .call(d3.axisLeft(yScale).ticks(8))
            .style('font-size', '16px')

        g.append('text')
            .attr('x', plotSize / 2)
            .attr('y', plotSize + 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('z')

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -plotSize / 2)
            .attr('y', -55)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('y')

        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));


        if (results.roll_contour) {
            // ThreeRollPass
            if (results.roll_contour.contours) {
                results.roll_contour.contours.forEach((contour) => {
                    if (contour.x && contour.y) {
                        const contourPoints = contour.x.map((x, i) => ({
                            x: x - xCenter,
                            y: contour.y[i] - yCenter
                        }));

                        g.append('path')
                            .datum(contourPoints)
                            .attr('fill', 'none')
                            .attr('stroke', '#000000')
                            .attr('stroke-width', 2.5)
                            .attr('d', line);
                    }
                });
            }
            // TwoRollPass
            else {
                if (results.roll_contour.upper && results.roll_contour.upper.x) {
                    const upperPoints = results.roll_contour.upper.x.map((x, i) => ({
                        x: x - xCenter,
                        y: results.roll_contour.upper.y[i] - yCenter
                    }));

                    g.append('path')
                        .datum(upperPoints)
                        .attr('fill', 'none')
                        .attr('stroke', '#000000')
                        .attr('stroke-width', 2.5)
                        .attr('d', line);
                }

                if (results.roll_contour.lower && results.roll_contour.lower.x) {
                    const lowerPoints = results.roll_contour.lower.x.map((x, i) => ({
                        x: x - xCenter,
                        y: results.roll_contour.lower.y[i] - yCenter
                    }));

                    g.append('path')
                        .datum(lowerPoints)
                        .attr('fill', 'none')
                        .attr('stroke', '#000000')
                        .attr('stroke-width', 2.5)
                        .attr('d', line);
                }
            }
        }

        if (results.in_profile_contour && results.in_profile_contour.x) {
            const inletPoints = results.in_profile_contour.x.map((x, i) => ({
                x: x - xCenter,
                y: results.in_profile_contour.y[i] - yCenter
            }));

            g.append('path')
                .datum(inletPoints)
                .attr('fill', 'none')
                .attr('stroke', '#1f77b4')
                .attr('stroke-width', 2.5)
                .attr('d', line);
        }

        if (results.out_profile_contour && results.out_profile_contour.x) {
            const outletPoints = results.out_profile_contour.x.map((x, i) => ({
                x: x - xCenter,
                y: results.out_profile_contour.y[i] - yCenter
            }));

            g.append('path')
                .datum(outletPoints)
                .attr('fill', 'none')
                .attr('stroke', '#ff0000')
                .attr('stroke-width', 2.5)
                .attr('d', line);
        }

    }, [pass, results]);

    useEffect(() => {
        if (textBoxRef.current && results) {
            const katexElements = textBoxRef.current.querySelectorAll('.katex-formula');
            katexElements.forEach(element => {
                const formula = element.getAttribute('data-formula');
                try {
                    katex.render(formula, element, {
                        throwOnError: false,
                        displayMode: false
                    });
                } catch (e) {
                    console.error('KaTeX rendering error:', e);
                }
            });
        }
    }, [results]);

    const formatNumber = (value, decimals = 2) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'number') {
            return value.toFixed(decimals);
        }
        return value.toString();
    };

    const generateTextBox = () => {
        if (!results) return <div>No simulation results available</div>;

        const data = [
            {latex: 'Bite Angle \\alpha_0', value: results.bite_angle * 100, decimals: 4},
            {latex: 'In Profile Height', value: results.in_profile_height, decimals: 4},
            {latex: 'In Profile Width', value: results.in_profile_width, decimals: 4},
            {latex: 'Out Profile Height', value: results.out_profile_height, decimals: 4},
            {latex: 'Out Profile Width', value: results.out_profile_width, decimals: 4},
            {latex: 'In Profile Area', value: results.in_profile_cross_section_area, decimals: 4},
            {latex: 'Out Profile Area', value: results.out_profile_cross_section_area, decimals: 4},
            {latex: 'Reduction \\varepsilon_{A}', value: results.reduction * 100, decimals: 4},
            {latex: 'Gap', value: results.gap, decimals: 4},
            {latex: 'In Profile Velocity', value: results.in_profile_velocity, decimals: 4},
            {latex: 'Out Profile Velocity', value: results.out_profile_velocity, decimals: 4},
            {latex: 'Roll Force', value: results.roll_force, decimals: 4},
            {latex: 'Roll Torque', value: results.roll_torque, decimals: 4},
        ];

        return (
            <div style={{fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8'}}>
                {data.map((item, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
            <span
                className="katex-formula"
                data-formula={item.latex}
                style={{minWidth: '60px', display: 'inline-block'}}
            />
                        <span style={{marginLeft: '8px'}}>
              = {formatNumber(item.value, item.decimals)}
            </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="pass-sequence-visualizer">
            <div className="visualization-container">
                <svg ref={svgRef}></svg>
            </div>
            <div className="results-text-box" ref={textBoxRef}>
                {generateTextBox()}
            </div>
        </div>
    );
};

export default PassSequenceVisualizer;