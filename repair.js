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
  // 1️⃣ 防止 event 不存在直接炸
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  // 2️⃣ 防止 event.target 不存在
  let btn = null;
  if (event && event.target) {
    btn = event.target;
  } else {
    // 兜底：找提交按钮本身
    btn = document.querySelector('button[onclick*="submitTicket"]');
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = '提交中…';
  }

  // 3️⃣ 采集表单数据（示例）
  const department = document.getElementById('department')?.value || '';
  const type        = document.getElementById('type')?.value || '';
  const title       = document.getElementById('title')?.value || '';
  const description = document.getElementById('description')?.value || '';
  const contact     = document.getElementById('contact')?.value || '';

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      department,
      type,
      title,
      description,
      contact
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        alert('✅ 工单提交成功，编号：' + data.id);
        location.reload();
      } else {
        alert('❌ 提交失败：' + (data.error || '未知错误'));
      }
    })
    .catch(err => {
      console.error(err);
      alert('❌ 网络或服务器错误');
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '提交工单';
      }
    });
}

  const btn = event && event.target
    ? event.target
    : document.querySelector('button[onclick*="submitTicket"]');

  btn.disabled = true;
  btn.textContent = '提交中…';

  // 后面代码不动

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
