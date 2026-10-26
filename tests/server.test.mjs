import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from '../scripts/serve.mjs';

test('server serves complete app assets with correct MIME types and confines requests', async t => {
  const server=createServer(); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const port=server.address().port;
  const request=pathname=>new Promise((resolve,reject)=>{
    http.get({hostname:'127.0.0.1',port,path:pathname},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,type:res.headers['content-type'],body}));}).on('error',reject);
  });
  for(const [url,type] of [['/','text/html'],['/styles.css','text/css'],['/js/app.js','text/javascript'],['/js/domain.js','text/javascript'],['/js/activities.js','text/javascript'],...['nature','breathing','stretching','walking'].map(name=>[`/assets/${name}.svg`,'image/svg+xml'])]) {
    const res=await request(url); assert.equal(res.status,200,url); assert.ok(res.type.startsWith(type),url); assert.ok(res.body.length>0,url);
  }
  for(const url of ['/devpost/learner-profile.md','/package.json','/.env','/.git/config','/../devpost/learner-profile.md','/%2e%2e/devpost/spec.md','/%2e%2e%5cpackage.json']) assert.notEqual((await request(url)).status,200,url);
  assert.equal((await request('/%GG')).status,400);
});
