//get version from manifest and display it in popup
document.addEventListener("DOMContentLoaded", () => {
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;

    const versionElement = document.getElementById("version");
    if (versionElement) {
        versionElement.textContent = `v${version}`;
    }

    const toggleExtension = document.getElementById('toggleExtension');
    const openSettingsButton = document.getElementById('openSettings');

    // get extensionEnabled value from storage
    chrome.storage.sync.get(['extensionEnabled'], function (data) {
        const isEnabled = data.extensionEnabled !== false; // Default to enabled
        toggleExtension.checked = isEnabled;
        if (!isEnabled) {
            openSettingsButton.style.pointerEvents = "none"; // off settings button
            openSettingsButton.style.opacity = "0.5";       //visual off settings button

        } else {
            openSettingsButton.style.pointerEvents = "auto";
            openSettingsButton.style.opacity = "1";
        }
    });

    // swith on/off extension
    toggleExtension.addEventListener('change', function () {
        const isEnabled = toggleExtension.checked;
        chrome.storage.sync.set({ extensionEnabled: isEnabled }, function () {
            console.log(`Extension ${isEnabled ? 'enabled' : 'disabled'}.`);
            if (!isEnabled) {
                openSettingsButton.style.pointerEvents = "none";
                openSettingsButton.style.opacity = "0.5";
            } else {
                openSettingsButton.style.pointerEvents = "auto";
                openSettingsButton.style.opacity = "1";
            }
        });
    });

    // settings button click event
    openSettingsButton.addEventListener('click', () => {
        chrome.storage.sync.get(['extensionEnabled'], function (data) {
            if (data.extensionEnabled !== false) {
                chrome.runtime.openOptionsPage();
            } else {
                console.log("Settings are disabled when the extension is disabled.");
            }
        });
    });
});
//github click event
document.getElementById('githubLink').addEventListener('click', () => {
    window.open('https://github.com/budziun', '_blank');
});