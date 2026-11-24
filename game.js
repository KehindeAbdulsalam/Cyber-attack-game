const questionBank = [
    { question: "Urgent email from 'IT-Support@company-update.net' asks you to reset your password via a link. What attack is this?", options: ["Phishing", "DDoS Attack", "SQL Injection", "Brute Force"], correctIndex: 0, explanation: "BLOCKED: Look-alike domains creating urgency are Phishing tactics." },
    { question: "Malware encrypts hospital server files and demands Bitcoin for the decryption key. What attack occurred?", options: ["Spyware", "Adware", "Ransomware", "Worm"], correctIndex: 2, explanation: "BLOCKED: Ransomware locks data via encryption and demands ransom." },
    { question: "Which authentication setup gives the strongest defense against stolen passwords?", options: ["12-char password", "Security questions", "App-based MFA / 2FA", "Monthly resets"], correctIndex: 2, explanation: "BLOCKED: MFA blocks attackers even if they steal your password." },
    { question: "You are on coffee shop public Wi-Fi. What tool encrypts your internet traffic from local eavesdroppers?", options: ["Incognito Mode", "VPN", "Pop-up Blocker", "Bluetooth"], correctIndex: 1, explanation: "BLOCKED: A VPN creates an encrypted tunnel on public networks." },
    { question: "Attackers flood a bank website with millions of fake requests per second to take it offline. What is this?", options: ["Man-in-the-Middle", "Zero-Day", "DDoS Attack", "Credential Stuffing"], correctIndex: 2, explanation: "BLOCKED: DDoS overwhelms servers with traffic to disrupt access." },
    { question: "You find an unlabeled USB drive in the office parking lot. What is the safest protocol?", options: ["Plug it in to check", "Turn it in to IT Security", "Scan on personal PC", "Format for reuse"], correctIndex: 1, explanation: "BLOCKED: Infected USB drives can auto-execute malware when plugged in." },
    { question: "What is the main purpose of installing software security patches promptly?", options: ["Faster CPU speed", "Closing known vulnerabilities", "Freeing disk space", "New UI themes"], correctIndex: 1, explanation: "BLOCKED: Patches fix security flaws before hackers exploit them." },
    { question: "An attacker calls pretending to be your bank to trick you into reading a 6-digit SMS code. What is this?", options: ["Vishing", "Port Scanning", "ARP Spoofing", "Keylogging"], correctIndex: 0, explanation: "BLOCKED: Vishing uses phone calls to manipulate victims into giving up secrets." },
    { question: "Which password strategy is easiest to remember and hardest for computers to crack?", options: ["P@ssw0rd123!", "Pet name + birth year", "4-word random passphrase", "Company name + 2026"], correctIndex: 2, explanation: "BLOCKED: Long passphrases exponentially increase cracking time." },
    { question: "What does the 'HTTPS' padlock icon in a web browser guarantee?", options: ["Site is 100% trustworthy", "Data in transit is encrypted", "No malware on site", "Your IP is hidden"], correctIndex: 1, explanation: "BLOCKED: HTTPS encrypts data between your browser and the server." },
    { question: "What is 'Credential Stuffing'?", options: ["Guessing alphabetically", "Using leaked passwords on other sites", "Stealing ID badges", "Overloading a form"], correctIndex: 1, explanation: "BLOCKED: Reusing passwords lets attackers breach multiple accounts." },
    { question: "What is the 'Principle of Least Privilege' in cybersecurity?", options: ["Giving users only needed access", "Banning all admins", "Free antivirus only", "One shared team login"], correctIndex: 0, explanation: "BLOCKED: Limiting permissions stops malware from spreading network-wide." }
  ];
  
  const STORAGE_KEY = 'cyber_shield_scores_v9';
  const DEFAULT_SCORES = [
    { name: "ZERO_COOL", score: 1850 },
    { name: "NET_RUNNER", score: 1400 },
    { name: "FIREWALL_X", score: 950 }
  ];
  
  let currentQuestions = [], currentIndex = 0, score = 0, streak = 1, blockedCount = 0, timeLeft = 15, timerInterval = null, agentName = "ANON_DEFENDER";
  const TOTAL_QUESTIONS = 10;
  
  function getLeaderboard() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...DEFAULT_SCORES]; } catch (e) { return [...DEFAULT_SCORES]; }
  }
  
  function renderLeaderboard(tbodyId, highlightId = null) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    tbody.innerHTML = getLeaderboard().map((entry, idx) =>
      `<tr${highlightId && entry.id === highlightId ? ' class="highlight-run"' : ''}><td>#${idx + 1}</td><td>${entry.name}</td><td>${entry.score}</td></tr>`
    ).join("");
  }
  
  function saveScore(name, newScore) {
    const board = getLeaderboard();
    const runId = Date.now();
    board.push({ name, score: newScore, id: runId });
    board.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(board.slice(0, 5))); } catch (e) {}
    return runId;
  }
  
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
  }
  function updateHUD() {
    document.getElementById('hud-agent').textContent = agentName;
    document.getElementById('score-val').textContent = score;
    document.getElementById('streak-val').textContent = `${streak}x`;
    document.getElementById('blocked-val').textContent = `${blockedCount} / ${TOTAL_QUESTIONS}`;
  }
  
  function startGame() {
    const rawName = document.getElementById('agent-name').value.trim().toUpperCase();
    agentName = rawName || "ANON_DEFENDER";
    currentQuestions = [...questionBank].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
    currentIndex = 0; score = 0; streak = 1; blockedCount = 0;
    updateHUD();
    showScreen('game-screen');
    loadQuestion();
  }
  
  function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 15;
    const q = currentQuestions[currentIndex];
    const timerEl = document.getElementById('timer-val');
    const logEl = document.getElementById('terminal-log');
    const gridEl = document.getElementById('options-grid');
  
    document.getElementById('question-counter').textContent = `THREAT ${currentIndex + 1} / ${TOTAL_QUESTIONS}`;
    timerEl.textContent = `${timeLeft}s`;
    timerEl.classList.remove('danger');
    document.getElementById('question-text').textContent = q.question;
    logEl.className = 'terminal-log';
    logEl.textContent = `> Agent ${agentName}: Select countermeasure...`;
  
    gridEl.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = `[${idx + 1}] ${opt}`;
      btn.onclick = () => checkAnswer(idx, btn);
      gridEl.appendChild(btn);
    });
  
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 5) timerEl.classList.add('danger');
      if (timeLeft <= 0) { clearInterval(timerInterval); checkAnswer(-1, null); }
    }, 1000);
  }
  
  function checkAnswer(selectedIndex, clickedBtn) {
    clearInterval(timerInterval);
    const q = currentQuestions[currentIndex];
    const logEl = document.getElementById('terminal-log');
    const buttons = document.querySelectorAll('#options-grid .option-btn');
    buttons.forEach(b => b.disabled = true);
  
    if (selectedIndex === q.correctIndex) {
      if (clickedBtn) clickedBtn.classList.add('correct');
      const pts = (100 + timeLeft * 10) * streak;
      score += pts; blockedCount++; streak = Math.min(streak + 1, 4);
      logEl.className = 'terminal-log success';
      logEl.textContent = `> +${pts} PTS | ${q.explanation}`;
    } else {
      if (clickedBtn) clickedBtn.classList.add('wrong');
      if (buttons[q.correctIndex]) buttons[q.correctIndex].classList.add('correct');
      streak = 1;
      logEl.className = 'terminal-log breach';
      logEl.textContent = `> BREACH DETECTED! Correct defense: ${q.options[q.correctIndex]}.`;
    }
  
    updateHUD();
    setTimeout(() => {
      if (currentIndex + 1 >= TOTAL_QUESTIONS) finishGame();
      else { currentIndex++; loadQuestion(); }
    }, 2000);
  }
  
  function finishGame() {
    const statusEl = document.getElementById('end-status');
    statusEl.textContent = blockedCount >= 7 ? "NETWORK SECURED" : "DEFENSE AUDIT COMPLETE";
    statusEl.style.color = blockedCount >= 7 ? "var(--neon-green)" : "var(--neon-cyan)";
    document.getElementById('end-agent').textContent = agentName;
    document.getElementById('end-blocked').textContent = `${blockedCount}/${TOTAL_QUESTIONS}`;
    document.getElementById('final-score').textContent = score;
  
    const runId = saveScore(agentName, score);
    renderLeaderboard('end-leaderboard-body', runId);
    showScreen('gameover-screen');
  }
  
  renderLeaderboard('start-leaderboard-body');
  document.getElementById('start-btn').onclick = startGame;
  document.getElementById('agent-name').onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); startGame(); } };
  document.getElementById('reset-scores-btn').onclick = () => { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} renderLeaderboard('start-leaderboard-body'); };
  document.getElementById('reboot-btn').onclick = () => { renderLeaderboard('start-leaderboard-body'); showScreen('start-screen'); };
    