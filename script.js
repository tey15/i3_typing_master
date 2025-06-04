        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show the requested section
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.classList.add('active');
            }

            // Update active navigation link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            // This part might need adjustment if you have different URLs for each section in a multi-page setup.
            // For a single-page app, you'd match the sectionId to the link's text or a data attribute.
            // For now, it's left as is for a single-page demo, but if you go multi-page, this JS will mostly be for showing/hiding on initial load.
        }

        // JavaScript for Typing Test (simplified for demonstration)
        const typingTextElement = document.getElementById('typing-text');
        const typingInputElement = document.getElementById('typing-input');
        const wpmCounter = document.getElementById('wpm-counter');
        const accuracyCounter = document.getElementById('accuracy-counter');
        const timeCounter = document.getElementById('time-counter');
        const errorsCounter = document.getElementById('errors-counter');
        const startButton = document.getElementById('start-btn');
        const resetButton = document.getElementById('reset-btn');
        const newTextButton = document.getElementById('new-text-btn');
        const testDurationSelect = document.getElementById('test-duration');

        let testText = "";
        let timer = null;
        let timeLeft = 60;
        let charactersTyped = 0;
        let correctCharacters = 0;
        let incorrectCharacters = 0;
        let testStarted = false;
        let currentCharacterIndex = 0;

        const easyTexts = [
            "The quick brown fox jumps over the lazy dog.",
            "Never underestimate the power of a good book.",
            "Practice makes perfect in almost everything.",
            "Learning to type faster will save you time.",
            "The sun always shines brightest after the rain."
        ];
        const mediumTexts = [
            "Regular practice with diverse texts will help improve your typing speed and accuracy significantly over time.",
            "Technology has transformed the way we live, work, and communicate, making many tasks more efficient.",
            "The advancement of artificial intelligence is rapidly changing industries across the globe, creating new opportunities.",
            "Effective communication is a crucial skill for success in both personal and professional spheres of life.",
            "The internet provides an unprecedented wealth of information and opportunities for learning and connection."
        ];
        const hardTexts = [
            "The quick brown fox jumps over the lazy dog, exhibiting remarkable agility and grace amidst the vibrant green foliage.",
            "Asynchronous JavaScript and XML, commonly known as AJAX, allows web pages to be updated asynchronously by exchanging small amounts of data with the server behind the scenes.",
            "Pneumonoultramicroscopicsilicovolcanoconiosis is a lung disease caused by the inhalation of very fine silica or quartz dust.",
            "The meticulous craftsmanship evident in historical artifacts often provides invaluable insights into past civilizations' ingenuity and cultural values.",
            "Sphinx of black quartz, judge my vow – this compact pangram is ideal for testing complex key combinations and typing fluidity."
        ];

        function getRandomText(difficulty) {
            let texts;
            if (difficulty === 'easy') {
                texts = easyTexts;
            } else if (difficulty === 'medium') {
                texts = mediumTexts;
            } else { // hard
                texts = hardTexts;
            }
            return texts[Math.floor(Math.random() * texts.length)];
        }

        function generateNewText() {
            const difficulty = document.getElementById('test-difficulty').value;
            testText = getRandomText(difficulty);
            typingTextElement.innerHTML = testText.split('').map((char, index) => {
                return `<span id="char-${index}">${char}</span>`;
            }).join('');
            resetTestStats();
            typingInputElement.value = '';
            typingInputElement.focus();
            typingInputElement.disabled = false;
        }

        function resetTestStats() {
            clearInterval(timer);
            testStarted = false;
            charactersTyped = 0;
            correctCharacters = 0;
            incorrectCharacters = 0;
            currentCharacterIndex = 0;

            timeLeft = parseInt(testDurationSelect.value);
            timeCounter.textContent = timeLeft;
            wpmCounter.textContent = '0';
            accuracyCounter.textContent = '100%';
            errorsCounter.textContent = '0';

            startButton.disabled = false;
            typingInputElement.disabled = true;

            // Reset character styling
            typingTextElement.querySelectorAll('span').forEach(span => {
                span.classList.remove('char-correct', 'char-incorrect', 'char-current');
            });
            if (typingTextElement.children.length > 0) {
                typingTextElement.children[0].classList.add('char-current');
            }
        }

        function startTest() {
            if (testStarted) return;
            testStarted = true;
            startButton.disabled = true;
            typingInputElement.disabled = false;
            typingInputElement.focus();

            timeLeft = parseInt(testDurationSelect.value);
            timeCounter.textContent = timeLeft;

            timer = setInterval(() => {
                timeLeft--;
                timeCounter.textContent = timeLeft;
                if (timeLeft <= 0) {
                    endTest();
                }
            }, 1000);
        }

        function endTest() {
            clearInterval(timer);
            testStarted = false;
            typingInputElement.disabled = true;
            alert(`Test Finished!\nWPM: ${wpmCounter.textContent}\nAccuracy: ${accuracyCounter.textContent}\nErrors: ${errorsCounter.textContent}`);
            // In a real application, you'd save results here and navigate to the results page.
        }

        typingInputElement.addEventListener('input', (e) => {
            if (!testStarted) {
                startTest();
            }

            const typedText = e.target.value;
            const originalChar = testText[currentCharacterIndex];
            const typedChar = typedText[typedText.length - 1]; // Get the last typed character

            if (currentCharacterIndex < testText.length) {
                const charSpan = document.getElementById(`char-${currentCharacterIndex}`);
                if (typedChar === originalChar) {
                    correctCharacters++;
                    charSpan.classList.remove('char-incorrect', 'char-current');
                    charSpan.classList.add('char-correct');
                } else {
                    incorrectCharacters++;
                    charSpan.classList.remove('char-correct', 'char-current');
                    charSpan.classList.add('char-incorrect');
                }
                charactersTyped++;
                currentCharacterIndex++;

                // Move cursor highlight
                if (currentCharacterIndex < testText.length) {
                    document.getElementById(`char-${currentCharacterIndex}`).classList.add('char-current');
                }
            }

            updateStats();

            if (currentCharacterIndex === testText.length) {
                endTest(); // User finished typing the entire text
            }
        });

        function updateStats() {
            const wordsTyped = correctCharacters / 5; // A common approximation for WPM
            const minutes = (parseInt(testDurationSelect.value) - timeLeft) / 60;
            let wpm = (wordsTyped / minutes);
            if (isNaN(wpm) || !isFinite(wpm)) wpm = 0; // Handle division by zero or infinity
            wpmCounter.textContent = Math.max(0, Math.round(wpm));

            const totalTyped = correctCharacters + incorrectCharacters;
            let accuracy = (totalTyped === 0) ? 100 : (correctCharacters / totalTyped) * 100;
            accuracyCounter.textContent = `${Math.round(accuracy)}%`;
            errorsCounter.textContent = incorrectCharacters;
        }

        function resetTest() {
            generateNewText(); // This also calls resetTestStats
        }

        function filterResults(filter) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.filter-btn[onclick="filterResults('${filter}')"]`).classList.add('active');
            // Logic to filter results table goes here
            console.log("Filtering results by: " + filter);
        }

        // Initial setup
        document.addEventListener('DOMContentLoaded', () => {
            generateNewText();
            typingInputElement.disabled = true; // Disable input until test starts
        });