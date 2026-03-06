const d = JSON.parse(require('fs').readFileSync('data/products.json','utf8'));
const misc = ['GM100','GM200','GCP500','GCP511','P037','G711','G712','G713','g808 pro','k502','K551','k551','K607-RGB','K615P-KBS','k629-rgb','K661 WGY','K509P-KS','K509P-wS','S01-5','S101W','S101-BA','S107','H270','m701-RGB','M703','m723'];
misc.forEach(id => {
  const p = d.find(x => x.model===id || x.id===id);
  if(p) {
    console.log((p.model||p.id), '| cat:', p.category, '| name:', p.name, '| imgs:', (p.images||[]).join(',').slice(0,60));
  } else {
    console.log('NOT FOUND:', id);
  }
});
