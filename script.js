'use strict';
const $ = id => document.getElementById(id);
const interaction = $('interaction'), gift = $('giftDialog'), stage = $('stage'), paper = $('paper');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let busy = false, sealed = true, reading = false, page = 0, pages = [], flowerReceived = false, giftOrigin;
const wait = ms => new Promise(resolve => setTimeout(resolve, reduced.matches ? 0 : ms));
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
const letterParagraphs = [
  'Chúc mừng ngày 20/10, vợ yêu của anh!',
  'Cảm ơn em vì đã ở bên anh, cùng anh đi qua những ngày vui và cả những lúc cuộc sống còn nhiều lo toan. Có em, những điều bình thường nhất cũng trở thành điều anh muốn trân trọng.',
  'Anh mong em luôn khỏe mạnh, được làm những điều em thích và có thật nhiều lý do để mỉm cười. Mong rằng bên anh, em luôn cảm thấy mình được yêu thương, được lắng nghe và được chở che.',
  'Anh có thể chưa nói lời ngọt ngào thật giỏi, nhưng anh muốn mỗi ngày đều học cách làm một người chồng tốt hơn — để em không chỉ nhận được lời chúc hôm nay, mà còn cảm nhận được tình yêu trong những ngày sau nữa.',
  'Hôm nay là ngày của em. Còn yêu em là chuyện của anh mỗi ngày.',
  'Thương em thật nhiều,\nChồng của em ♡'
];
function lock(value) {
  busy = value;
  ['tableLetter','giftButton','putDown','seal','takePaper','reseal','leave','closeLetter','letterGift','receiveFlowers','closeGift','keepFlowers'].forEach(id => $(id).disabled = value);
}
function syncWorld() { document.querySelector('.world').classList.toggle('focused', interaction.open || gift.open); }
function announce(text) { $('status').textContent = text; }
async function inspectLetter() {
  if (busy || interaction.open || gift.open) return;
  lock(true); interaction.showModal(); syncWorld();
  await wait(800); lock(false); (sealed ? $('seal') : $('takePaper')).focus();
  announce('Đã cầm phong bì lên. ' + (sealed ? 'Chạm dấu sáp để mở thư.' : 'Lấy thư ra đọc.'));
}
function showPagesContent(parts) {
  $('pageContent').replaceChildren(...parts.map(text => { const p = document.createElement('p'); p.textContent = text; p.style.whiteSpace = 'pre-line'; return p; }));
}
// Measure actual available paper height and split text into pages, not a hidden scroll area.
function paginate() {
  const content = $('pageContent');
  if (content.clientHeight < 20) return;
  pages = []; let current = [];
  for (const paragraph of letterParagraphs) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? line + ' ' + word : word;
      showPagesContent([...current, candidate]);
      if (content.scrollHeight > content.clientHeight + 1 && (current.length || line)) {
        if (line) current.push(line);
        pages.push(current); current = []; line = word;
      } else line = candidate;
    }
    if (line) current.push(line);
  }
  if (current.length) pages.push(current);
  page = Math.min(page, pages.length - 1); renderPage();
}
function renderPage() {
  showPagesContent(pages[page] || []);
  $('pageNumber').textContent = `${page + 1} / ${pages.length}`;
  $('prevPage').disabled = page === 0;
  $('nextPage').disabled = page >= pages.length - 1;
}
async function openLetter() {
  if (busy || !interaction.open || reading || gift.open) return;
  lock(true); $('sealOptions').hidden = true; $('takePaper').hidden = true;
  $('objectHint').textContent = 'Một chút yêu thương đang được mở ra…';
  if (sealed) {
    stage.classList.add('breaking'); await wait(850);
    stage.classList.add('unsealed'); stage.classList.remove('breaking'); sealed = false;
  }
  stage.classList.add('open'); await wait(800);
  stage.classList.add('extract'); await wait(750);
  paper.hidden = false; reading = true; page = 0; $('envelopeView').inert = true;
  await frame(); paginate();
  stage.classList.add('paper-out'); await wait(750);
  $('envelopeView').style.visibility = 'hidden'; lock(false); $('nextPage').disabled ? $('letterGift').focus() : $('nextPage').focus();
  announce('Thư đã mở. Dùng nút mũi tên để lật trang, hoặc chọn nhận bó hoa.');
}
async function closeLetter() {
  if (busy || !reading || gift.open) return;
  lock(true); paper.classList.add('closing'); $('envelopeView').style.visibility = '';
  await wait(650); paper.hidden = true; reading = false; $('envelopeView').inert = false; paper.classList.remove('closing');
  stage.classList.remove('paper-out'); await wait(160);
  stage.classList.remove('extract'); await wait(800);
  stage.classList.remove('open'); await wait(800);
  $('objectHint').textContent = 'Lời thương đã được cất vào phong bì.';
  $('sealOptions').hidden = false; $('takePaper').hidden = false;
  lock(false); $('reseal').focus(); announce('Đã cất thư. Em có thể dán sáp lại hoặc để vậy thôi.');
}
async function reseal() {
  if (busy || sealed || reading) return;
  lock(true); $('sealOptions').hidden = true; $('takePaper').hidden = true;
  stage.classList.remove('unsealed'); stage.classList.add('resealing'); await wait(600);
  sealed = true; stage.classList.remove('resealing'); lock(false);
  $('objectHint').textContent = 'Đã dán lại bằng yêu thương. Em có thể mở bất cứ lúc nào.'; $('seal').focus();
}
async function putDown() {
  if (busy || gift.open) return;
  if (reading) { await closeLetter(); return; }
  lock(true);
  const view = $('envelopeView');
  const anim = view.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(150px) scale(.5) rotate(-8deg)'}],{duration:reduced.matches ? 0 : 650,easing:'ease-in',fill:'forwards'});
  await anim.finished; interaction.close(); anim.cancel(); syncWorld(); lock(false); $('tableLetter').focus();
}
function openGift(origin) {
  if (busy || gift.open) return;
  giftOrigin = origin; $('giftOffer').hidden = false; $('received').hidden = true;
  gift.showModal(); syncWorld(); $('receiveFlowers').textContent = flowerReceived ? '✧ Nâng bó hoa lên lần nữa' : '✧ Đưa tay nhận hoa'; $('receiveFlowers').focus();
}
async function receiveFlowers() {
  if (busy || !gift.open) return;
  lock(true); $('giftOffer').hidden = true; $('received').hidden = false;
  await wait(1700); flowerReceived = true; lock(false); $('keepFlowers').focus();
  announce('Em đã nhận bó hoa. Hai bàn tay đang nâng bó hoa trước mắt.');
}
async function closeGift() {
  if (busy || !gift.open) return;
  lock(true);
  if (!$('received').hidden) { $('received').classList.add('lowering'); await wait(700); $('received').classList.remove('lowering'); }
  gift.close(); syncWorld(); lock(false); giftOrigin?.focus();
}
$('tableLetter').addEventListener('click', inspectLetter);
$('seal').addEventListener('click', openLetter); $('takePaper').addEventListener('click', openLetter);
$('closeLetter').addEventListener('click', closeLetter); $('putDown').addEventListener('click', putDown);
$('reseal').addEventListener('click', reseal);
$('leave').addEventListener('click', () => { if (busy) return; $('sealOptions').hidden = true; putDown(); });
$('prevPage').addEventListener('click', () => { if (busy || page <= 0) return; page--; renderPage(); });
$('nextPage').addEventListener('click', () => { if (busy || page >= pages.length - 1) return; page++; renderPage(); });
$('giftButton').addEventListener('click', e => openGift(e.currentTarget)); $('letterGift').addEventListener('click', e => openGift(e.currentTarget));
$('receiveFlowers').addEventListener('click', receiveFlowers); $('closeGift').addEventListener('click', closeGift); $('keepFlowers').addEventListener('click', closeGift);
interaction.addEventListener('cancel', e => { e.preventDefault(); putDown(); }); gift.addEventListener('cancel', e => { e.preventDefault(); closeGift(); });
let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (reading) paginate(); }, 120); });
document.addEventListener('keydown', e => { if (reading && !gift.open && !busy) { if (e.key === 'ArrowRight' && page < pages.length - 1) { page++; renderPage(); } if (e.key === 'ArrowLeft' && page > 0) { page--; renderPage(); } } });
