import fs from 'node:fs';
import path from 'node:path';

// Vite 6 defaults, followed by project-specific rules (fs.deny replaces defaults).
export const sensitiveDeny=['.env','.env.*','*.{crt,pem}','**/.git/**','**/supabase/.temp/**','**/backups/**','**/.qa/**','**/.aws/**','**/.codex/**','**/*.key','**/*.p12','**/*.pfx','**/credentials*.json','**/service-account*.json'];
export function isSensitivePath(input){
  let value=input.split(/[?#]/,1)[0];
  try{for(let i=0;i<4;i++){const decoded=decodeURIComponent(value);if(decoded===value)break;value=decoded;}}catch{return true;}
  value=value.replaceAll('\\','/').toLowerCase();
  return [value,path.posix.normalize(value)].some(candidate=>{
    const parts=candidate.split('/').filter(Boolean);
    return parts.some((part,i)=>/^\.env(?:\.|$)/.test(part)||['.git','.qa','.aws','.codex','backups'].includes(part)||part==='.temp'&&parts[i-1]==='supabase'||/\.(crt|pem|key|p12|pfx)$/.test(part)||/^(credentials|service-account).*\.json$/.test(part));
  });
}
export function sensitiveArtifacts(root){
  const findings=[];
  function visit(dir){if(!fs.existsSync(dir))return;for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const filename=path.join(dir,entry.name),relative=path.relative(root,filename).replaceAll('\\','/');
    if(entry.isSymbolicLink()||isSensitivePath(relative)){findings.push(relative);continue;}
    if(entry.isDirectory())visit(filename);
    else {
      const content=fs.readFileSync(filename,'utf8');
      let secret=/\bsb_secret_[A-Za-z0-9_-]{24,}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content);
      for(const jwt of content.matchAll(/\beyJ[A-Za-z0-9_-]+\.([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]{20,}\b/g))try{secret ||= JSON.parse(Buffer.from(jwt[1],'base64url')).role==='service_role'}catch{}
      if(secret)findings.push(relative);
    }
  }}visit(root);return findings;
}
export function sensitiveFileProtection(){
  let config;
  return {
    name:'atelier-sensitive-files',
    configResolved(resolved){config=resolved},
    configureServer(server){server.middlewares.use((req,res,next)=>{if(isSensitivePath(req.url||'')){res.statusCode=403;res.end('Forbidden');return;}next();})},
    load(id){if(!id.startsWith('\0')&&isSensitivePath(id))throw new Error('Importação de arquivo protegido bloqueada.');},
    buildStart(){if(config.command==='build'&&config.publicDir&&sensitiveArtifacts(config.publicDir).length)throw new Error('Arquivo sensível ou symlink detectado em public; build bloqueado sem revelar conteúdo.');},
    writeBundle(){if(sensitiveArtifacts(path.resolve(config.root,config.build.outDir)).length)throw new Error('Artefato sensível detectado; build recusado. Não distribuir dist.');}
  };
}
