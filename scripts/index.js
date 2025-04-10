function copyValue(valueId, notificationId) {
    const value = document.getElementById(valueId).textContent;
    const notification = document.getElementById(notificationId);
    
    navigator.clipboard.writeText(value).then(() => {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

const hebrewMap = {
    'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'I':9, 'J':10,
    'K':10, 'L':20, 'M':30, 'N':40, 'O':50, 'P':60, 'Q':70, 'R':80, 'S':90,
    'T':100, 'U':200, 'V':300, 'W':400, 'X':500, 'Y':600, 'Z':700
};

function calculateGematria(word) {
    const upperWord = word.toUpperCase().replace(/[^A-Z]/g, '');
    let hebrew = 0, english = 0, simple = 0;
    let hebrewBreakdown = [], englishBreakdown = [], simpleBreakdown = [];

    upperWord.split('').forEach(char => {
        const hVal = hebrewMap[char] || 0;
        hebrew += hVal;
        hebrewBreakdown.push(`${char}:${hVal}`);

        const sVal = char.charCodeAt(0) - 64;
        simple += sVal;
        simpleBreakdown.push(`${char}:${sVal}`);

        const eVal = sVal * 6;
        english += eVal;
        englishBreakdown.push(`${char}:${eVal}`);
    });

    return {
        hebrew: {total: hebrew, breakdown: hebrewBreakdown},
        english: {total: english, breakdown: englishBreakdown},
        simple: {total: simple, breakdown: simpleBreakdown}
    };
}

function calculate() {
    const input = document.getElementById('inputText');
    const value = input.value.trim();
    const globalFeedback = document.getElementById('globalFeedback');
    
    if(!value) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 500);
        alert('Please enter some text to calculate!');
        return;
    }

    const loading = document.getElementById('loading');
    loading.style.display = 'flex';
    
    setTimeout(() => {
        try {
            const results = calculateGematria(value);
            
            document.getElementById('hebrewValue').textContent = results.hebrew.total;
            document.getElementById('englishValue').textContent = results.english.total;
            document.getElementById('simpleValue').textContent = results.simple.total;
            
            document.getElementById('hebrewBreakdown').innerHTML = 
                `Calculation: ${results.hebrew.breakdown.join(' + ')}`;
            document.getElementById('englishBreakdown').innerHTML = 
                `Calculation: (${results.simple.breakdown.join(' + ')}) × 6`;
            document.getElementById('simpleBreakdown').innerHTML = 
                `Calculation: ${results.simple.breakdown.join(' + ')}`;

            document.querySelector('.result').style.display = 'block';
            
            // Show calculation success feedback
            globalFeedback.textContent = "✓ Results calculated successfully!";
            globalFeedback.style.display = 'block';
            setTimeout(() => {
                globalFeedback.style.display = 'none';
            }, 3000);

        } catch (error) {
            console.error('Calculation error:', error);
            globalFeedback.textContent = "⚠️ Error calculating results";
            globalFeedback.style.display = 'block';
            setTimeout(() => {
                globalFeedback.style.display = 'none';
            }, 3000);
        } finally {
            loading.style.display = 'none';
        }
    }, 3000);
}

function clearInput() {
    document.getElementById('inputText').value = '';
    document.querySelector('.result').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set single header image
    const headerImage = document.getElementById('themeLogo');
    if (headerImage) {
        headerImage.src = '/assets/header-image.webp';
    }
});

function sendFeedback(emoji) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = "Thanks for your feedback!";
    feedbackMessage.style.display = 'block';
    
    setTimeout(() => {
        feedbackMessage.style.display = 'none';
    }, 2000);
    
    console.log('User feedback:', emoji);
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

function generatePDFContent(input, results) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // PDF Styling
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Gematria Calculator Results', 15, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 27);

    // Input Section with increased spacing
    doc.setFontSize(12);
    doc.text(`Input Text: ${input}`, 15, 45); // Changed from 35 to 45 for more space
    
    // Results Table
    doc.autoTable({
        startY: 50, // Increased from 40 to account for new spacing
        head: [['Type', 'Value', 'Calculation']],
        body: [
            ['Hebrew Gematria', results.hebrew.total, results.hebrew.breakdown.join(' + ')],
            ['English Gematria', results.english.total, `(${results.simple.breakdown.join(' + ')}) × 6`],
            ['Simple Gematria', results.simple.total, results.simple.breakdown.join(' + ')]
        ],
        theme: 'grid',
        styles: {fontSize: 10},
        headStyles: {fillColor: [44, 62, 80]},
        columnStyles: {
            0: {fontStyle: 'bold'},
            1: {cellWidth: 30},
            2: {cellWidth: 120}
        }
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Generated by gematriacalculators.org', 15, doc.lastAutoTable.finalY + 10);
    
    return doc;
}

// Update calculateAndDownload function
function calculateAndDownload() {
    const input = document.getElementById('inputText');
    const value = input.value.trim();
    const globalFeedback = document.getElementById('globalFeedback');
    
    if(!value) {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 500);
        alert('Please enter some text to calculate!');
        return;
    }

    const loading = document.getElementById('loading');
    loading.style.display = 'flex';
    
    setTimeout(() => {
        try {
            const results = calculateGematria(value);
            const doc = generatePDFContent(value, results);
            doc.save(`gematria-result-${value}.pdf`);
            
            // Show global feedback
            globalFeedback.textContent = "✓ PDF downloaded successfully!";
            globalFeedback.style.display = 'block';
            setTimeout(() => {
                globalFeedback.style.display = 'none';
            }, 3000);
            
        } catch (error) {
            console.error('PDF generation failed:', error);
            globalFeedback.textContent = "⚠️ Error generating PDF";
            globalFeedback.style.display = 'block';
            setTimeout(() => {
                globalFeedback.style.display = 'none';
            }, 3000);
        } finally {
            loading.style.display = 'none';
        }
    }, 3000);
}