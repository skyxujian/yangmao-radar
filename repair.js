const API_URL = "https://script.google.com/macros/s/AKfycbzJs5IskLD44e6Aw6_a_9FoQxpCtfzx3DaNWH8PBB_vGMttLr80_lPXBF_zNtjVrC0S1w/exec";

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

async function submitRepair(event) {
  if (event) event.preventDefault();

  const payload = {
    department: getValue("department"),
    title: getValue("title"),
    description: getValue("description"),
    contact: getValue("contact"),
    remark: getValue("remark")
  };

  if (!payload.title) {
    alert("请填写报修标题");
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    });

    alert("提交成功 ✅ 工单已发送");
    clearForm();

  } catch (err) {
    alert("提交失败（网络或权限问题）");
    console.error(err);
  }
}

function clearForm() {
  ["department", "title", "description", "contact", "remark"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
