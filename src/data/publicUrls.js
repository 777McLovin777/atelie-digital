export function safeUrl(value){
  try { const url=new URL(value); return ['https:','http:'].includes(url.protocol)?url.href:''; } catch {return '';}
}
export function routeId(route){try{return decodeURIComponent(route.split('/')[2]||'')}catch{return '__invalid_route__'}}
