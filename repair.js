// ====== 必须配置 ======
const API_URL =
  "https://script.google.com/macros/s/AKfycbxpabEI5sYP4ioK9Eis-VBreZxsrUXx9pnQsymDc6EXTdUth74M8r6pRFSe5EV1I247-A/exec";
// ====================

if (!API_URL || !API_URL.startsWith("https://script.google.com")) {
  document.getElementById("apiAlert").style.display = "block";
}

function toggleDeptInput() {
  const select = document.getElementById("departmentSelect");
  const input = document.getElementById("departmentInput");

  if (select.value === "其他") {
    input.style.display = "block";
    input.required = true;
  } else {
    input.style.display = "none";
    input.required = false;
  }
}
async function submitTicket(e) {
  e.preventDefault();

  const submitBtn = document.querySelector(".btn-primary");

  // ===== ① 立即进入“处理中”状态 =====
  submitBtn.innerText = "提交中…";
  submitBtn.disabled = true;

  // ===== ② 即时反馈（不等后端）=====
  alert("已提交，正在创建工单，请稍候…");

  // ===== 取表单数据 =====
  const deptSelect = document.getElementById("departmentSelect").value;
  const deptInput = document.getElementById("departmentInput").value.trim();
  const department =
    deptSelect === "其他" ? deptInput : deptSelect;

  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const remark = document.getElementById("remark").value.trim();

  if (!department || !category || !title || !contact) {
    alert("请填写所有必填字段");
    submitBtn.innerText = "提交工单";
    submitBtn.disabled = false;
    return;
  }

  const payload = {
    department,
    category,
    title,
    description,
    contact,
    remark,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.ok) {
      alert("提交成功 ✅ 工单已进入处理队列");
      resetForm();
    } else {
      alert("提交失败：" + (result.error || "未知错误"));
    }
  } catch (err) {
    alert("提交失败（网络或权限问题）");
    console.error(err);
  } finally {
    // ===== ③ 无论成功失败，恢复按钮 =====
    submitBtn.innerText = "提交工单";
    submitBtn.disabled = false;
  }
}



  const payload = {
    department,
    category,
    title,
    description,
    contact,
    remark,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.ok) {
      alert("提交成功 ✅ 工单已发送");
      resetForm();
    } else {
      alert("提交失败：" + result.error);
    }
  } catch (err) {
    alert("提交失败（网络或权限问题）");
    console.error(err);
  }
}

function resetForm() {
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    el.value = "";
  });
  document.getElementById("departmentInput").style.display = "none";
}
