import test from 'node:test';
import assert from 'node:assert/strict';
import { positiveInteger, suggestedLimit, warningThreshold, visualBand, adjustCount, circleFill } from '../docs/js/domain.js';

test('setup suggestions round up and validate whole safe positive numbers', () => {
  assert.equal(suggestedLimit(20),15); assert.equal(suggestedLimit(10),8);
  assert.equal(suggestedLimit(1),1);
  for(const value of ['', ' ', 0, -1, 1.5, '1e2', 'Infinity', 'abc', '9007199254740992']) assert.equal(positiveInteger(value),null, String(value));
  assert.equal(positiveInteger(' 20 '),20); assert.equal(positiveInteger(Number.MAX_SAFE_INTEGER),Number.MAX_SAFE_INTEGER);
  const max=BigInt(Number.MAX_SAFE_INTEGER);
  assert.equal(BigInt(suggestedLimit(Number(max))), (max*3n+3n)/4n);
});
test('color boundaries are inclusive and graphical progress is capped', () => {
  for(const [limit,threshold,cases] of [[15,10,[[9,'steady'],[10,'near'],[15,'near'],[16,'over']]],[8,6,[[5,'steady'],[6,'near'],[8,'near'],[9,'over']]]]) {
    assert.equal(warningThreshold(limit),threshold);
    for(const [count,band] of cases) assert.equal(visualBand(count,limit),band);
  }
  assert.equal(visualBand(0,1),'steady'); assert.equal(visualBand(1,1),'near');
  assert.equal(circleFill(16,15),1); assert.equal(circleFill(0,15),0); assert.equal(circleFill(5,10),.5);
  const max=BigInt(Number.MAX_SAFE_INTEGER); assert.equal(BigInt(warningThreshold(Number(max))),(max*2n+2n)/3n);
});
test('corrections never become negative and logging never exceeds safe integers', () => {
  assert.equal(adjustCount(0,-1),0); assert.equal(adjustCount(16,-1),15);
  assert.equal(adjustCount(9,1),10); assert.equal(adjustCount(Number.MAX_SAFE_INTEGER,1),Number.MAX_SAFE_INTEGER);
});
