
/*
 HAVEN AI Assistant
 - Floating Text + Voice assistant
 - Works immediately with local HAVEN navigation/FAQ knowledge.
 - Optional real AI endpoint: set HAVEN_ASSISTANT_CONFIG.endpoint below.
 - Never put a private Gemini/API key in this browser file.
*/
(function(){
  'use strict';

  const CONFIG = window.HAVEN_ASSISTANT_CONFIG || {
    endpoint: '',
    assistantName: 'HAVEN Assistant'
  };

  const KNOWLEDGE = {
    templates: 'HAVEN Templates lets you explore professionally designed website concepts. Open the Templates page to preview available designs and choose one for your project.',
    pricing: 'HAVEN pricing depends on the website/template and optional domain and hosting setup. Open Pricing for the current packages, then contact HAVEN for a final project quote.',
    services: 'HAVEN provides website design/development, branding, and related digital services. Open Services to see the available services.',
    contact: 'You can contact HAVEN through the Contact page or email hello.havenweb@gmail.com.',
    builder: 'HAVEN Website Builder is the main website-building service. You can visit it at https://haven.pntr.dev.',
    about: 'HAVEN is a digital website-building service focused on creating modern, professional web experiences.',
    home: 'Welcome to HAVEN. I can help you find Templates, Pricing, Services, About, or Contact.'
  };

  function page(path){
    window.location.href = path;
  }

  function normalize(s){ return s.toLowerCase().replace(/[?!.،,]/g,'').trim(); }

  function localAnswer(text){
    const q = normalize(text);

    if (/^(templates?|template|template section|show templates|open templates)|template.*(dikhao|kholo|open|show)/.test(q) ||
        /templates?.*(dikhao|kholo|open|show)/.test(q)) {
      setTimeout(()=>page('templates.html'),450);
      return 'Bilkul. Main HAVEN Templates section khol raha hoon. Yahan aap available designs dekh aur preview kar sakte hain.';
    }
    if (/pricing|price|prices|cost|charges|rate|package|packages/.test(q)) {
      setTimeout(()=>page('pricing.html'),450);
      return 'Bilkul. Main HAVEN Pricing section khol raha hoon. Wahan packages aur pricing details mil jayengi.';
    }
    if (/contact|contact us|talk|baat|reach|email/.test(q)) {
      setTimeout(()=>page('contact.html'),450);
      return 'Bilkul. Main Contact page khol raha hoon. Wahan se aap HAVEN ko apni project requirements bhej sakte hain.';
    }
    if (/service|services|what do you offer|kya service/.test(q)) {
      setTimeout(()=>page('services.html'),450);
      return 'Main HAVEN Services page khol raha hoon. Wahan available services explain ki gayi hain.';
    }
    if (/about|who are you|haven kya|haven kia/.test(q)) {
      setTimeout(()=>page('about.html'),450);
      return 'Main HAVEN About page khol raha hoon.';
    }
    if (/website builder|builder|build.*website|website.*ban/.test(q)) {
      setTimeout(()=>window.open('https://haven.pntr.dev','_blank'),450);
      return 'HAVEN Website Builder khol raha hoon.';
    }
    if (/hello|hi|hey|salam|assalam/.test(q)) return KNOWLEDGE.home;
    if (/template/.test(q)) return KNOWLEDGE.templates;
    if (/pricing|price|cost/.test(q)) return KNOWLEDGE.pricing;
    if (/service/.test(q)) return KNOWLEDGE.services;
    if (/contact|email/.test(q)) return KNOWLEDGE.contact;
    return 'Main HAVEN ke baare mein help kar sakta hoon. Aap “Templates kholo”, “Pricing batao”, “Services dikhao” ya “Contact kholo” keh sakte hain.';
  }

  async function getReply(text){
    if(CONFIG.endpoint){
      try{
        const r = await fetch(CONFIG.endpoint,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({message:text, page:location.href})
        });
        if(!r.ok) throw new Error('Endpoint returned '+r.status);
        const data = await r.json();
        return data.reply || data.text || data.message || localAnswer(text);
      }catch(e){
        console.warn('HAVEN assistant endpoint failed:',e);
      }
    }
    return localAnswer(text);
  }

  function createWidget(){
    if(document.getElementById('havenAiLauncher')) return;

    const launcher=document.createElement('button');
    launcher.id='havenAiLauncher';
    launcher.className='haven-ai-launcher';
    launcher.setAttribute('aria-label','Open HAVEN Assistant');
    launcher.innerHTML='<span class="haven-ai-orb">✦</span><span>Ask HAVEN</span>';

    const panel=document.createElement('section');
    panel.id='havenAiPanel';
    panel.className='haven-ai-panel';
    panel.setAttribute('aria-label','HAVEN AI Assistant');
    panel.innerHTML=`
      <div class="haven-ai-head">
        <div class="haven-ai-brand">
          <div class="haven-ai-logo">H</div>
          <div><div class="haven-ai-name">${CONFIG.assistantName || 'HAVEN Assistant'}</div><div class="haven-ai-status">Text + Voice</div></div>
        </div>
        <button class="haven-ai-close" id="havenAiClose" aria-label="Close">×</button>
      </div>
      <div class="haven-ai-messages" id="havenAiMessages"></div>
      <div class="haven-ai-quick">
        <button data-q="Open Templates">Templates</button>
        <button data-q="Open Pricing">Pricing</button>
        <button data-q="Open Services">Services</button>
        <button data-q="Open Contact">Contact</button>
      </div>
      <div class="haven-ai-inputbar">
        <input id="havenAiInput" class="haven-ai-input" placeholder="Ask HAVEN anything..." autocomplete="off">
        <button id="havenAiMic" class="haven-ai-action" title="Voice input" aria-label="Voice input">🎙</button>
        <button id="havenAiSend" class="haven-ai-action haven-ai-send" title="Send" aria-label="Send">➤</button>
      </div>
      <div class="haven-ai-note">Voice input uses your browser. A real AI endpoint can be connected later.</div>
    `;
    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const messages=panel.querySelector('#havenAiMessages');
    const input=panel.querySelector('#havenAiInput');
    const send=panel.querySelector('#havenAiSend');
    const mic=panel.querySelector('#havenAiMic');

    function addMessage(text, who='bot'){
      const el=document.createElement('div');
      el.className='haven-ai-msg '+who;
      el.textContent=text;
      messages.appendChild(el);
      messages.scrollTop=messages.scrollHeight;
    }

    async function sendMessage(text){
      text=(text||'').trim();
      if(!text) return;
      addMessage(text,'user');
      input.value='';
      addMessage('Thinking…','bot');
      const thinking=messages.lastElementChild;
      const reply=await getReply(text);
      if(thinking) thinking.textContent=reply;
      messages.scrollTop=messages.scrollHeight;
      if('speechSynthesis' in window && window.HAVEN_ASSISTANT_SPEAK){
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(reply));
      }
    }

    addMessage('Hi! I’m the HAVEN Assistant. I can help you with Templates, Pricing, Services, Contact, and the HAVEN Website Builder. You can type or use 🎙 voice.');
    launcher.addEventListener('click',()=>{
      panel.classList.toggle('open');
      if(panel.classList.contains('open')) setTimeout(()=>input.focus(),50);
    });
    panel.querySelector('#havenAiClose').addEventListener('click',()=>panel.classList.remove('open'));
    send.addEventListener('click',()=>sendMessage(input.value));
    input.addEventListener('keydown',e=>{if(e.key==='Enter') sendMessage(input.value)});
    panel.querySelectorAll('.haven-ai-quick button').forEach(b=>b.addEventListener('click',()=>sendMessage(b.dataset.q)));

    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(SpeechRecognition){
      const rec=new SpeechRecognition();
      rec.lang='en-US';
      rec.interimResults=false;
      rec.maxAlternatives=1;
      rec.onstart=()=>{mic.classList.add('listening');mic.textContent='⏹'};
      rec.onend=()=>{mic.classList.remove('listening');mic.textContent='🎙'};
      rec.onerror=()=>{mic.classList.remove('listening');mic.textContent='🎙'};
      rec.onresult=e=>{input.value=e.results[0][0].transcript;sendMessage(input.value)};
      mic.addEventListener('click',()=>{
        try{ rec.start(); }catch(e){ rec.stop(); }
      });
    }else{
      mic.disabled=true;
      mic.title='Voice input is not supported by this browser';
      mic.style.opacity='.45';
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',createWidget);
  else createWidget();
})();
