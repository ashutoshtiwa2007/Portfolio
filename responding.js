document.addEventListener('DOMContentLoaded',()=>{
    'use strict';

    const cliInput = document.getElementById('cliinput');
    const outputArea = document.getElementById('output');
    const scrolllContainer = document.querySelector('main.terminal');
    const quickChips= document.querySelectorAll('.cmd-chip');

    const AudioContent = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudio(){
        if(!audioCtx){
            audioCtx =new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audio.Ctx.resume();
        }
    }
    
    function playTone(frequency,waveType,duration){
        initAudio();

        try{
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency,audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.4,audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audiCtx.currentTime+duration);
        }catch(err){

        }
    }

    const soundBeep =() => playTone(880,'square',0.04);
    const soundExecute =() => playTone(520,'square',0.08);
    const soundError =()=> playTone(140,'sawtooth',0.22);

    const COMMAND_REGISTRY ={
        'cat about.txt':`
        <div class="panel-box">
        <div> class="panel-title">[OPERATOR DOSSIER: RACHIT]</div>
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
        <div class="panel-box">
        <div class="panel-title">[PROJECT: JOB & RECUITER PLATFORM]</div>
        =================================================================
        PROJECT  : Employment & Opportunity Exchange Portal
        FUNCTION : Two-sided web app connecting condidates with recuiters.
        FOR USERS: search open roles, read criteria, and submit applications.
        RECUITER : POST OPENINGS and cite hiring specifications.
        TECH     : HTML,CSS,JavaScript.
        STATUS   : Prototype completed & operational!
        ==================================================================
        </div>`,
        
        'history':`
        <div class="panel-box">
        <div class="panel-title">[HISTORICAL STUDY VAULT]</div>
        • Classical Civilization & Early Trade Networks
        • Crucial Military Tactics of Historical Battles
        • Technological Revolutions that reshaped the world
        </div>`,

        './contacts.sh':`
        <div class="panel-box">
        <div class="panel-title"<[COMMUNICATION PROTOCOL]</div>
        Want to talk about sports,history, or building cool web tools?
        STATUS: Open for student collaborations and hackathons!
        DIRECT: Reach out via student email or Github repository
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
        const entry =document.createElement('div');
        entry.innerHTML = htmlContent;
        outputArea.appendChild(entry);

        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }

    function processCommand(rawInput){
        const cleanCmd =rawInput.trim().toLowerCase();
        writeToTerminal(`<p><span class="promptlabel">rachit@base:~$</span> ${rawinput}</p>`);
        
        if (cleanCmd === ''){
            return;
        }

        if(cleanCmd === 'clear'){
            outArea.innerHTML ='';
            soundExecute();
            return;
        }

        if (COMMAND_REGISTRY[cleanCmd]){
            writeToTerminal(COMMAND_REGISTRY[cleanCmd]);
            soundExecute();

        }else{
            writeToTerminal(`
                <p style="color: var(--text-alert);">
                &gt;&gt; Command not found: "${rawinput}". Type <span class="highlight">help</span> for the command list.
                </p>
                `);
                soundExecute();
            }
        }

        cliInput.addEventListener('keydown',(event) =>{
            if(event.key==='Enter'){
                processCommand(cliInput.value);
                cliInput.value='';
            }

            else if(e.key === 'ArrowUp'){
                e.preventDefault();
                if (state.history.length > 0 && state.historyIndex>0){
                    state.historyIndex--;
                    cliInput.value = state.history[state.historyIndex];
                    soundBeep();
                }
            }

            else if(e.key === 'ArrowDown'){
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
                    const commandToRun = button.getAtrribute('data-cmd');
                    cliInput.value='';
                    processCommand(commandToRun);
                });
            });

            document.addEventListener('click',(event)=>{
                if(!event.target.closest('.cmd-chip') && window.getSlection().tostring().length===0){
                    cliInput.focus();
                }
                });
        
    
});