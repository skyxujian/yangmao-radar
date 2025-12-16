// ====== 1) 把这里替换成你的 Apps Script Web App URL（必须） ======
const API_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

// ====== 小工具：消息条 ======
function showBar(type, text) {
  const bar = document.getElementById("msgBar");
  bar.className = "bar";
  bar.style.display = "block";
  if (type === "ok") bar.classList.add("ok");
  if (type === "err") bar.classList.add("err");
  bar.textContent = text;
}

function hideBar() {
  const bar = document.getElementById("msgBar");
  bar.style.display = "none";
  bar.textContent = "";
  bar.className = "bar";
}

function setBusy(isBusy) {
  const btn = document.getElementById("submitBtn");
  btn.disabled = isBusy;
  btn.textContent = isBusy ? "提交中..." : "提交工单";
}

function resetForm() {
  hideBar();
  document.getElementById("repairForm").reset();
}

// ====== 2) 可选：验证接口可用（不影响提交） ======
async function pingApi() {
  const el = document.getElementById("netStatus");
  try {
    if (!API_URL || API_URL.includes("PASTE_YOUR")) {
      el.textContent = "未配置接口 URL";
      return;
    }
    const r = await fetch(API_URL, { method: "GET" });
    el.textContent = r.ok ? "接口在线" : "接口异常";
  } catch (e) {
    el.textContent = "接口不可达";
  }
}

// ====== 3) 提交工单（核心） ======
async function submitTicket(e) {
  e.preventDefault();
  hideBar();

  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    showBar("err", "请先在 repair.js 里配置 API_URL（Apps Script 的 Web App URL）。");
    return;
  }

  const department = document.getElementById("department").value.trim();
  const type = document.getElementById("type").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const remark = document.getElementById("remark").value.trim();
  const remark2 = document.getElementById("remark2").value.trim();

  // 前端必填校验（防呆）
  if (!department) return showBar("err", "请填写：报修部门");
  if (!type) return showBar("err", "请选择：问题类型");
  if (!title) return showBar("err", "请填写：问题标题");
  if (!contact) return showBar("err", "请填写：联系方式");

  setBusy(true);

  try {
    const payload = {
      department,
      type,
      title,
      description,
      contact,
      remark,
      remark2
    };

    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // Apps Script 兼容写法
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { ok: resp.ok, raw: text }; }

    if (!resp.ok || data.ok === false) {
      showBar("err", "提交失败：\n" + (data.error || data.message || text || "未知错误"));
      return;
    }

    const ticketId = data.id ? `工单号：${data.id}` : "工单已创建";
    showBar("ok", `提交成功 ✅\n${ticketId}\n请等待处理。`);
    document.getElementById("repairForm").reset();
  } catch (err) {
    showBar("err", "提交失败（网络或权限问题）：\n" + err);
  } finally {
    setBusy(false);
  }
}

// 绑定表单事件（关键：避免你之前 submitTicket not defined 那类错误）
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("repairForm");
  form.addEventListener("submit", submitTicket);
  pingApi();
});

// 为了兼容你之前可能调用过的函数名（不报错）
function submitRepair(e) {
  return submitTicket(e);
}
