document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('mainNavbar');
    const themeToggle = document.getElementById('theme-toggle');
    const contactBtn = document.getElementById('contact-btn');
    const contactPanel = document.getElementById('contact-panel');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const body = document.body;

    // 1. Sticky Navbar Logic
    const stickyPoint = 50; // Pixels to scroll before navbar becomes sticky

    function handleScroll() {
        if (window.scrollY > stickyPoint) {
            navbar.classList.add('sticky');
            navbar.classList.remove('default-margin');
        } else {
            navbar.classList.remove('sticky');
            if (window.innerWidth > 1024) { // Only add margin on desktop
                navbar.classList.add('default-margin');
            }
        }
    }
    
    // Set initial margin state on load for desktop
    if (window.innerWidth > 1024) {
        navbar.classList.add('default-margin');
    }

    window.addEventListener('scroll', handleScroll);

    // 2. Dark/Light Mode Toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Icon change
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Set initial icon based on default mode (dark-mode is default)
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // 3. Contact Panel Sliding Logic
    contactBtn.addEventListener('click', () => {
        contactPanel.classList.add('open');
    });

    closePanelBtn.addEventListener('click', () => {
        contactPanel.classList.remove('open');
    });

    // Close panel if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === contactPanel) {
            contactPanel.classList.remove('open');
        }
    });
});

   function downloadCV() {
        const link = document.createElement('a');
        link.href = 'khalil ahmad.pdf'; // PDF file ka path
        link.download = 'khalil ahmad.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

const form = document.getElementById('contact-form');
        const formResult = document.getElementById('form-result');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                // Combine country code and phone number into one field for the email
                if (key === 'country_code') {
                    object['full_contact_number'] = value + formData.get('contact_number');
                } else {
                    object[key] = value;
                }
            });

            // We don't need to send the separate country_code and contact_number anymore
            delete object.country_code;
            delete object.contact_number;

            const json = JSON.stringify(object);
            formResult.innerHTML = "Please wait...";
            formResult.style.color = '#555';

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        formResult.innerHTML = json.message;
                        formResult.style.color = 'green';
                    } else {
                        console.log(response);
                        formResult.innerHTML = json.message;
                        formResult.style.color = 'red';
                    }
                })
                .catch(error => {
                    console.log(error);
                    formResult.innerHTML = "Something went wrong! Please try again.";
                    formResult.style.color = 'red';
                })
                .then(function() {
                    form.reset();
                    // Set default country code back to Pakistan after reset
                    document.getElementById('country_code').value = '+92';
                    setTimeout(() => {
                        formResult.innerHTML = '';
                    }, 5000);
                });
        });