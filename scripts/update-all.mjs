import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {updateWorld} from './update-world.mjs';
const run=spawnSync(process.execPath,['scripts/update-estonian.mjs'],{encoding:'utf8'});console.log(run.stdout);if(run.status!==0)console.warn(run.stderr);
const results=[{source:'MuusikaPlaneet',ok:run.status===0,...(run.status!==0?{error:'Fetch or parsing failed; previous data retained'}:{})},...await updateWorld()];
await fs.writeFile('data/update-status.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');
const summary=results.map(r=>`- ${r.source}: ${r.ok?'updated':`previous snapshot retained (${r.error})`}`).join('\n');console.log(summary);if(process.env.GITHUB_STEP_SUMMARY)await fs.appendFile(process.env.GITHUB_STEP_SUMMARY,'## Weekly music update\n'+summary+'\n');
for(const r of results)if(!r.ok)console.log('::warning::'+r.source+': '+r.error+'; previous snapshot retained');
if(!results.some(r=>r.ok))process.exitCode=1;
