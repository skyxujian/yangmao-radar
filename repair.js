/* =====================================================
 * IT 运维报修系统 - repair.js（整文件覆盖版）
 * 功能：
 * 1. 楼栋（Sheet） → 科室（二级联动，B列）
 * 2. 自动带出 楼层 / 内线 / 位置
 * 3. 提交按钮“处理中”
 * 4. 防呆校验（位置 4~20 字）
 * ===================================================== */

/* ======================
   1️⃣ 配置区（只改这里）
====================== */

// 你的 Apps Script Web App（/exec 结尾）
const API_URL =
  "https://script.google.com/macros/s/AKfycbwOGy1FcqJtapLsafHTnXlelfNi6EXZWYzAyfLgifyE70bWoPvZD4vyO3dhFbT7_wRpOA/exec";

/* ======================
   2️⃣ 工具函数
====================== */
function $(id) {
  return document.getElementById(id);
}

function toast(msg) {
  alert(msg); // 医院环境最稳
}

function setLoading(on) {
  const btn = $("btnSubmit");
  if (!btn) return;
  btn.disabled = on;
  btn.innerText = on ? "提交中…" : "提交工单";
}

/* ======================
   3️⃣ 页面初始化
====================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("repair.js 已加载");
  console.log("API_URL =", API_URL);

  loadBuildings();

  $("building").addEventListener("change", onBuildingChange);
  $("department").addEventListener("change", onDepartmentChange);
  $("repairForm").addEventListener("submit", submitTicket);
});

/* ======================
   4️⃣ 加载楼栋（Sheet 名）
====================== */
async function loadBuildings() {
  try {
    const res = await fetch(API_URL + "?action=buildings");
    const json = await res.json();
    if (!json.ok) throw new Error("获取楼栋失败");

    const sel = $("building");
    sel.innerHTML = '<option value="">请选择楼栋</option>';

    json.data.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
    toast("无法加载楼栋列表，请联系 IT");
  }
}

/* ======================
   5️⃣ 楼栋 → 科室（二级联动）
====================== */
async function onBuildingChange() {
  const building = $("building").value;
  const deptSel = $("department");

  deptSel.innerHTML = '<option value="">请选择科室</option>';

  if (!building) return;

  try {
    const url =
      API_URL +
      "?action=departments&building=" +
      encodeURIComponent(building);

    const res = await fetch(url);
    const json = await res.json();
    if (!json.ok) throw new Error("获取科室失败");

    json.data.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.dept;
      opt.textContent = `${d.dept}${d.ext ? "（" + d.ext + "）" : ""}`;

      // 把附加信息挂到 option 上
      opt.dataset.floor = d.floor || "";
      opt.dataset.ext = d.ext || "";
      opt.dataset.location = d.location || "";

      deptSel.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
    toast("无法加载科室列表");
  }
}

/* ======================
   6️⃣ 选择科室 → 自动填
====================== */
function onDepartmentChange() {
  const opt = $("department").selectedOptions[0];
  if (!opt) return;

  // 自动填联系方式（内线）
  if (opt.dataset.ext) {
    $("contact").value = opt.dataset.ext;
  }

  // 自动填具体位置（4~20字）
  if (opt.dataset.location) {
    $("position").value = opt.dataset.location.slice(0, 20);
  } else if (opt.value) {
    $("position").value = opt.value.slice(0, 20);
  }
}

/* ======================
   7️⃣ 提交工单（POST）
====================== */
async function submitTicket(e) {
  e.preventDefault();

  const data = {
    building: $("building").value.trim(),
    department: $("department").value.trim(),
    category: $("category").value.trim(),
    title: $("title").value.trim(),
    description: $("description").value.trim(),
    contact: $("contact").value.trim(),
    position: $("position").value.trim(),
    remark: $("remark").value.trim()
  };

  // 防呆校验
  if (!data.building) return toast("请选择楼栋");
  if (!data.department) return toast("请选择科室");
  if (!data.category) return toast("请选择问题类型");
  if (data.title.length < 4 || data.title.length > 20)
    return toast("标题需 4~20 字");
  if (!data.description) return toast("请填写问题描述");
  if (!data.contact) return toast("请填写联系方式");
  if (data.position.length < 4 || data.position.length > 20)
    return toast("具体位置需 4~20 字");

  setLoading(true);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    const text = await res.text();
    let json = {};
    try {
      json = JSON.parse(text);
    } catch (_) {}

    if (!res.ok || !json.ok) {
      throw new Error("提交失败");
    }

    toast("提交成功 ✅ 工单已生成");
    $("repairForm").reset();
  } catch (e) {
    console.error(e);
    toast("提交失败，请检查网络或联系 IT");
  } finally {
    setLoading(false);
  }
}
