function ensureKeyboardButton() {
    const wordBankDiv = document.querySelector('div[data-test="word-bank"]');
    let keyboardToggleButton = document.querySelector('button[data-test="player-toggle-keyboard"]');

    if (!keyboardToggleButton && wordBankDiv) {
        // Create and insert the simulated "Use keyboard" button if not present
        keyboardToggleButton = document.createElement('button');
        keyboardToggleButton.innerHTML = 'Use keyboard';
        keyboardToggleButton.setAttribute('data-test', 'player-toggle-keyboard');
        keyboardToggleButton.className = '_1eJKW _16r-S _29cJe'; // Add necessary classes
        keyboardToggleButton.addEventListener('click', () => replaceWordBankWithDuolingoTextArea());
        wordBankDiv.before(keyboardToggleButton); // Place it before the word bank div for visibility
    }
}

function createAndClickKeyboardToggleButton(wordBankDiv) {
    // Create a simulated "Use keyboard" button
    const simulatedButton = document.createElement('button');
    simulatedButton.style.display = 'none'; // Hide it since we only need it for its click effect
    simulatedButton.setAttribute('data-test', 'player-toggle-keyboard');
    document.body.appendChild(simulatedButton);

    // Simulate the click to trigger keyboard input
    simulatedButton.addEventListener('click', () => {
        replaceWordBankWithDuolingoTextArea(wordBankDiv);
    });

    simulatedButton.click();
}
function replaceWordBankWithDuolingoTextArea() {
    // Hide the word bank div instead of removing it to preserve its presence in the DOM
    const wordBankDiv = document.querySelector('div[data-test="word-bank"]');
    if (wordBankDiv) {
        wordBankDiv.style.visibility = 'hidden'; // Hide but keep in the layout
        wordBankDiv.style.position = 'absolute'; // Prevent it from taking up space

        // Append the custom text area below the word bank div to maintain page structure
        const textAreaContainerHtml = `<div class="FA030"><textarea data-test="challenge-translate-input" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" class="_2EMUT _1QDX9 st_Fn _2ti2i" data-gramm="false" dir="ltr" lang="en" placeholder="Type in "></textarea></div>`;
        const textAreaContainer = document.createElement('div');
        textAreaContainer.className = "_3GhCe _1zSeg _qg8x";
        textAreaContainer.innerHTML = textAreaContainerHtml;
        wordBankDiv.parentNode.insertBefore(textAreaContainer, wordBankDiv.nextSibling);
    } else {
        console.error('Word bank div not found. Cannot add text area.');
    }
}
// Enhance document-level event listener to prevent Duolingo's shortcuts effectively
document.addEventListener('keydown', function(e) {
    const customInput = document.getElementById('customTextInput');
    if (customInput && document.activeElement === customInput) {
        e.stopImmediatePropagation(); // Ensure other listeners are not triggered
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            customInput.value += e.key; // Append character
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            customInput.value = customInput.value.slice(0, -1); // Handle backspace
        } else if (e.key === 'Enter') {
            e.preventDefault();
            submitCustomInputAnswer(); // Submit the answer when Enter is pressed
        }
    }
}, true);



// Function to submit the answer from the custom input box remains the same

// Observe the DOM for changes and ensure the "Use keyboard" button functionality is present
const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        ensureKeyboardButton();
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial attempt to ensure the "Use keyboard" button functionality is present


function setupCustomInputInterception() {
    // Use event capturing at the document level to intercept keydown events before Duolingo's handlers
    document.addEventListener('keydown', function(e) {
        // Check if the custom text area is focused
        const customInput = document.querySelector('textarea[data-test="challenge-translate-input"]');
        if (document.activeElement === customInput) {
            // Prevent Duolingo's shortcuts
            e.stopImmediatePropagation(); // Stop the event from reaching any other event listener

            // Process the key event for the custom input here, if necessary
            // For example, handling Enter to submit the answer
            console.log(e.key);
            if (e.key === 'Enter') {
                e.preventDefault();
                submitCustomInputAnswer(customInput.value); // Implement this function to submit the answer
            }
            // You can implement additional logic here if needed, such as handling special keys
        }
    }, true); // Use capturing phase to intercept the event early
}
function sanitizeInput(input) {
    // Remove punctuation from the input text and convert to lowercase
    return input.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_?`~()]/g,"").trim();
}

function submitCustomInputAnswer() {
    const inputText = sanitizeInput(document.querySelector('textarea[data-test="challenge-translate-input"]').value);
    const answerWords = inputText.split(' ');

    // Target div where selected words appear
    const targetDiv = document.querySelector('.PcKtj');
    if (!targetDiv) {
        console.error("Target div '.PcKtj' not found.");
        return;
    }

    // Keep track of words that have been processed
    const processedWords = new Set();

    answerWords.forEach(word => {
        // Skip if the word has already been processed or if it's empty
        if (processedWords.has(word) || word === "") return;

        const matchingButton = Array.from(document.querySelectorAll('button[data-test*="challenge-tap-token"]'))
            .find(button => button.textContent.trim().toLowerCase() === word && button.getAttribute('aria-disabled') === 'false');

        
        if (matchingButton) {
            // Check if the button already exists in the target div
            const existingButton = Array.from(targetDiv.querySelectorAll('button[data-test*="challenge-tap-token"]'))
                .find(button => button.textContent.trim().toLowerCase() === word);
            
            // If the button doesn't exist in the target div, append and click it
            if (!existingButton) {
                // Clone the matching button to preserve its state in the word bank
                const clonedButton = matchingButton.cloneNode(true);

                // Prepare a container for the cloned button to simulate Duolingo's selection effect
                const buttonContainer = document.createElement('div');
                buttonContainer.className = '_1yW4j _2LmyT'; // Mimic Duolingo's class for selected words
                buttonContainer.style = '--tap-tokens-token-margin-before: 4px; --tap-tokens-token-margin-after: 4px;';
                const spanWrapper = document.createElement('span');
                spanWrapper.className = '_1deIS';

                spanWrapper.appendChild(clonedButton);
                buttonContainer.appendChild(spanWrapper);

                // Append the cloned button to the target div
                //targetDiv.appendChild(matchingButton)
                matchingButton.click();
            }

            // Simulate a click on the original button to ensure proper functionality
            //matchingButton.click();

            // Mark the word as processed
            processedWords.add(word);
        }
    });
}




// Setup event listeners and MutationObserver as before, ensuring keyboard button is added and textarea input is handled
document.addEventListener('keydown', function(e) {
    const customInput = document.querySelector('textarea[data-test="challenge-translate-input"]');
    if (e.key === 'Enter' && document.activeElement === customInput) {
        e.preventDefault(); // Prevent default Enter key action
        submitCustomInputAnswer(); // Process and submit the custom input answer
    }
}, true);

// Make sure to call this function to set up the event interception

function setupCustomTextAreaListener() {
    // This function will now ensure it is called whenever the textarea becomes available
    // and will correctly handle input events to enable/disable the check button
    const textArea = document.querySelector('textarea[data-test="challenge-translate-input"]');
    if (textArea) {
        textArea.addEventListener('input', function() {
            const checkButton = document.querySelector('button[data-test="player-next"]');
            if (checkButton) {
                if (this.value.trim().length > 0) {
                    // Enable the check button
                    checkButton.classList.remove('_33Jbm');
                    checkButton.setAttribute('aria-disabled', 'false');
                } else {
                    // Disable the check button
                    checkButton.classList.add('_33Jbm');
                    checkButton.setAttribute('aria-disabled', 'true');
                }
            }
        });
    }
}
const enhancedObserver = new MutationObserver(mutations => {
    ensureKeyboardButton(); // Make sure the keyboard button is checked on DOM changes
    setupCustomTextAreaListener(); // Check and set up the text area listener after DOM changes
});
enhancedObserver.observe(document.body, { childList: true, subtree: true });

setupCustomInputInterception();
ensureKeyboardButton();


// Call this function to set up the listener
setupCustomTextAreaListener();

// Continue with your existing logic for adding the keyboard button and replacing the text area
// as well as your observer logic to ensure the setup is reapplied as needed.
