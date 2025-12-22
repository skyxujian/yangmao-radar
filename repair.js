/**********************
 * 稳定版 repair.js
 * 原则：单入口、单提交、写死协议
 **********************/

const API_URL =
  'https://script.google.com/macros/s/AKfycbxo8959wtz4dU-WsA2x2vr8WTwTbp77ryM_cqXdihT263PP3qpREjcaROOtbH7wbMOHbQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  loadDepartments();
  document
    .getElementById('repairForm')
    .addEventListener('submit', submitTicket);
});

/**********************
 * 加载科室
 **********************/
function loadDepartments() {
  const select = document.getElementById('department');
  const errorBox = document.getElementById('deptError');

  fetch(API_URL + '?action=getDepartments')
    .then(res => res.json())
    .then(json => {
      if (json.success !== true || !Array.isArray(json.data)) {
        throw new Error('invalid department data');
      }

      const list = json.data
        .map(v => String(v).trim())
        .filter(v => v.length > 0);

      select.innerHTML = '<option value="">请选择科室</option>';
      list.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });

      errorBox.style.display = 'none';
    })
    .catch(err => {
      console.error(err);
      select.innerHTML = '<option value="">无法加载科室</option>';
      errorBox.style.display = 'block';
    });
}

/**********************
 * 提交工单（唯一入口）
 **********************/
function submitTicket(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const resultBox = document.getElementById('resultBox');

  btn.disabled = true;
  btn.textContent = '提交中…';
  resultBox.style.display = 'none';

  const payload = {
    department: valueOf('department'),
    type: valueOf('type'),
    title: valueOf('title'),
    description: valueOf('description'),
    contact: valueOf('contact'),
    remark: valueOf('remark')
  };

  // 前端强校验（防呆）
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

      resultBox.textContent =
        '✅ 工单提交成功，编号：' + (json.id || '');
      resultBox.style.display = 'block';
      document.getElementById('repairForm').reset();
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
  return el ? el.value.trim() : '';
}

function resetBtn(btn) {
  btn.disabled = false;
  btn.textContent = '提交工单';
}
