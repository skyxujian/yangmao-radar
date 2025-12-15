/***********************
 * IT 运维报修 - 前端脚本
 ***********************/

// ★ 把这里换成你的 Apps Script Web App URL ★
const API_URL = "https://script.google.com/macros/s/AKfycbztpmmEuwCp6Db6zcxUZYfiGIRENCuc8I_-cL3gyiHe9HOIrzwiaAgQZwyR45B7LzeQ9g/exec";

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

async function submitTicket() {
  const payload = {
    dept: v("dept"),
    category: v("category"),
    description: v("desc"),
    name: v("name"),
    contact: v("contact"),
    photo: v("photo"),
    note: v("note")
  };

  if (!payload.dept || !payload.category || !payload.description || !payload.name || !payload.contact) {
    alert("请把带 * 的必填项填写完整");
    return;
  }

  try {
    const res = await fetch(API_URL, {
  method: "POST",
  body: JSON.stringify(payload)   
});
    const data = await res.json();

    if (data.ok) {
      alert("提交成功 ✅ 工单号：" + data.id);
      clearForm();
    } else {
      alert("提交失败：" + (data.error || "未知错误"));
    }
  } catch (e) {
    alert("提交失败（网络或权限问题）：" + e);
  }
}

function clearForm() {
  ["dept","category","desc","name","contact","photo","note"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
