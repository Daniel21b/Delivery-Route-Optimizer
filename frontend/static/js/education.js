document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAccordions();
    initializeCopyButtons();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function initializeAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-btn');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isActive = button.classList.contains('active');
            const content = button.nextElementSibling;
            
            button.classList.toggle('active');
            content.classList.toggle('active');
            
            if (!isActive) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const codeId = button.getAttribute('data-code');
            const codeElement = document.getElementById(codeId);
            
            if (codeElement) {
                const textToCopy = codeElement.textContent;
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = button.textContent;
                    button.textContent = '✅ Copied!';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    button.textContent = '❌ Failed';
                    
                    setTimeout(() => {
                        button.textContent = '📋 Copy';
                    }, 2000);
                });
            }
        });
    });
}
