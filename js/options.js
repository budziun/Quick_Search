document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-shortcut').querySelector('form');
    const list = document.getElementById('active-shortcuts').querySelector('ul');
//get default shortcuts
/// default shortcuts in background.js
    const loadShortcuts = async () => {
        const data = await chrome.storage.sync.get(['shortcuts', 'disabledShortcuts']);
        const shortcuts = data.shortcuts || defaultShortcuts;
        const disabledShortcuts = data.disabledShortcuts || {};
    // create shortcut list on option page
        list.innerHTML = '';
        Object.entries(shortcuts).forEach(([key, value]) => {
            const li = document.createElement('li');
            const isChecked = !disabledShortcuts[key];
    
            li.innerHTML = `
                
                <span class="shortcut-name">${key}</span> 
                <span class="shortcut-url">${value.default}</span>
                <button class="remove-btn"><img src="../icon/delete.png" id="delete_png"></button>
                <label class="switch">
                    <input type="checkbox" ${isChecked ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                
            `;
    
            // switch event listener
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                chrome.storage.sync.get('disabledShortcuts', (data) => {
                    const disabledShortcuts = data.disabledShortcuts || {};
                    if (checkbox.checked) {
                        delete disabledShortcuts[key]; // on
                    } else {
                        disabledShortcuts[key] = true; // off
                    }
                    chrome.storage.sync.set({ disabledShortcuts });
                });
            });
    
            list.appendChild(li);
        });

        //delete shortcut 
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const shortcutKey = this.closest('li').querySelector('.shortcut-name').textContent.trim();
                chrome.storage.sync.get(['shortcuts'], function (data) {
                    const shortcuts = data.shortcuts;
                    delete shortcuts[shortcutKey];
                    chrome.storage.sync.set({ shortcuts }, function () {
                        console.log(`Shortcut ${shortcutKey} removed.`);
                        location.reload();
                    });
                });
            });
        });
    };
    //add shortcut
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const shortcut = document.getElementById('shortcut').value.trim();
        const url = document.getElementById('url').value.trim();
        if (shortcut && url) {
            chrome.storage.sync.get('shortcuts', (data) => {
                const shortcuts = data.shortcuts || {};
                shortcuts[shortcut] = { default: url };
                chrome.storage.sync.set({ shortcuts }, loadShortcuts);
            });
        }
    });

    loadShortcuts();
});
//github click event
document.getElementById('githubLink').addEventListener('click', () => {
    window.open('https://github.com/budziun', '_blank');
});
//get version via manifest
document.addEventListener("DOMContentLoaded", () => {
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;

    const versionElement = document.getElementById("version");
    if (versionElement) {
        versionElement.textContent = `v${version}`;
    }
});
//mail click event
document.addEventListener("DOMContentLoaded", () => {
    const mailButton = document.getElementById("mail_btn");

    if (mailButton) {
        mailButton.addEventListener("click", () => {
            window.location.href = 'mailto:budziunn@gmail.com?subject=Quick Search Feedback';
        });
    }
});
//restore default shortcuts
document.getElementById("resetDefaults").addEventListener("click", () => {
    const defaultShortcuts = {
        "yt": { "default": "https://www.youtube.com", "search": "https://www.youtube.com/results?search_query={query}" },
        "fb": { "default": "https://www.facebook.com", "search": "https://www.facebook.com/search/top/?q={query}" },
        "hltv": { "default": "https://www.hltv.org", "search": "https://www.hltv.org/search?query={query}" },
        "gh": { "default": "https://github.com", "search": "https://github.com/search?q={query}" },
        "wiki": { "default": "https://en.wikipedia.org", "search": "https://en.wikipedia.org/w/index.php?search={query}" },
        "ig": { "default": "https://www.instagram.com" },
        "amz": { "default": "https://www.amazon.com", "search": "https://www.amazon.com/s?k={query}" },
        "lqd": { "default": "https://liquipedia.net/counterstrike", "search": "https://liquipedia.net/counterstrike/{query}" }
    };

        chrome.storage.sync.set({ shortcuts: defaultShortcuts }, () => {
        alert("Done!");
        location.reload(); 
    });
});