// ====== 配置区（必填） ======
const API_URL = "https://script.google.com/macros/s/AKfycbw7NeL2bZWq8zAluSeMrl8HfPFF6NX5dqzXd0-CY8-yrVXBOoQlMTDTOwq9-STt_0iQBA/exec";

// ====== 主逻辑 ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("repairForm");
  const btn = document.getElementById("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    btn.disabled = true;
    btn.innerText = "提交中…";

    const data = {
      department: document.getElementById("department").value,
      category: document.getElementById("category").value,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      contact: document.getElementById("contact").value,
      remark: document.getElementById("remark").value
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.ok) {
        alert("✅ 提交成功，工单已创建\n编号：" + result.id);
        form.reset();
      } else {
        alert("❌ 提交失败：" + (result.error || "未知错误"));
      }

    } catch (err) {
      alert("❌ 提交失败（网络或权限问题）");
      console.error(err);

    } finally {
      btn.disabled = false;
      btn.innerText = "提交工单";
    }
  });
});

// ====== 清空 ======
function resetForm() {
  document.getElementById("repairForm").reset();
}
