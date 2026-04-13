document.addEventListener('DOMContentLoaded', () => {
    const milestonesWrap = document.querySelector('.panel-milestones-wrap');
    if (!milestonesWrap) return;

    // DEV MODE CHECK: Activate controls only with ?dev=true in URL
    const devMode = new URLSearchParams(window.location.search).get('dev') === 'true';

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'framework-controls-container';
    document.body.appendChild(controlsContainer);

    // Hide controls if not in dev mode
    if (!devMode) {
        controlsContainer.style.display = 'none';
    }

    // Initial Data for all cards
    const cardsData = {
        'response': {
            id: 'card-response',
            text: `<p class="framework-text">After your router works, your handlers need to send something back to the browser. Write a function that puts a response onto the socket — status code, headers, body — and wrap it into something clean like <code>res.send()</code> or <code>res.json()</code>. Your design, your call. Now your framework can receive a request, route it, and reply to it. That's it. That's a working framework. Give it a name, publish it to npm, build a real web-app, even with a simple frontend (html, css, js) would work, and write it's backend using YOUR own framework, deploy it live, and send us the link!</p>`,
            x: 18.58, y: 85.75, w: 63.42, h: 9.33, fs: 1.4,
            isLocked: !devMode // Always locked if not in dev mode
        },
        'parser': {
            id: 'card-parser',
            text: `<p class="framework-text">Now parse that raw text. Pull out the method (GET, POST), the path (/about, /api/users), the headers. Write the parser yourself, split on newlines. Handle the edge cases.<br><br> Done when: your code can tell you what path, method any request is asking for.</p>`,
            x: 7.85, y: 17.05, w: 30.50, h: 12.00, fs: 1.45,
            isLocked: !devMode
        },
        'socket': {
            id: 'card-socket',
            text: `<ul class="framework-text" style="list-style: disc; padding-left: 1.2em;">
                    <li>Write a program that opens a TCP socket and listens on a port</li>
                    <li>Send a request to it — from your browser or with curl localhost:port</li>
                    <li>Print the raw output</li>
                    <li>That text you see? That's HTTP. That's all it ever was.</li>
                  </ul>`,
            x: 58.90, y: 2.75, w: 31.50, h: 15.50, fs: 1.4,
            isLocked: !devMode
        },
        'routing': {
            id: 'card-routing',
            text: `<p class="framework-text">When someone asks for /about, your server needs to know what to do. Build that system. Design your API — what should using YOUR framework feel like? This is your creative decision. This is why no two Draco frameworks look the same.<br> Done when: different paths call different functions.</p>`,
            x: 57.05, y: 40.58, w: 35.50, h: 20.00, fs: 1.4,
            isLocked: !devMode
        }
    };

    let activeCardKey = 'response';

    // Create Cards
    Object.keys(cardsData).forEach(key => {
        const data = cardsData[key];
        const card = document.createElement('div');
        card.className = 'framework-card';
        card.id = data.id;
        card.innerHTML = data.text;
        milestonesWrap.appendChild(card);

        if (devMode) {
            card.addEventListener('mousedown', () => {
                selectCard(key);
            });
        }
    });

    // Create Controls UI
    const controlHTML = `
        <div class="framework-controls">
            <div class="controls-row">
                <select id="card-selector" class="card-selector">
                    <option value="response">Phase 4: Response</option>
                    <option value="parser">Phase 2: Parser</option>
                    <option value="socket">Phase 1: Socket</option>
                    <option value="routing">Phase 3: Routing</option>
                </select>
                <div class="control-group">
                    <span>X %</span>
                    <input type="number" id="input-x" class="control-input" step="0.01">
                </div>
                <div class="control-group">
                    <span>Y %</span>
                    <input type="number" id="input-y" class="control-input" step="0.01">
                </div>
                <div class="control-group">
                    <span>W %</span>
                    <input type="number" id="input-w" class="control-input" step="0.5">
                </div>
                <div class="control-group">
                    <span>H %</span>
                    <input type="number" id="input-h" class="control-input" step="0.5">
                </div>
                <div class="control-group">
                    <span>FS (vw)</span>
                    <input type="number" id="input-fs" class="control-input" step="0.05">
                </div>
            </div>
            <div class="controls-row">
                <div class="coord-display" id="coord-display">X: 0, Y: 0</div>
                <button class="lock-btn" id="lock-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span>LOCK & COPY</span>
                </button>
            </div>
        </div>
    `;

    controlsContainer.innerHTML = controlHTML;

    const cardSelector = document.getElementById('card-selector');
    const lockBtn = document.getElementById('lock-btn');
    const inputX = document.getElementById('input-x');
    const inputY = document.getElementById('input-y');
    const inputW = document.getElementById('input-w');
    const inputH = document.getElementById('input-h');
    const inputFS = document.getElementById('input-fs');
    const coordDisplay = document.getElementById('coord-display');

    function selectCard(key) {
        activeCardKey = key;
        cardSelector.value = key;

        // Highlight active card
        Object.keys(cardsData).forEach(k => {
            const cardEl = document.getElementById(cardsData[k].id);
            if (cardEl) cardEl.classList.toggle('active', k === key);
        });

        const data = cardsData[key];
        inputX.value = data.x.toFixed(2);
        inputY.value = data.y.toFixed(2);
        inputW.value = data.w.toFixed(2);
        inputH.value = data.h.toFixed(2);
        inputFS.value = data.fs.toFixed(2);

        updateLockUI();
        updateDisplay();
    }

    function updateDisplay() {
        const data = cardsData[activeCardKey];
        const card = document.getElementById(data.id);
        if (!card) return;

        card.style.left = `${data.x}%`;
        card.style.top = `${data.y}%`;
        card.style.width = `${data.w}%`;
        card.style.height = `${data.h}%`;

        const texts = card.querySelectorAll('.framework-text');
        texts.forEach(t => t.style.fontSize = `${data.fs}vw`);

        coordDisplay.textContent = `[${activeCardKey.toUpperCase()}] X: ${data.x.toFixed(2)}%, Y: ${data.y.toFixed(2)}%, FS: ${data.fs}vw`;
    }

    function updateLockUI() {
        const data = cardsData[activeCardKey];
        lockBtn.classList.toggle('locked', data.isLocked);
        lockBtn.querySelector('span').textContent = data.isLocked ? 'LOCKED' : 'LOCK & COPY';
        [inputX, inputY, inputW, inputH, inputFS].forEach(i => i.disabled = data.isLocked);
    }

    // Dragging 
    let isDragging = false;
    if (devMode) {
        document.addEventListener('mousedown', (e) => {
            const card = e.target.closest('.framework-card');
            if (card) {
                const key = Object.keys(cardsData).find(k => cardsData[k].id === card.id);
                if (key && !cardsData[key].isLocked) {
                    isDragging = true;
                    selectCard(key);
                    card.classList.add('dragging');
                }
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const data = cardsData[activeCardKey];
            const rect = milestonesWrap.getBoundingClientRect();
            data.x = ((e.clientX - rect.left) / rect.width) * 100;
            data.y = ((e.clientY - rect.top) / rect.height) * 100;

            inputX.value = data.x.toFixed(2);
            inputY.value = data.y.toFixed(2);
            updateDisplay();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                const card = document.getElementById(cardsData[activeCardKey].id);
                if (card) card.classList.remove('dragging');
            }
        });
    }

    // Inputs
    [inputX, inputY, inputW, inputH, inputFS].forEach(input => {
        input.addEventListener('input', () => {
            const data = cardsData[activeCardKey];
            if (devMode && !data.isLocked) {
                data.x = parseFloat(inputX.value) || 0;
                data.y = parseFloat(inputY.value) || 0;
                data.w = parseFloat(inputW.value) || 0;
                data.h = parseFloat(inputH.value) || 0;
                data.fs = parseFloat(inputFS.value) || 0;
                updateDisplay();
            }
        });
    });

    cardSelector.addEventListener('change', (e) => {
        selectCard(e.target.value);
    });

    lockBtn.addEventListener('click', () => {
        const data = cardsData[activeCardKey];
        data.isLocked = !data.isLocked;
        updateLockUI();

        if (data.isLocked) {
            lockBtn.querySelector('span').textContent = 'COPIED!';
            const coordString = `[${activeCardKey}] X: ${data.x.toFixed(2)}%, Y: ${data.y.toFixed(2)}%, W: ${data.w.toFixed(2)}%, H: ${data.h.toFixed(2)}%, FS: ${data.fs.toFixed(2)}vw`;
            navigator.clipboard.writeText(coordString);
            setTimeout(() => { if (data.isLocked) updateLockUI(); }, 2000);
        }
    });

    // Init all cards
    Object.keys(cardsData).forEach(k => { activeCardKey = k; updateDisplay(); });
    selectCard('response');
});
