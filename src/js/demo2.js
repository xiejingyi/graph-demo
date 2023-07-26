
import * as d3 from 'd3'
export function draw () {
  // 示例数据
  const flowData = {
    "nodes": [
        { "id": 1, "name": "Step 1" },
        { "id": 2, "name": "Step 2" },
        { "id": 3, "name": "Step 3" },
        { "id": 4, "name": "Step 4" },
        { "id": 5, "name": "Step 5" },
        { "id": 6, "name": "Step 6" },
        { "id": 7, "name": "Step 7" },
        { "id": 8, "name": "Step 8" }
    ],
    "links": [
        { "source": 1, "target": 2 },
        { "source": 2, "target": 3 },
        { "source": 3, "target": 4 },
        { "source": 5, "target": 6 },
        { "source": 6, "target": 7 },
        { "source": 7, "target": 8 }
    ]
  };

  const width = 800;
  const height = 600;

  const svg = d3.select("svg");

  const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

  let link = svg.selectAll(".link");
  let node = svg.selectAll(".node");

  function angledPath(d) {
      return `M${d.source.x},${d.source.y}L${d.source.x},${d.target.y}L${d.target.x},${d.target.y}`;
  }

  function customYPosition() {
      const nodeByDepth = d3.group(simulation.nodes(), d => d.depth);
      const depthValues = [...nodeByDepth.keys()];
      const maxDepth = d3.max(depthValues);

      const yScale = d3.scaleLinear()
          .domain([0, maxDepth])
          .range([50, height - 50]);

      simulation.nodes().forEach(d => {
          d.y = yScale(d.depth);
      });
  }

  function update(data) {
      const nodes = data.nodes.map(d => Object.assign({}, d));
      const links = data.links.map(d => Object.assign({}, d));

      simulation.nodes(nodes);
      simulation.force("link").links(links);

      link = link.data(links, d => d.target.id);
      link.exit().remove();
      link = link.enter().append("path").attr("class", "link").merge(link)
          .attr("d", angledPath); // Use angledPath function to generate angled links

      node = node.data(nodes, d => d.id);
      node.exit().remove();
      node = node.enter().append("circle").attr("class", "node").attr("r", 25).merge(node);

      simulation.on("tick", () => {
          customYPosition(); // Update Y positions of nodes based on depth

          link.attr("d", angledPath); // Update angled links on tick

          node.attr("cx", d => d.x)
              .attr("cy", d => d.y);
      });

      // 防止动画无限执行，适当的迭代次数后停止
      for (let i = 0; i < 150; ++i) {
          simulation.tick();
      }
  }

  update(flowData);
}