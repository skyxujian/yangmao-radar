/**********************
 * 基础配置（必须填）
 **********************/
const API_URL = 'https://script.google.com/macros/s/AKfycbxo8959wtz4dU-WsA2x2vr8WTwTbp77ryM_cqXdihT263PP3qpREjcaROOtbH7wbMOHbQ/exec';

/**********************
 * 页面加载完成后执行
 **********************/
document.addEventListener('DOMContentLoaded', () => {
  console.log('repair.js 已加载');
  console.log('API_URL =', API_URL);

  loadDepartments();
});

/**********************
 * 加载科室列表（唯一一个下拉）
 **********************/
function loadDepartments() {
  const select = document.getElementById('department');
  if (!select) {
    console.error('找不到 department 下拉框');
    return;
  }

  fetch(API_URL + '?action=getDepartments')
    .then(res => res.json())
    .then(data => {
      if (!data.ok) throw new Error('接口返回失败');

      select.innerHTML = '<option value="">请选择科室</option>';

      data.data.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('加载科室失败：', err);
      select.innerHTML = '<option value="">无法加载科室</option>';
      alert('无法加载科室列表，请联系 IT');
    });
}

/**********************
 * 提交工单
 **********************/
function submitTicket(event) {
 function submitTicket() {
  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = '提交中...';
  }

  const data = {
    department: document.getElementById('department')?.value || '',
    type: document.getElementById('type')?.value || '',
    title: document.getElementById('title')?.value || '',
    description: document.getElementById('description')?.value || '',
    contact: document.getElementById('contact')?.value || '',
    remark: document.getElementById('remark')?.value || ''
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(resp => {
      if (resp.ok) {
        alert('提交成功，工单已生成');
        document.getElementById('repairForm')?.reset();
      } else {
        alert('提交失败：' + (resp.error || '未知错误'));
      }
    })
    .catch(err => {
      alert('提交失败：网络或接口异常');
      console.error(err);
    })
    .finally(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerText = '提交工单';
      }
    });
}
  const payload = {
    department: getValue('department'),
    type: getValue('type'),
    title: getValue('title'),
    description: getValue('description'),
    contact: getValue('contact'),
    remark: getValue('remark')
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (!data.ok) throw new Error(data.error || '提交失败');

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
}

/**********************
 * 工具函数
 **********************/
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
