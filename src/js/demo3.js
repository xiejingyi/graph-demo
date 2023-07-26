import * as d3 from 'd3'
console.log(d3)
export function draw () {
  const flatData = [
    { "id": 1, "name": "John Doe", "supervisorId": null },
    { "id": 2, "name": "Alice Smith", "supervisorId": 1 },
    { "id": 3, "name": "Bob Johnson", "supervisorId": 1 },
    { "id": 4, "name": "Eve Williams", "supervisorId": 2 },
    { "id": 5, "name": "Chris Lee", "supervisorId": 2 },
    { "id": 6, "name": "David Brown", "supervisorId": 3 },
    { "id": 7, "name": "Emma White", "supervisorId": 3 }
  ];

  const width = 800;
  const height = 600;

  const svg = d3.select("svg");

  const stratify = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.supervisorId);

  const treeData = stratify(flatData);

  const treeLayout = d3.tree().size([height, width - 100]); // Reduce the space between the links

  treeLayout(treeData);
  function angledPath(d) {
    const path = d3.path()
    const midY = (d.source.y + d.target.y) / 2; // Calculate the midpoint on the y-axis
    // return "M" + d.source.y + "," + d.source.x
                    + "C" + midY + "," + d.source.x
                    + " " + midY + "," + d.target.x
                    + " " + d.target.y + "," + d.target.x;
      // return `M${d.source.x},${d.source.y}L${d.source.x},${d.target.y}L${d.target.x},${d.target.y}`;
      path.moveTo(d.source.y,d.source.x)
      path.lineTo((d.target.y - d.source.y), d.target.x)
      path.moveTo((d.target.y - d.source.y), d.target.x)
      path.lineTo(d.target.y, d.target.x - 5)
      console.log('srouce',{x: d.source.x, y: d.source.y},d.source.data.name,'target',{x: d.target.x, y: d.target.y},d.target.data.name, path.toString())
      return path.toString()
  }

  const link = svg.selectAll(".link")
      .data(treeData.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d => {
          return angledPath(d);
      });

  const node = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

  node.append("rect")
      .attr("x", -30) // Adjust the position of the rectangle to display the node name properly
      .attr("y", -15)
      .attr("width", 60)
      .attr("height", 30);

  node.append("text")
      .text(d => d.data.name);
}