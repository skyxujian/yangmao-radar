/**********************
 * 基础配置（必须填）
 **********************/
const API_URL = 'https://script.google.com/macros/s/AKfycbxo8959wtz4dU-WsA2x2vr8WTwTbp77ryM_cqXdihT263PP3qpREjcaROOtbH7wbMOHbQ/exec';

/**********************
 * 页面加载完成
 **********************/
document.addEventListener('DOMContentLoaded', function () {
  console.log('repair.js 已加载');
  console.log('API_URL =', API_URL);
  loadDepartments();
});

/**********************
 * 加载科室
 **********************/
function loadDepartments() {
  const select = document.getElementById('department');
  if (!select) return;

  fetch(API_URL + '?action=getDepartments')
    .then(res => res.json())
    .then(json => {
      if (!json.ok) throw new Error('接口失败');
      select.innerHTML = '<option value="">请选择科室</option>';
      json.data.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
    })
    .catch(err => {
      console.error(err);
      select.innerHTML = '<option value="">无法加载科室</option>';
      alert('无法加载科室列表，请联系 IT');
    });
}

/**********************
 * 提交工单
 **********************/
function submitTicket(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const btn = event && event.target
    ? event.target
    : document.querySelector('button[onclick*="submitTicket"]');

  btn.disabled = true;
  btn.textContent = '提交中…';

  // 后面代码不动
}
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = '提交中…';

  const data = {
    department: valueOf('department'),
    type: valueOf('type'),
    title: valueOf('title'),
    description: valueOf('description'),
    contact: valueOf('contact'),
    remark: valueOf('remark')
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(json => {
      if (!json.ok) throw new Error(json.error || '提交失败');
      alert('提交成功 ✅ 工单已生成');
      document.getElementById('repairForm').reset();
    })
    .catch(err => {
      console.error(err);
      alert('提交失败，请稍后重试');
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = '提交工单';
    });

/**********************
 * 工具函数
 **********************/
function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
