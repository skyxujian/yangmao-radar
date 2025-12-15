fetch("pdd_billion_subsidy.json")
  .then(r => r.json())
  .then(data => {
    document.getElementById("content").innerHTML =
      data.items.map(item => "<p>" + item.title + " - " + item.price + "</p>").join("");
  })
  .catch(e => {
    document.getElementById("content").innerHTML = "数据加载失败：" + e;
  });
