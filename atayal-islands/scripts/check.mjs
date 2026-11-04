import { islands } from '../src/data.js';
import assert from 'node:assert/strict';
assert.equal(islands.length,3,'需有三座島');
for(const island of islands){
 assert.equal(island.questions.length,6,`${island.name} 需六題`);
 assert.ok(island.facts.length>=3);
 assert.ok(island.activity.choices[island.activity.answer]);
 for(const [question,answers,right,hint] of island.questions){
  assert.ok(question&&answers.length===3&&answers[right]&&hint,`${island.name} 題目不完整`);
 }
}
console.log('教材結構檢查通過：3 座島、18 道題、3 個互動活動。');
