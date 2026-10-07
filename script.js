/**
 * Portfolio JavaScript
 * Handles Vertical Sidebar Navigation, Night Mode Toggle, and Interactive Terminal Chat
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. NIGHT MODE / THEME TOGGLE (Media Query & LocalStorage)
    // =========================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const rootElement = document.documentElement;

    const themeIcon = document.getElementById('theme-btn-icon');
    const themeLabel = document.getElementById('theme-btn-label');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');

    const darkMediaMatch = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to apply theme and sync button states
    function applyTheme(theme) {
        rootElement.setAttribute('data-theme', theme);

        const isDark = theme === 'dark';
        if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
        if (themeLabel) themeLabel.textContent = isDark ? 'DAY MODE' : 'NIGHT MODE';
        if (mobileThemeIcon) mobileThemeIcon.textContent = isDark ? '☀' : '☾';
    }

    // Retrieve saved theme preference or detect default from CSS media query
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Auto-detect browser/OS preference
        applyTheme(darkMediaMatch.matches ? 'dark' : 'light');
    }

    // Listen for OS/browser theme preference changes
    darkMediaMatch.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Toggle Handler
    function toggleTheme() {
        const currentTheme = rootElement.getAttribute('data-theme') || (darkMediaMatch.matches ? 'dark' : 'light');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

    // Keyboard shortcut Alt+T to toggle theme
    window.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 't' || e.key === 'T')) {
            e.preventDefault();
            toggleTheme();
        }
    });

    // =========================================================
    // 2. VERTICAL SIDEBAR DRAWER (Responsive & Accessible)
    // =========================================================
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
        if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Close mobile drawer when clicking any nav link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                closeSidebar();
            }
        });
    });

    // =========================================================
    // 3. ACTIVE NAVIGATION LINK ON SCROLL (ScrollSpy)
    // =========================================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.sidebar-nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    sidebarLinks.forEach(l => {
                        l.classList.remove('active');
                        l.removeAttribute('aria-current');
                    });
                    correspondingLink.classList.add('active');
                    correspondingLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavOnScroll);
    updateActiveNavOnScroll(); // initial check

    // =========================================================
    // 4. INTERACTIVE PIXEL TERMINAL CHAT SIMULATOR
    // =========================================================
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const promptChips = document.querySelectorAll('.pixel-prompt-chip');

    const botKnowledge = {
        'projects': "My key projects include:\n1) 'Women Safety Device' (Arduino UNO, GPS & GSM emergency alerts).\n2) 'Power Generation Through Water' (Renewable energy & mechanical systems).\n3) 'Pixel Portfolio Engine' (Modern semantic web system). Check out the #projects section!",
        'skills': "Technical Arsenal: Python, Java, Semantic HTML5/CSS3, Relational Databases, Operating Systems, Arduino IoT Prototyping, and Power BI Data Analytics.",
        'internships': "Yes! I am actively looking for software engineering internships and developer roles. Feel free to connect via the Contact section below or email 17meenakshi28@gmail.com.",
        'contact': "You can reach me via email at 17meenakshi28@gmail.com, on LinkedIn (/in/meenakshi-e-805b55392), or on GitHub (@17meenakshi28E).",
        'status': "SYSTEM HEALTH: 100% HP, 95% MP. Status: Ready for engineering challenges and team collaboration!",
        'help': "Available commands: 'projects', 'skills', 'internships', 'contact', 'status', 'clear'. Or ask any custom question!"
    };

    function appendMessage(sender, text, type) {
        if (!chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `terminal-msg ${type}`;

        const speakerSpan = document.createElement('span');
        speakerSpan.className = 'msg-speaker';
        speakerSpan.textContent = sender;

        const textSpan = document.createElement('span');
        textSpan.className = 'msg-text';
        textSpan.innerText = text;

        msgDiv.appendChild(speakerSpan);
        msgDiv.appendChild(textSpan);
        chatMessages.appendChild(msgDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processUserInput(rawText) {
        const query = rawText.trim().toLowerCase();
        appendMessage('[VISITOR]:', rawText, 'user-msg');

        setTimeout(() => {
            if (query === 'clear') {
                chatMessages.innerHTML = '';
                appendMessage('[SYSTEM]:', 'Terminal buffer cleared.', 'system-msg');
                return;
            }

            let response = "Thanks for your inquiry! I've logged your dispatch. You can explore more sections on the left or send an official note through the contact form.";

            if (query.includes('project') || query.includes('work')) {
                response = botKnowledge['projects'];
            } else if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('language')) {
                response = botKnowledge['skills'];
            } else if (query.includes('intern') || query.includes('hire') || query.includes('job') || query.includes('opportunity')) {
                response = botKnowledge['internships'];
            } else if (query.includes('contact') || query.includes('email') || query.includes('linkedin') || query.includes('reach')) {
                response = botKnowledge['contact'];
            } else if (query.includes('status') || query.includes('hp') || query.includes('health')) {
                response = botKnowledge['status'];
            } else if (query.includes('help')) {
                response = botKnowledge['help'];
            }

            appendMessage('[MEENAKSHI_BOT]:', response, 'bot-msg');
        }, 350);
    }

    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;
            processUserInput(text);
            chatInput.value = '';
        });
    }

    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt');
            if (prompt) {
                processUserInput(prompt);
            }
        });
    });

    // =========================================================
    // 5. SKILLS ARSENAL INTERACTIVITY (Filters, HUD Inspector, & Progress Bars)
    // =========================================================
    const skillTabs = document.querySelectorAll('.pixel-tab-btn');
    const skillCartridges = document.querySelectorAll('.pixel-skill-cartridge');
    const inspectorText = document.getElementById('inspector-text');
    const skillItems = document.querySelectorAll('.skill-meter-item');
    const defaultInspectorMessage = "SYSTEM READY: Select or hover over any technical skill above to inspect implementation details, architectural applications, and proficiency metrics.";

    // A. Filter Tabs (Category Switching)
    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update Tab Active State & ARIA attributes
            skillTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Filter Cartridges with snappy retro fade-in
            skillCartridges.forEach(cartridge => {
                const category = cartridge.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    cartridge.style.display = 'flex';
                    cartridge.style.animation = 'none';
                    // Trigger reflow to restart animation
                    void cartridge.offsetHeight;
                    cartridge.style.animation = 'pixel-fade-in 0.35s ease';
                } else {
                    cartridge.style.display = 'none';
                }
            });

            // Update Inspector HUD on filter change
            if (inspectorText) {
                const tabTitle = tab.textContent.replace('▶', '').trim();
                inspectorText.textContent = `[CATEGORY FILTER ACTIVE: ${tabTitle}] Displaying corresponding technical competencies and architecture modules.`;
            }
        });
    });

    // B. Interactive Skill Inspector HUD
    skillItems.forEach(item => {
        const updateInspector = () => {
            if (!inspectorText) return;
            const skillName = item.getAttribute('data-skill') || 'TECHNICAL SKILL';
            const skillDesc = item.getAttribute('data-desc') || '';
            const levelTag = item.querySelector('.skill-level-tag')?.textContent || '';
            
            inspectorText.innerHTML = `<strong style="color: var(--pixel-accent-yellow);">[${skillName.toUpperCase()}]</strong> <span style="color: var(--pixel-accent-green);">${levelTag}</span> &bull; ${skillDesc}`;
        };

        const resetInspector = () => {
            if (!inspectorText) return;
            inspectorText.textContent = defaultInspectorMessage;
        };

        item.addEventListener('mouseenter', updateInspector);
        item.addEventListener('focus', updateInspector);
        item.addEventListener('mouseleave', resetInspector);
        item.addEventListener('blur', resetInspector);
    });

    // C. Animated Progress Bar Loading on Scroll (Retro Power-Up)
    const progressBars = document.querySelectorAll('.pixel-progress-bar');
    if ('IntersectionObserver' in window) {
        // Temporarily initialize fills to 0% for visible animation on scroll into view
        const progressFills = document.querySelectorAll('.pixel-progress-fill');
        progressFills.forEach(fill => {
            fill.style.setProperty('--skill-pct', '0%');
        });

        const progressObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const fill = bar.querySelector('.pixel-progress-fill');
                    const targetVal = bar.getAttribute('aria-valuenow') || '85';
                    if (fill) {
                        setTimeout(() => {
                            fill.style.setProperty('--skill-pct', `${targetVal}%`);
                        }, 120);
                    }
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.15 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    // =========================================================
    // 7. TIMELINE XP BARS — Animate on Scroll Into View
    // =========================================================
    const xpBars = document.querySelectorAll('.xp-bar-fill');
    if ('IntersectionObserver' in window && xpBars.length > 0) {
        // Initialize all XP bar fills to 0 width before animation
        xpBars.forEach(bar => {
            bar.style.setProperty('--xp-pct', '0%');
        });

        const xpObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    // Read stored target from inline style attribute
                    const styleAttr = bar.getAttribute('style') || '';
                    const match = styleAttr.match(/--xp-pct:\s*([\d.]+%)/);
                    // Try data-target fallback
                    const target = bar.getAttribute('data-xp') || (match ? match[1] : '80%');

                    // Brief delay so page has rendered
                    setTimeout(() => {
                        bar.style.setProperty('--xp-pct', target);
                    }, 150);

                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.2 });

        xpBars.forEach(bar => {
            // Store target for observer callback
            const styleAttr = bar.getAttribute('style') || '';
            const match = styleAttr.match(/--xp-pct:\s*([\d.]+%)/);
            if (match) {
                bar.setAttribute('data-xp', match[1]);
            }
            xpObserver.observe(bar);
        });
    }

    // =========================================================
    // 6. DYNAMIC FOOTER YEAR
    // =========================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
