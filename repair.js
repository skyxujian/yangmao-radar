/***********************
 * IT 运维报修系统 - 前端提交脚本
 * 防呆稳定版
 ***********************/

// ✅ 你的 Apps Script Web App URL（已替你填好）
const API_URL =
  "https://script.google.com/macros/s/AKfycbw7NeL2bZWq8zAluSeMrl8HfPFF6NX5dqzXd0-CY8-yrVXBOoQlMTDTOwq9-STt_0iQBA/exec";

console.log("repair.js 已加载");
console.log("API_URL =", API_URL);

/**
 * 提交工单（按钮点击）
 */
async function submitTicket() {
  const btn = document.getElementById("submitBtn");

  // 读取字段
  const department = document.getElementById("department").value.trim();
  const type = document.getElementById("type").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const remark = document.getElementById("remark").value.trim();

  // 前端校验
  if (!department || !type || !title || !description || !contact) {
    alert("请完整填写所有必填项（*）");
    return;
  }

  const payload = {
    department,
    type,
    title,
    description,
    contact,
    remark,
  };

  console.log("提交数据：", payload);

  // 按钮进入处理中状态
  btn.disabled = true;
  btn.innerText = "提交中…";

  try {
    const res = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain;charset=utf-8"
  },
  body: JSON.stringify(payload)
});


    const result = await res.json();
    console.log("接口返回：", result);

    if (result.ok) {
      alert("提交成功 ✅ 工单已生成");
      resetForm();
    } else {
      alert("提交失败：" + (result.error || "未知错误"));
    }
  } catch (err) {
    console.error("提交异常：", err);
    alert("提交失败（网络或权限问题）");
  } finally {
    btn.disabled = false;
    btn.innerText = "提交工单";
  }
}

/**
 * 清空表单
 */
function resetForm() {
  document.getElementById("department").value = "";
  document.getElementById("type").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("remark").value = "";
}
