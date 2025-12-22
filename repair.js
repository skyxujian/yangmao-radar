/**********************
 * 稳定加强版 repair.js
 * 原则：不信任 DOM，不信任后端
 **********************/

const API_URL =
  'https://script.google.com/macros/s/AKfycbxo8959wtz4dU-WsA2x2vr8WTwTbp77ryM_cqXdihT263PP3qpREjcaROOtbH7wbMOHbQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  loadDepartments();

  const form = document.getElementById('repairForm');
  if (form) {
    form.addEventListener('submit', submitTicket);
  } else {
    console.warn('repairForm not found');
  }
});

/**********************
 * 加载科室
 **********************/
function loadDepartments() {
  const select = document.getElementById('department');
  const errorBox = document.getElementById('deptError');

  if (!select) {
    console.warn('department select not found');
    return;
  }

  fetch(API_URL + '?action=getDepartments')
    .then(res => res.json())
    .then(json => {
      const list = json?.data || json?.departments || [];

      if (!Array.isArray(list)) {
        throw new Error('invalid department data');
      }

      const cleanList = list
        .map(v => String(v).trim())
        .filter(v => v.length > 0);

      select.innerHTML = '<option value="">请选择科室</option>';

      cleanList.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });

      if (errorBox) errorBox.style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      select.innerHTML = '<option value="">无法加载科室</option>';
      if (errorBox) errorBox.style.display = 'block';
    });
}

/**********************
 * 提交工单（唯一入口）
 **********************/
function submitTicket(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const resultBox = document.getElementById('resultBox');

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
          '✅ 工单提交成功，编号：' + (json.id || '');
        resultBox.style.display = 'block';
      }

      const form = document.getElementById('repairForm');
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
 * 工具
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
