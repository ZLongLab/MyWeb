import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const window={};
for(const file of ['assets/image-inspiration-data.js','assets/image-inspiration-core.js','assets/video-templates.js'])vm.runInNewContext(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),{window,Set,URL});
const items=window.IMAGE_INSPIRATION,core=window.IMAGE_CORE,ids=items.map(i=>i.id),plain=x=>JSON.parse(JSON.stringify(x));
assert.equal(items.length,20);assert.equal(new Set(ids).size,20);
for(const category of ['人物','产品','海报','场景','插画'])assert.equal(core.filter(items,category,'',[],false).length,4);
for(const item of items){assert.ok(window.VIDEO_TEMPLATES.some(v=>v.id===item.video));for(const key of ['subject','setting','look','composition','palette','avoid'])assert.ok(item[key]?.length>0);assert.ok(fs.existsSync(new URL('../assets/images/inspiration/'+item.id+'.svg',import.meta.url)));const prompt=core.compose(item);assert.ok(prompt.includes(item.subject));assert.ok(prompt.includes('没有附带参考图'));assert.ok(!prompt.includes('同上'));}
assert.equal(items.filter(i=>i.source).length,2);
for(const item of items.filter(i=>i.source)){assert.equal(item.source.license,'CC BY 4.0');assert.equal(new URL(item.source.url).protocol,'https:');assert.ok(item.source.author&&item.source.changes);}
assert.equal(core.filter(items,'全部','PORTRAIT',[],false)[0].id,'window-portrait');
assert.equal(core.filter(items,'全部','<script>',[],false).length,0);
const empty={version:1,favorites:[]},first={version:1,favorites:[ids[0]]},second={version:1,favorites:[ids[1],ids[0]]};
assert.deepEqual(plain(core.merge(first,second,ids)),{version:1,favorites:[ids[0],ids[1]]});assert.deepEqual(first.favorites,[ids[0]]);
for(const invalid of [null,[],{version:2,favorites:[]},{version:1,favorites:[ids[0],ids[0]]},{version:1,favorites:['unknown']},{version:1,favorites:'bad'}])assert.throws(()=>core.validate(invalid,ids));
const incoming={version:1,favorites:[ids[0]],apiKey:'must-not-export'};
assert.deepEqual(plain(core.validate(incoming,ids)),first);assert.ok(!JSON.stringify(core.validate(incoming,ids)).includes('apiKey'));
assert.equal(core.filter(items,'全部','',first.favorites,true).length,1);
assert.ok(core.compose({...items[0],subject:'<img src=x onerror=alert(1)>'}).includes('<img src=x onerror=alert(1)>'));
console.log('PASS: 20 examples; five categories; source credits; safe video links; import rejection, merge preservation and data isolation.');
