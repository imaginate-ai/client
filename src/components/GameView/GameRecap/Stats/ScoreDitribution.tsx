import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface HistogramProps {
  data: number[];
  width?: number;
  height?: number;
}

const ScoreDistribution = ({
  data,
  width = 500,
  height = 300,
}: HistogramProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Adjust margins.
    const margin = { top: 0, right: 0, bottom: 0, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yMin = 0;
    const yMax = 5;
    const domain: [number, number] = [yMin, yMax + 1];

    // Original histogram bins over [0, 5].
    const binGenerator = d3
      .bin()
      .domain(domain)
      .thresholds(d3.range(yMin, yMax + 1, 1));
    const bins = binGenerator(data);

    // New x scale for counts.
    const xMax = d3.max(bins, (d) => d.length) ?? 1;
    const x = d3.scaleLinear().domain([0, xMax]).range([0, innerWidth]);

    // Keep y scale for bin intervals unchanged.
    const y = d3.scaleLinear().domain(domain).range([innerHeight, 0]);

    // Compute tick positions as the bin centers.
    const yTickValues = d3.range(yMin, yMax + 1, 1).map((d) => d + 0.5);

    // Group for chart with proper margin.
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Settings for padding and rounding on all corners.
    const barPadding = 8;
    const cornerRadius = 16;

    const widthForZeroBar = 48;

    // Draw bars as paths; each bar extends horizontally.
    const colorScale = [
      "#ff0000",
      "#648a72",
      "#65aa7f",
      "#6cc58d",
      "#40b46b",
      "#16a34a",
    ];

    g.selectAll("path")
      .data(bins)
      .enter()
      .filter((_d, i) => i <= yMax)
      .append("path")
      .attr("d", (d) => {
        const topY = y(d.x0 ?? 10) - barPadding / 2;
        const bottomY = y(d.x1 ?? 20) + barPadding / 2;
        const barHeight = topY - bottomY;
        const barWidth = d.length ? x(d.length) : widthForZeroBar;
        const r = Math.min(cornerRadius, barWidth / 2, barHeight / 2);
        return `
      M ${r},${bottomY}
      L ${barWidth - r},${bottomY}
      A ${r},${r} 0 0 1 ${barWidth},${bottomY + r}
      L ${barWidth},${topY - r}
      A ${r},${r} 0 0 1 ${barWidth - r},${topY}
      L ${r},${topY}
      A ${r},${r} 0 0 1 0,${topY - r}
      L 0,${bottomY + r}
      A ${r},${r} 0 0 1 ${r},${bottomY}
      Z
      `;
      })
      .attr("fill", (d) => colorScale[d.x0!]);

    // Add text labels inside the bars.
    g.selectAll("text")
      .data(bins)
      .enter()
      .filter((_d, i) => i <= yMax)
      .append("text")
      .attr("x", (d) => (d.length ? x(d.length) - 10 : widthForZeroBar - 10))
      .attr("y", (d) => (y(d.x0 ?? 0) + y(d.x1 ?? 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d) =>
        d.x0 === 0 ? "😵 " + d.length : d.x0 === 5 ? "🥳 " + d.length : d.length
      )
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("font-size", "14px");

    // Draw y axis with ticks displaying 1 to 5.
    g.append("g")
      .attr("transform", "translate(-8,0)") // transform ticks to the left by 8 pixels
      .call(
        d3
          .axisLeft(y)
          .tickValues(yTickValues)
          .tickFormat((d) => String(Math.floor(d as number)))
          .tickSize(0),
      )
      .call((g) => g.select(".domain").remove())
      .selectAll("text")
      .style("font-size", "16px");
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default ScoreDistribution;
