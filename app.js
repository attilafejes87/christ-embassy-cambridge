const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const visitDialog=document.querySelector('#visit-dialog');
function showDialog(dialog){closeMenu();dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('[data-visit]').forEach(button=>button.addEventListener('click',()=>showDialog(visitDialog)));
document.querySelector('#privacy-open').addEventListener('click',()=>showDialog(document.querySelector('#privacy-dialog')));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));dialog.addEventListener('click',e=>{const rect=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom))dialog.close();});});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('#calendar-download').addEventListener('click',()=>{
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const offset=(7-days.indexOf(parts.weekday))%7;
  const date=new Date(Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day)+offset+(offset===0&&Number(parts.hour)>=10?7:0)));
  const ymd=date.toISOString().slice(0,10).replaceAll('-','');
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Christ Embassy Cambridge//Visit//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VTIMEZONE','TZID:Europe/London','BEGIN:STANDARD','DTSTART:19701025T020000','TZOFFSETFROM:+0100','TZOFFSETTO:+0000','RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU','END:STANDARD','BEGIN:DAYLIGHT','DTSTART:19700329T010000','TZOFFSETFROM:+0000','TZOFFSETTO:+0100','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU','END:DAYLIGHT','END:VTIMEZONE','BEGIN:VEVENT','UID:'+ymd+'-sunday@cecambridge.com','DTSTAMP:'+stamp,'DTSTART;TZID=Europe/London:'+ymd+'T100000','SUMMARY:Sunday Service - Christ Embassy Cambridge','LOCATION:Coleridge Community College\\, Radegund Road\\, Cambridge CB1 3RJ','DESCRIPTION:Please confirm the latest service arrangements before travelling.\\nContact: info@cecambridge.com\\nhttps://www.facebook.com/profile.php?id=100079727504231','URL:https://cecambridge.com/','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='christ-embassy-cambridge-sunday.ics';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  document.querySelector('#calendar-status').textContent='Calendar file downloaded. Open it to add your visit.';
});
