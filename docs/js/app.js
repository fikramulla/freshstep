import { positiveInteger, suggestedLimit, visualBand, circleFill, adjustCount } from './domain.js';
import { activities } from './activities.js';

const $ = id => document.getElementById(id);
let baseline = null;
let state = null;
let selected = null;
let activityOpener = null;
let confettiTimer;
const activityDialog = $('activity-dialog');
const celebrationDialog = $('celebration-dialog');

function validateInput(id, errorId) {
  const value = positiveInteger($(id).value);
  $(errorId).textContent = value === null ? 'Enter a whole number of at least 1, within the safe numeric range.' : '';
  $(id).setAttribute('aria-invalid', String(value === null));
  if (value === null) $(id).focus();
  return value;
}

$('baseline-form').addEventListener('submit', event => {
  event.preventDefault();
  const value = validateInput('baseline', 'baseline-error');
  if (value === null) return;
  baseline = value;
  $('limit').value = suggestedLimit(value);
  $('limit-form').hidden = false;
  $('limit-error').textContent = '';
  $('limit').setAttribute('aria-invalid', 'false');
  $('limit').focus();
});
$('baseline').addEventListener('input', () => { baseline = null; $('limit-form').hidden = true; });
$('limit-form').addEventListener('submit', event => {
  event.preventDefault();
  const dailyLimit = validateInput('limit', 'limit-error');
  if (dailyLimit === null || baseline === null) return;
  state = { baselinePerDay: baseline, dailyLimit, count: 0 };
  $('setup').hidden = true;
  $('tracker').hidden = false;
  render();
  $('plus').focus();
});

function render() {
  const {count, dailyLimit} = state;
  const band = visualBand(count, dailyLimit);
  $('circle-count').textContent = count;
  // Keep unusually large valid counts readable inside the fixed circle.
  $('circle-count').style.fontSize = String(count).length > 5 ? '1.1rem' : '';
  $('circle-label').textContent = `of ${dailyLimit} today`;
  $('circle').style.setProperty('--fill', `${circleFill(count, dailyLimit) * 100}%`);
  $('circle').style.setProperty('--ring', {steady:'#5c8861',near:'#b08a22',over:'#bd6737'}[band]);
  $('band-label').textContent = {steady:'Below your daily limit',near:'Approaching your daily limit',over:'Above your daily limit — another step is still possible'}[band];
  $('count-output').textContent = `${count} logged`;
  $('minus').disabled = count === 0;
  $('plus').disabled = count === Number.MAX_SAFE_INTEGER;
  $('support').className = `panel support${band !== 'steady' ? ' prominent' : ''}${band === 'over' ? ' over' : ''}`;
  $('support-title').textContent = band === 'steady' ? 'Make room for a small pause.' : 'A pause could be your next step.';
  $('support-copy').textContent = band === 'steady' ? 'You can choose a different next step at any time. Try something below whenever you need it.' : band === 'near' ? 'You’re close to your chosen limit. Take a moment and try a supportive activity before deciding what comes next.' : 'Today has been a challenge. Be kind to yourself: a breathing break, stretch, or short walk is still here for you.';
  $('today').textContent = new Intl.DateTimeFormat(undefined, {weekday:'short', month:'short', day:'numeric'}).format(new Date());
}
$('plus').addEventListener('click', () => {state.count = adjustCount(state.count, 1); render();});
$('minus').addEventListener('click', () => {state.count = adjustCount(state.count, -1); render();});

for (const activity of activities) {
  const card = document.createElement('button');
  card.type = 'button'; card.className = 'activity-card';
  const img = document.createElement('img'); img.src = activity.image; img.alt = ''; img.width = 320; img.height = 190;
  const body = document.createElement('span'); body.className = 'card-body';
  for (const [className, content] of [['eyebrow',activity.category],['card-title',activity.title],['card-description',activity.summary],['card-action','Try this activity ↗']]) {
    const span = document.createElement('span'); span.className = className; span.textContent = content; body.append(span);
  }
  card.append(img, body); $('activity-cards').append(card);
  card.addEventListener('click', () => {
    selected = activity; activityOpener = card;
    $('activity-title').textContent = activity.title;
    $('activity-summary').textContent = activity.summary;
    $('activity-image').src = activity.image; $('activity-image').alt = activity.alt;
    $('activity-steps').replaceChildren(...activity.steps.map(step => {const li = document.createElement('li'); li.textContent = step; return li;}));
    $('activity-source').href = activity.source; $('activity-source').textContent = `${activity.sourceName} ↗ (new tab)`;
    activityDialog.showModal();
  });
}
$('close-activity').addEventListener('click', () => activityDialog.close());
activityDialog.addEventListener('close', () => {selected = null; if (!celebrationDialog.open) activityOpener?.focus();});
$('complete').addEventListener('click', () => {
  if (!activityDialog.open || !selected) return;
  selected = null;
  activityDialog.close();
  celebrationDialog.showModal();
  clearTimeout(confettiTimer);
  $('confetti').replaceChildren();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 24; i++) {
      const piece = document.createElement('i');
      piece.style.setProperty('--x', `${Math.random()*100}%`);
      piece.style.setProperty('--delay', `${Math.random()*.25}s`);
      piece.style.setProperty('--color', ['#648b57','#e3bf55','#c87f51'][i%3]);
      $('confetti').append(piece);
    }
    confettiTimer = setTimeout(() => $('confetti').replaceChildren(), 2300);
  }
});
$('return').addEventListener('click', () => celebrationDialog.close());
celebrationDialog.addEventListener('close', () => {clearTimeout(confettiTimer); $('confetti').replaceChildren(); activityOpener?.focus();});
