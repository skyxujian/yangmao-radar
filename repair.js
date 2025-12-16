// ====== 必须替换成你自己的 exec URL ======
const API_URL = "https://script.google.com/macros/s/AKfycbw7NeL2bZWq8zAluSeMrl8HfPFF6NX5dqzXd0-CY8-yrVXBOoQlMTDTOwq9-STt_0iQBA/exec
";

async function submitTicket(event) {
  event.preventDefault();

  const btn = event.target;
  btn.disabled = true;
  btn.innerText = "提交中...";

  const data = {
    department: document.getElementById("department").value,
    category: document.getElementById("category").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    contact: document.getElementById("contact").value,
    remark: document.getElementById("remark").value || ""
  };

  if (!data.department || !data.category || !data.title || !data.description || !data.contact) {
    alert("请填写完整必填字段");
    btn.disabled = false;
    btn.innerText = "提交工单";
    return;
  }

  try {
    // ⚠️ 关键：不用 JSON，不设 Content-Type
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)   // 直接 body，不加 headers
    });

    const result = await res.json();

    if (result.ok) {
      alert("✅ 提交成功，工单已创建");
      resetForm();
    } else {
      alert("❌ 提交失败：" + (result.error || "未知错误"));
    }
  } catch (err) {
    alert("❌ 提交失败（网络或权限问题）");
    console.error(err);
  }

  btn.disabled = false;
  btn.innerText = "提交工单";
}

function resetForm() {
  document.getElementById("department").value = "";
  document.getElementById("category").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("remark").value = "";
}
