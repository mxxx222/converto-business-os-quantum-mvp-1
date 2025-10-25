"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'company' | 'department' | 'process' | 'tool';
  value: number;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

interface BusinessGraphProps {
  width?: number;
  height?: number;
}

export default function BusinessGraph({ width = 800, height = 600 }: BusinessGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  // Sample business data
  const businessData = {
    nodes: [
      { id: 'converto', name: 'Converto Business OS', type: 'company', value: 100 },
      { id: 'finance', name: 'Finance', type: 'department', value: 30 },
      { id: 'sales', name: 'Sales', type: 'department', value: 25 },
      { id: 'marketing', name: 'Marketing', type: 'department', value: 20 },
      { id: 'ocr', name: 'OCR Processing', type: 'process', value: 40 },
      { id: 'billing', name: 'Billing', type: 'process', value: 35 },
      { id: 'reports', name: 'Reports', type: 'process', value: 30 },
      { id: 'stripe', name: 'Stripe', type: 'tool', value: 15 },
      { id: 'supabase', name: 'Supabase', type: 'tool', value: 20 },
      { id: 'openai', name: 'OpenAI', type: 'tool', value: 25 },
    ],
    links: [
      { source: 'converto', target: 'finance', strength: 0.8 },
      { source: 'converto', target: 'sales', strength: 0.7 },
      { source: 'converto', target: 'marketing', strength: 0.6 },
      { source: 'finance', target: 'ocr', strength: 0.9 },
      { source: 'finance', target: 'billing', strength: 0.8 },
      { source: 'finance', target: 'reports', strength: 0.7 },
      { source: 'billing', target: 'stripe', strength: 0.9 },
      { source: 'ocr', target: 'openai', strength: 0.8 },
      { source: 'reports', target: 'supabase', strength: 0.7 },
    ]
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(businessData.nodes)
      .force('link', d3.forceLink(businessData.links).id((d: Node) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(businessData.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: Link) => Math.sqrt(d.strength * 5));

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(businessData.nodes)
      .enter().append('g')
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles
    node.append('circle')
      .attr('r', (d: Node) => Math.sqrt(d.value) * 2)
      .attr('fill', (d: Node) => {
        switch (d.type) {
          case 'company': return '#0047FF';
          case 'department': return '#059669';
          case 'process': return '#DC2626';
          case 'tool': return '#7C3AED';
          default: return '#6B7280';
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node.append('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .text((d: Node) => d.name)
      .attr('font-size', '12px')
      .attr('fill', '#374151');

    // Add tooltips
    node.append('title')
      .text((d: Node) => `${d.name}\nType: ${d.type}\nValue: ${d.value}`);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: Link) => d.source.x)
        .attr('y1', (d: Link) => d.source.y)
        .attr('x2', (d: Link) => d.target.x)
        .attr('y2', (d: Link) => d.target.y);

      node
        .attr('transform', (d: Node) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    setNodes(businessData.nodes);
    setLinks(businessData.links);

  }, [width, height]);

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-4">📊 Business Graph</h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Company</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Department</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Process</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Tool</span>
        </div>
      </div>
    </div>
  );
}
