/*************************************************
 * IT 运维支持系统 - 前端脚本（防呆稳定版）
 * 文件：repair.js
 *************************************************/

/**
 * 👉 必改项：填你的 Apps Script Web App URL
 * 例如：https://script.google.com/macros/s/xxxxxx/exec
 */
const API_URL = "https://script.google.com/macros/s/AKfycbxpabEI5sYP4ioK9Eis-VBreZxsrUXx9pnQsymDc6EXTdUth74M8r6pRFSe5EV1I247-A/exec";

/**
 * 页面加载完成后检查 API_URL
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("页面 JS 已加载");

  if (!API_URL || API_URL.includes("请在这里")) {
    showTopWarning("⚠️ 请先在 repair.js 中配置 API_URL（Apps Script Web App URL）");
  }
});

/**
 * 顶部提示条
 */
function showTopWarning(text) {
  let bar = document.getElementById("topWarning");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "topWarning";
    bar.style.cssText = `
      background:#fff3cd;
      color:#856404;
      padding:12px;
      margin-bottom:16px;
      border:1px solid #ffeeba;
      border-radius:6px;
      font-size:14px;
    `;
    const container = document.querySelector(".container") || document.body;
    container.prepend(bar);
  }
  bar.innerText = text;
}

/**
 * 表单提交主函数（防呆）
 */
async function submitTicket(event) {
  event.preventDefault();

  console.log("submitTicket 触发");

  // 防 API 未配置
  if (!API_URL || API_URL.includes("请在这里")) {
    alert("请先配置 API_URL");
    return;
  }

  const btn = document.getElementById("submitBtn");
  const form = document.getElementById("repairForm");

  if (!btn || !form) {
    alert("页面结构异常（按钮或表单不存在）");
    return;
  }

  // 锁按钮
  btn.disabled = true;
  const oldText = btn.innerText;
  btn.innerText = "提交中，请稍候…";

  try {
    // 采集表单数据
    const data = {
      department: getValue("department"),
      category: getValue("category"),
      title: getValue("title"),
      description: getValue("description"),
      contact: getValue("contact"),
      remark: getValue("remark")
    };

    // 校验必填项
    if (!data.department || !data.category || !data.title || !data.contact) {
      alert("请填写所有必填项");
      throw new Error("表单校验未通过");
    }

    console.log("提交数据：", data);

    // 发起请求
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("网络错误或接口无权限");
    }

    const result = await response.json();
    console.log("接口返回：", result);

    if (!result.ok) {
      throw new Error(result.error || "后端返回失败");
    }

    // 成功
    alert("✅ 提交成功，工单已创建");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("❌ 提交失败：" + err.message);
  } finally {
    // 解锁按钮
    btn.disabled = false;
    btn.innerText = oldText;
  }
}

/**
 * 安全取值函数（防 null）
 */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/**
 * 重置表单（可选）
 */
function resetForm() {
  const form = document.getElementById("repairForm");
  if (form) form.reset();
}
