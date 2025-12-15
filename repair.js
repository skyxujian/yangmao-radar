// ===============================
// 配置区：只需要改这里
// ===============================

// ⚠️ 换成你【最新部署】的 Apps Script Web App exec URL
const API_URL = "https://script.google.com/macros/s/AKfycbzJs5IskLD44e6Aw6_a_9FoQxpCtfzx3DaNWH8PBB_vGMttLr80_lPXBF_zNtjVrC0S1w/exec";

// ===============================
// 提交报修
// ===============================

async function submitRepair(event) {
  event.preventDefault();

  const payload = {
    department: document.getElementById("department").value.trim(),
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    contact: document.getElementById("contact").value.trim(),
    remark: document.getElementById("remark").value.trim()
  };

  if (!payload.title) {
    alert("请填写报修标题");
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",           // ⭐ 关键：绕过 GAS 的 CORS
      body: JSON.stringify(payload)
    });

    alert("提交成功 ✅ 工单已发送");
    clearForm();

  } catch (err) {
    alert("提交失败（网络或权限问题）");
    console.error(err);
  }
}

// ===============================
// 清空表单
// ===============================

function clearForm() {
  document.getElementById("department").value = "";
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("remark").value = "";
}

// ===============================
// 页面加载后绑定事件
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("repairForm");
  if (form) {
    form.addEventListener("submit", submitRepair);
  }
});
