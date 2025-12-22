/**********************
 * repair.js - 最终稳定版（已验证）
 **********************/

const API_URL =
  'https://calm-mountain-16aa.skyxujian09102.workers.dev';

/**********************
 * 页面初始化
 **********************/
document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ 加载部门（写死版，保证稳定）
  loadDepartments();

  // 2️⃣ 绑定提交事件
  const form = document.getElementById('repairForm');
  if (form) {
    form.addEventListener('submit', submitTicket);
  }
});

/**********************
 * 部门列表（稳定写死）
 **********************/
function loadDepartments() {
  const select = document.getElementById('department');
  const errorBox = document.getElementById('deptError');

  if (!select) return;

  select.innerHTML = `
    <option value="">请选择科室</option>
    <option value="IT部">IT部</option>
    <option value="行政部">行政部</option>
    <option value="财务部">财务部</option>
  `;

  if (errorBox) errorBox.style.display = 'none';
}

/**********************
 * 提交工单
 **********************/
function submitTicket(e) {
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  const btn = document.getElementById('submitBtn');
  const resultBox = document.getElementById('resultBox');
  const form = document.getElementById('repairForm');

  if (btn) {
    btn.disabled = true;
    btn.textContent = '提交中…';
  }
  if (resultBox) {
    resultBox.style.display = 'none';
  }

  const payload = {
    department: valueOf('department'),
    type: valueOf('type'),
    title: valueOf('title'),
    description: valueOf('description'),
    contact: valueOf('contact'),
    remark: valueOf('remark')
  };

  if (!payload.department || !payload.type) {
    alert('请完整填写必填项');
    resetBtn(btn);
    return;
  }

  if (payload.title.length < 3 || payload.description.length < 5) {
    alert('标题或描述过短');
    resetBtn(btn);
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(json => {
      console.log('提交返回：', json);

      if (!json || json.success !== true) {
        throw new Error(json?.message || '提交失败');
      }

      const id = json.data?.id || '未知';

      if (resultBox) {
        resultBox.textContent =
          '✅ 工单提交成功，编号：' + id;
        resultBox.style.display = 'block';
      }

      if (form) form.reset();
    })
    .catch(err => {
      console.error(err);
      alert('❌ 提交失败：' + err.message);
    })
    .finally(() => {
      resetBtn(btn);
    });
}

/**********************
 * 工具函数
 **********************/
function valueOf(id) {
  const el = document.getElementById(id);
  return el && el.value ? el.value.trim() : '';
}

function resetBtn(btn) {
  if (!btn) return;
  btn.disabled = false;
  btn.textContent = '提交工单';
}
