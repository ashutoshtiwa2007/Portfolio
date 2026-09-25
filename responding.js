document.addEventListener('DOMContentLoaded',()=>{
    'use strict';

    const cliInput = document.getElementById('cliinput');
    const outputArea = document.getElementById('output');
    const scrollContainer = document.querySelector('main.terminal');
    const quickChips= document.querySelectorAll('.cmd-chip');

    const state ={
        history: [],
        historyIndex: -1,
        inContactMode: false,
        contactStep: 0,
        contactData:{
            name:'',
            email:'',
            message: ''
        }

    };

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    const promptLabel = document.querySelector('.promptlabel');

    function initAudio(){
        if(!audioCtx){
            audioCtx =new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    
    function playTone(frequency,waveType,duration){
        initAudio();

        try{
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency,audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.04,audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime+duration);
        }catch(err){

        }
    }

    const soundBeep =() => playTone(880,'square',0.04);
    const soundExecute =() => playTone(520,'square',0.08);
    const soundSuccess = ()=>{
        playTone(440,'square',0.08);
        setTimeout(()=> playTone(660,'square',0.12),90);
    };
    const soundError =()=> playTone(140,'sawtooth',0.22);

    const COMMAND_REGISTRY ={
        'cat about.txt':`
        <div class="panel-box">
        <div class="panel-title">[OPERATOR DOSSIER: RACHIT]</div>
        -------------------------------------------------------------
        CLASS   : Student, Athlete & Coder
        FIELDS  : Roller Skating, Cricket, Basketball, World History
        Building: Web applications, interactive experiments
        -------------------------------------------------------------
        </div>`,

        'ls /interests':`
        <div class="panel-box">
        <div class="panel-title">[INTERESTS & SKILLS INVENTORY]</div>
        • [SPORTS] Cricket,Basketball
        • [HISTORY] Anicient Empires, Battle Starategies, World Timelines
        • [DEV] HTML5,CSS3,Javascript,UI layouts
        </div>
        `,
        'cat sports.log':`
        <div class="panel-box">
        <div class ="panel-title">[ATHLETICS LOGS // STATS]</div> 
        // SKATING  : Balance, high-speed control, drift turns
        // CRICKET  : Hand-eye reaction, strategic battling, active fielding
        // BASKETBALL : Fast breaks, defence posture, court stamina 
        </div>`,

        'cat projects.dat': `
      <div class="project-card">
        <div class="project-header">
          <span class="project-tag">[FEATURED SYSTEM 01]</span>
          <span class="project-status">● DEPLOYED / OPERATIONAL</span>
        </div>
        <div class="project-title">RECRUIT & CONNECT // TWO-SIDED JOB PLATFORM</div>
        <p class="project-summary">
          A full-featured web portal engineered to eliminate friction between candidates seeking opportunities and hiring managers searching for talent.
        </p>

        <div class="project-roles">
          <div class="role-box">
            <div class="role-title">FOR APPLICANTS / USERS:</div>
            • Search and filter active job openings<br>
            • Inspect prerequisite skills & criteria<br>
            • Submit applications directly through the UI
          </div>
          <div class="role-box">
            <div class="role-title">FOR RECRUITERS & FIRMS:</div>
            • Create and publish new vacancy notices<br>
            • Cite key qualifications & job responsibilities<br>
            • Manage incoming applicant submissions
          </div>
        </div>

        <div class="tech-badges">
          <span class="badge">HTML5</span>
          <span class="badge">CSS3 FLEXBOX/GRID</span>
          <span class="badge">VANILLA JS</span>
          <span class="badge">DOM MANIPULATION</span>
          <span class="badge">FORM HANDLING</span>
        </div>

        <div class="project-actions">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="retro-link">[ SOURCE CODE ↗ ]</a>
          <a href="#" class="retro-link" onclick="alert('Launching live demo...'); return false;">[ LIVE DEMO ↗ ]</a>
        </div>
      </div>

      <div class="project-card">
        <div class="project-header">
          <span class="project-tag">[EXPERIMENT 02]</span>
          <span class="project-status">● PROTOTYPE</span>
        </div>
        <div class="project-title">ANCIENT BATTLES & CIVILIZATIONS // TIMELINE SIMULATOR</div>
        <p class="project-summary">
          Interactive historical encyclopedia built to visualize decisive military campaigns, empire frontiers, and major inventions on an interactive timeline.
        </p>
        <div class="tech-badges">
          <span class="badge">HTML5</span>
          <span class="badge">CSS ANIMATIONS</span>
          <span class="badge">HISTORY ARCHIVE</span>
        </div>
        <div class="project-actions">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="retro-link">[ SOURCE CODE ↗ ]</a>
        </div>
      </div>`,
        
        'history':`
        <div class="panel-box">
        <div class="panel-title">[HISTORICAL STUDY VAULT]</div>
        • Classical Civilization & Early Trade Networks
        • Crucial Military Tactics of Historical Battles
        • Technological Revolutions that reshaped the world
        </div>`,


        'help':`
        AVAILABLE COMMANDS:
            cat about.txt   -Profile summary
            ls /interests   -Skills & interests matrix
            cat sports.log  -Roller skating, cricket & basketball stats
            cat projects.dat-Job & Recruitors platform specs
            history         -Historical research interests  
            ./contacts.sh   -Contacts transmission protocol
            clear           -Clear output log
            `


    };

    function writeToTerminal(htmlContent){
        const entry = document.createElement('div');
        entry.innerHTML = htmlContent;
        outputArea.appendChild(entry);

        
        scrollContainer.scrollTop = 0;
    }

    function startContactWizard(){
        state.inContactMode = true;
        state.contactStep= 1;
        state.contactData={name:'',email:'',message:''};

        writeToTerminal(`
            <div class="contact-wizard-box">
            <div class="wizard-title">&gt;&gt; INITIATING TRANSMISSION CHANNEL [FREQ: 144.8MHz]</div>
            <p> You can send a direct dispatch to Rachit. Type your response and hit enter.</p>
            <p style="color : var(--text-dim); font-size: 1.15rem;">(Type 'cancel' anytime to abort)</p>
            </div>
            <p class="wizard-step">&gt;&gt; [STEP 1/3] ENTER SENDER IDENTITY (YOUR NAME):</p>
            `);
        promptLabel.textContent ='sender-name:~$';
        soundExecute();

    }

    function handleWizardInput(rawInput){
        const input = rawInput.trim();
        if (input.toLowerCase()==='cancel'){
            state.inContactMode= false;
            state.contactStep=0;
            promptLabel.textContent='rachit@base:~$';
            writeToTerminal(`<p style="color: var(--text-alert);">&gt;&gt;TRANSMISSION ABORTED.</p>`);
            soundError();

            return;
        }

        if (input===''){
            writeToTerminal(`<p style="color: var(--text-alert);">&gt;&gt; FIELD CANNOT BE EMPTY. PLEASE ENTER DATA:</p>`);
            soundError();
            return;
        }

        if(state.contactStep===1){
            state.contactData.name = input;
            state.contactStep= 2;
            writeToTerminal(`<p><span class="promptlabel">sender-name:~$</span> ${input}</p>`);
            writeToTerminal(`<p class="wizard-step">&gt;&gt; [STEP 2/3] ENTER RETURN FREQUENCY (YOUR EMAIL):</p>`);
            promptLabel.textContent='sender-email:~$';
            soundExecute();
        }else if(state.contactStep==2){
            state.contactData.email=input;
            state.contactStep=3;
            writeToTerminal(`<p><span class="promptlabel">sender-email:~$</span> ${input}</p>`);
            writeToTerminal(`<p class="wizard-step">&gt;&gt; [STEP 3/3] ENTER TRANSMISSION PAYLOAD (MESSAGE):</p>`);
            promptLabel.textContent = 'message:~$';
            soundExecute();

        }else if(state.contactStep ===3){
            state.contactData.message =input;
            writeToTerminal(`<p><span class="promptlabel">message:~$</span> ${input}</p>`);

      writeToTerminal(`
        <div class="wizard-receipt">
          <div class="wizard-receipt-title">✔ TRANSMISSION CONFIRMED // PACKET ARCHIVED</div>
          <p><strong>FROM    :</strong> ${state.contactData.name}</p>
          <p><strong>REPLY TO:</strong> ${state.contactData.email}</p>
          <p><strong>PAYLOAD :</strong> "${state.contactData.message}"</p>
          <br>
          <p style="color: var(--text-highlight);">&gt;&gt; STATUS 200 OK: Message dispatched to Rachit. Expect a reply soon!</p>
        </div>
      `);

      state.inContactMode=false;
      state.contactStep=0;
      promptLabel.textContent='rachit@base:~$';
      soundSuccess();
        }
        
    }

    function processCommand(rawInput){
        const cleanCmd =rawInput.trim().toLowerCase();
        writeToTerminal(`<p><span class="promptlabel">rachit@base:~$</span> ${rawInput}</p>`);
        
        if (cleanCmd === ''){
            return;
        }

        state.history.push(rawInput);
        state.historyIndex = state.history.length;

        if(cleanCmd === 'clear'){
            outputArea.innerHTML ='';
            soundExecute();
            return;
        }

        if (cleanCmd === './contacts.sh'|| cleanCmd ==='contact'|| cleanCmd==='./contacts.sh'){
            startContactWizard();
            return;
        }

        let commandToExecute = cleanCmd;
        if (cleanCmd === 'projects') commandToExecute = 'cat projects.dat';
        if (cleanCmd === 'about') commandToExecute = 'cat about.txt';
        if (cleanCmd === 'sports') commandToExecute = 'cat sports.log';

        if (COMMAND_REGISTRY[commandToExecute]){
            writeToTerminal(COMMAND_REGISTRY[commandToExecute]);
            soundExecute();

        }else{
            writeToTerminal(`
                <p style="color: var(--text-alert);">
                &gt;&gt; Command not found: "${rawInput}". Type <span class="highlight">help</span> for the command list.
                </p>
                `);
                soundError();
            }
        }
        

        cliInput.addEventListener('keydown',(e) =>{
            if(e.key==='Enter'){
                const val =cliInput.value;
                cliInput.value='';

                if(state.inContactMode){
                    handleWizardInput(val);
                }else{
                    processCommand(val);
                }
            }

            else if(!state.inContactMode && e.key === 'ArrowUp'){
                e.preventDefault();
                if (state.history.length > 0 && state.historyIndex>0){
                    state.historyIndex--;
                    cliInput.value = state.history[state.historyIndex];
                    soundBeep();
                }
            }

            else if(!state.inContactMode && e.key === 'ArrowDown'){
                e.preventDefault();
                if (state.historyIndex < state.history.length - 1){
                    state.historyIndex++;
                    cliInput.value = state.history[state.historyIndex];
                    soundBeep();
                }else{
                    state.historyIndex=state.history.length;
                    cliInput.value ='';
                }
            }
            });
        
            quickChips.forEach((button) => {
                button.addEventListener('click',()=>{
                    if(state.inContactMode) return;
                    const commandToRun = button.getAttribute('data-cmd');
                    cliInput.value='';
                    processCommand(commandToRun);
                });
            });

            document.addEventListener('click',(event)=>{
                if(!event.target.closest('.cmd-chip') && window.getSelection().toString().length===0){
                    cliInput.focus();
                }
                });
        
    
});