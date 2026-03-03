let heartIcon = document.getElementById('heart-icon');
let heartCount = document.getElementById('heart-count');
let counterContainer = document.getElementById('counter-container');
let count = 0;

heartIcon.addEventListener('click', function() {
    count++;
    heartCount.textContent = count;
    counterContainer.style.display = 'block'; 
});





document.addEventListener('DOMContentLoaded', () => {
    const heartIcon = document.getElementById('heart-icon');
    const popup = document.getElementById('popup');
    const heartCountDisplay = document.getElementById('heart-count');
    
    let heartPressCount = 0;
    
    heartIcon.addEventListener('click', () => {
        heartPressCount++; // Increment

        // Update
        heartCountDisplay.textContent = heartPressCount;

        //  flying hearts yayyyy
        for (let i = 0; i < 10; i++) {
            let heart = document.createElement('i');
            heart.classList.add('fa-solid', 'fa-heart', 'heart');
            document.body.appendChild(heart);
    
            // Randomize zeee horizontal position 
            heart.style.left = `${Math.random() * 100}vw`; // Position horizontally anywhere across the screen
            heart.style.animationDelay = `${Math.random() * 2}s`; // Random delay cause more silly more fun 
        }
    
        // Show  popup
        popup.classList.add('show');
    
        
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hide'); 
        }, 3000); // Popup  3 seconds
    });
});






document.addEventListener('DOMContentLoaded', () => {
    const heartIcon = document.getElementById('heart-icon');
    const popup = document.getElementById('popup');
    
    heartIcon.addEventListener('click', () => {
        // flying hearts lol silly sillyy
        for (let i = 0; i < 10; i++) {
            let heart = document.createElement('i');
            heart.classList.add('fa-solid', 'fa-heart', 'heart');
            document.body.appendChild(heart);
    
           
            heart.style.left = `${Math.random() * 100}vw`; 
            heart.style.animationDelay = `${Math.random() * 2}s`; // Random delay for each heart
        }
    
       
        popup.classList.add('show');
    
   
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hide'); 
        }, 3000); // Popup  3 seconds
    });
});


        document.addEventListener('DOMContentLoaded', () => {
            const toggle = document.getElementById('theme-toggle');
            const toggleIcon = document.getElementById('toggle-icon');

     
            const savedTheme = localStorage.getItem('theme') || 'dark';
            
            
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            
            toggleIcon.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

            // Theme toggle
            toggle.addEventListener('click', () => {
                
                const currentTheme = document.documentElement.getAttribute('data-theme');
                
                
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
               
                document.documentElement.setAttribute('data-theme', newTheme);
                
                
                localStorage.setItem('theme', newTheme);
                
                toggleIcon.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            });
        });
    
// Add loading indicator functionality
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Don't show loading for GitHub icons
        if (!this.classList.contains('github-icon')) {
            this.classList.add('loading');
        }
    });
});

// Animate skills list items with delay
document.querySelectorAll('.skills-list li').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Optional: Animate sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.animationPlayState = 'paused';
    observer.observe(section);
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
    