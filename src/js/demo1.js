import * as d3 from 'd3'
export function draw () {
  // 示例数据
  const treeData = {
      "name": "Root",
      "children": [
          {
              "name": "Node 1",
              "children": [
                  { "name": "Leaf 1.1" },
                  { "name": "Leaf 1.2" }
              ]
          },
          {
              "name": "Node 2",
              "children": [
                  { "name": "Leaf 2.1" },
                  { "name": "Leaf 2.2" },
                  { "name": "Leaf 2.3" }
              ]
          }
      ]
  };

  const width = 800;
  const height = 600;

  const svg = d3.select("svg");

  const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.selectAll(".link");
  const node = svg.selectAll(".node");

  update(treeData);

  function update(data) {
      const nodes = d3.hierarchy(data);
      const links = nodes.links();

      simulation.nodes(nodes);
      simulation.force("link").links(links);

      link = link.data(links, d => d.target.id);
      link.exit().remove();
      link = link.enter().append("line").attr("class", "link").merge(link);

      node = node.data(nodes.descendants(), d => d.id);
      node.exit().remove();
      node = node.enter().append("circle").attr("class", "node").attr("r", 10).merge(node);

      simulation.on("tick", () => {
          link.attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);

          node.attr("cx", d => d.x)
              .attr("cy", d => d.y);
      });

      // 防止动画无限执行，适当的迭代次数后停止
      for (let i = 0; i < 150; ++i) {
          simulation.tick();
      }
  }
}