/**********************
 * repair.js - 最终稳定版
 * 原则：
 * 1. submit 可被任何方式调用
 * 2. event 不存在也不报错
 * 3. DOM 不存在直接忽略
 **********************/

const API_URL =
  'https://calm-mountain-16aa.skyxujian09102.workers.dev';

/**********************
 * 页面初始化
 **********************/
document.addEventListener('DOMContentLoaded', () => {
 function loadDepartments() {
  const select = document.getElementById('department');
  if (!select) return;

  select.innerHTML = `
    <option value="">请选择科室</option>
    <option value="IT部">IT部</option>
    <option value="行政部">行政部</option>
    <option value="财务部">财务部</option>
  `;
}
});

/**********************
 * 加载部门列表
 **********************/
let loadingDept = false;

function loadDepartments() {
  if (loadingDept) return;
  loadingDept = true;

  const select = document.getElementById('department');
  const errorBox = document.getElementById('deptError');

  if (!select) {
    loadingDept = false;
    return;
  }

  fetch(API_URL + '?action=getDepartments&t=' + Date.now())
    .then(res => res.json())
    .then(json => {
      const list = Array.isArray(json?.data) ? json.data : [];

      if (list.length === 0) {
        throw new Error('empty department list');
      }

      select.innerHTML = '<option value="">请选择科室</option>';

      list.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });

      if (errorBox) errorBox.style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      if (select.options.length === 0) {
        select.innerHTML = '<option value="">无法加载科室</option>';
      }
      if (errorBox) errorBox.style.display = 'block';
    })
    .finally(() => {
      loadingDept = false;
    });
}

/**********************
 * 提交工单（核心）
 **********************/
function submitTicket(e) {
  // ✅ 关键修复：event 可有可无
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
      if (json.success !== true) {
        throw new Error(json.message || '提交失败');
      }

      if (resultBox) {
        resultBox.textContent =
          '✅ 工单提交成功，编号：' + (json.data?.id || '');
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
