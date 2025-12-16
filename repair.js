// ========= 配置区 =========
// 把下面这个地址，换成你自己的 Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbw7NeL2bZWq8zAluSeMrl8HfPFF6NX5dqzXd0-CY8-yrVXBOoQlMTDTOwq9-STt_0iQBA/exec";
// ==========================

console.log("repair.js 已加载");
console.log("API_URL =", API_URL);

async function submitTicket(event) {
  event.preventDefault();

  if (!API_URL || API_URL.includes("YOUR_KEY_HERE")) {
    alert("⚠️ 请先在 repair.js 中配置 API_URL");
    return;
  }

  const data = {
    department: document.getElementById("department").value,
    type: document.getElementById("type").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    contact: document.getElementById("contact").value,
    remark: document.getElementById("remark").value
  };

  if (!data.department || !data.type || !data.title || !data.contact) {
    alert("❌ 请填写所有必填字段");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.innerText = "提交中…";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();

    if (result.ok) {
      alert("✅ 提交成功，工单已创建");
      document.getElementById("repairForm").reset();
    } else {
      alert("❌ 提交失败：" + (result.error || "未知错误"));
    }
  } catch (err) {
    console.error(err);
    alert("❌ 提交失败（网络或权限问题）");
  } finally {
    btn.disabled = false;
    btn.innerText = "提交工单";
  }
}

function resetForm() {
  document.getElementById("repairForm").reset();
}
