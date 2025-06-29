// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Global Utility Functions ---
    // Helper to smoothly scroll to an element, accounting for fixed navbar
    const scrollToElement = (targetId) => {
        const targetElement = document.querySelector(targetId);
        const navbar = document.querySelector('.navbar');
        if (targetElement && navbar) {
            const offsetTop = targetElement.offsetTop - navbar.offsetHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll & Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link'); // Select only the actual navigation links

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToElement(targetId);
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Center of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const sunIcon = themeToggleBtn ? themeToggleBtn.querySelector('.fa-sun') : null;
    const moonIcon = themeToggleBtn ? themeToggleBtn.querySelector('.fa-moon') : null;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    if (sunIcon && moonIcon) {
        if (savedTheme === 'light') {
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (sunIcon && moonIcon) {
                    sunIcon.style.display = 'inline-block';
                    moonIcon.style.display = 'none';
                }
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (sunIcon && moonIcon) {
                    sunIcon.style.display = 'none';
                    moonIcon.style.display = 'inline-block';
                }
            }
        });
    }

    // --- Typed.js for Hero Section ---
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        new Typed('#typed-text', {
            strings: ["A System Support Engineer", "A DevOps Enthusiast", "A Cloud Practitioner", "Tharindu Lakshan"],
            typeSpeed: 70,
            backSpeed: 30,
            loop: true,
            showCursor: false,
        });
    }

    // --- Dynamic Current Year for Footer ---
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Section Reveal Animation on Scroll ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Experience Section Timeline Animation (Staggered Entry) ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay based on the index (or just a fixed delay)
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 150); // 150ms delay per item
                observer.unobserve(entry.target);
            }
        });
    }, timelineObserverOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // --- Skill Bar Animation on Reveal (with hover percentage) ---
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target.querySelector('.skill-bar');
                const skillLevel = skillBar.dataset.skillLevel;
                entry.target.classList.add('active');
                skillBar.style.setProperty('--skill-level', skillLevel + '%'); // Use CSS custom property
                observer.unobserve(entry.target);
            }
        });
    }, skillObserverOptions);

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });

    // --- CV Modal Functionality (Popup for CV images with single-click zoom) ---
    const cvThumbnails = document.querySelectorAll('.cv-thumbnail');
    const cvModal = document.getElementById('cv-modal');
    const cvModalImage = document.getElementById('cv-modal-image');
    const cvModalClose = document.querySelector('.cv-modal-close');

    if (cvModal && cvModalImage && cvModalClose) {
        cvThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                cvModal.style.display = 'flex';
                cvModalImage.src = thumbnail.dataset.fullSrc;
                cvModalImage.alt = thumbnail.alt; // Set alt text for accessibility
                cvModalImage.classList.remove('zoomed'); // Reset zoom state
                cvModalImage.style.transform = 'scale(1)'; // Reset zoom level
            });
        });

        cvModalClose.addEventListener('click', () => {
            cvModal.style.display = 'none';
        });

        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.style.display = 'none';
            }
        });

        // Single-click to zoom in/out
        cvModalImage.addEventListener('click', () => {
            if (cvModalImage.classList.contains('zoomed')) {
                cvModalImage.classList.remove('zoomed');
                cvModalImage.style.transform = 'scale(1)';
            } else {
                cvModalImage.classList.add('zoomed');
                cvModalImage.style.transform = 'scale(1.5)';
            }
        });
    }

    // --- Gallery Carousel ---
    const carouselTrack = document.querySelector('.gallery-carousel-track');
    const carouselSlides = document.querySelectorAll('.gallery-slide');
    const prevButton = document.querySelector('.carousel-button.prev-button');
    const nextButton = document.querySelector('.carousel-button.next-button');
    const galleryDotsContainer = document.querySelector('.gallery-dots');
    const galleryLabel = document.getElementById('gallery-label');

    let currentSlideIndex = 0;
    let slideWidth = carouselSlides.length > 0 ? carouselSlides[0].clientWidth : 0; // Initial value

    const setSlideWidth = () => {
        if (carouselSlides.length > 0) {
            slideWidth = carouselSlides[0].clientWidth;
            // Temporarily disable transition for instant repositioning
            carouselTrack.style.transition = 'none';
            carouselTrack.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
            setTimeout(() => {
                carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
    };

    window.addEventListener('resize', setSlideWidth); // Recalculate on resize

    if (carouselTrack && carouselSlides.length > 0 && prevButton && nextButton && galleryDotsContainer && galleryLabel) {
        // Create dots
        carouselSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            galleryDotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll('.gallery-dots .dot');

        const updateLabel = () => {
            galleryLabel.classList.remove('fade-in');
            galleryLabel.classList.add('fade-out');
            setTimeout(() => {
                galleryLabel.textContent = carouselSlides[currentSlideIndex].dataset.label || `Image ${currentSlideIndex + 1} of ${carouselSlides.length}`;
                galleryLabel.classList.remove('fade-out');
                galleryLabel.classList.add('fade-in');
            }, 300); // Match CSS transition duration
        };

        const moveToSlide = (index) => {
            if (index < 0) {
                currentSlideIndex = carouselSlides.length - 1;
            } else if (index >= carouselSlides.length) {
                currentSlideIndex = 0;
            }
            else {
                currentSlideIndex = index;
            }
            carouselTrack.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;

            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlideIndex].classList.add('active');
            updateLabel();
        };

        // Initialize label and width
        setSlideWidth(); // Call once initially
        updateLabel(); // Set initial label

        prevButton.addEventListener('click', () => moveToSlide(currentSlideIndex - 1));
        nextButton.addEventListener('click', () => moveToSlide(currentSlideIndex + 1));

        let autoPlayInterval;
        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                moveToSlide(currentSlideIndex + 1);
            }, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        startAutoPlay();

        carouselTrack.addEventListener('mouseenter', stopAutoPlay);
        carouselTrack.addEventListener('mouseleave', startAutoPlay);
        prevButton.addEventListener('mouseenter', stopAutoPlay);
        nextButton.addEventListener('mouseenter', stopAutoPlay);
        prevButton.addEventListener('mouseleave', startAutoPlay);
        nextButton.addEventListener('mouseleave', startAutoPlay);
    }

    // --- Contact Form Submission (Formspree) ---
    const contactForm = document.getElementById('contactForm');
    const submitFormBtn = document.getElementById('submit-form-btn');
    const formStatusMessage = document.getElementById('form-status-message');

    if (contactForm && submitFormBtn && formStatusMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitFormBtn.disabled = true;
            submitFormBtn.textContent = 'Sending...';
            formStatusMessage.classList.remove('success', 'error');
            formStatusMessage.style.opacity = 0;

            const formData = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatusMessage.textContent = 'Message sent successfully!';
                    formStatusMessage.classList.add('success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        formStatusMessage.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatusMessage.textContent = 'Failed to send message. Please try again.';
                    }
                    formStatusMessage.classList.add('error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatusMessage.textContent = 'An error occurred. Please try again later.';
                formStatusMessage.classList.add('error');
            } finally {
                submitFormBtn.disabled = false;
                submitFormBtn.textContent = 'Send Message';
                formStatusMessage.style.opacity = 1;
                formStatusMessage.style.transform = 'translateY(0)';
                setTimeout(() => {
                    formStatusMessage.style.opacity = 0;
                    formStatusMessage.style.transform = 'translateY(10px)';
                }, 5000);
            }
        });
    }

    // --- Copy to Clipboard Functionality ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const targetId = e.currentTarget.dataset.copyTarget;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const textToCopy = targetElement.textContent.trim();
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy'); // For better iframe compatibility
                    document.body.removeChild(textarea);

                    const originalIcon = e.currentTarget.innerHTML;
                    e.currentTarget.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        e.currentTarget.innerHTML = originalIcon;
                    }, 1500);
                    console.log('Text copied:', textToCopy);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            }
        });
    });

    // --- Chatbot Functionality ---
    const chatbotToggleBtn = document.querySelector('.chatbot-toggle-btn');
    const chatbotModal = document.querySelector('.chatbot-modal');
    const chatbotCloseBtn = document.querySelector('.chatbot-modal .modal-close');
    const chatbotBody = document.querySelector('.chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn'); // New clear chat button

    let chatHistory = []; // Stores objects: { sender: 'user'/'bot', message: 'text' }

    if (chatbotToggleBtn && chatbotModal && chatbotCloseBtn && chatbotBody && chatbotInput && chatbotSendBtn && clearChatBtn) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotModal.style.display = chatbotModal.style.display === 'flex' ? 'none' : 'flex';
            if (chatbotModal.style.display === 'flex') {
                chatbotInput.focus();
                scrollToBottom();
            }
        });

        chatbotCloseBtn.addEventListener('click', () => {
            chatbotModal.style.display = 'none';
        });

        clearChatBtn.addEventListener('click', () => {
            chatbotBody.innerHTML = `
                <div class="chat-message bot-message">
                    Hi there! I'm Tharindu's automated assistant. How can I help you today?
                </div>
            `;
            chatHistory = []; // Reset chat history
            scrollToBottom();
        });

        const scrollToBottom = () => {
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        };

        const appendMessage = (sender, text) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message');
            messageDiv.classList.add(sender + '-message');
            messageDiv.innerHTML = text; // Use innerHTML to allow for formatting
            chatbotBody.appendChild(messageDiv);
            chatHistory.push({ sender, message: text }); // Store message in history
            scrollToBottom();
        };

        // Advanced Chatbot Response Logic (Enhanced with basic memory)
        const getChatbotResponse = (message, history) => {
            message = message.toLowerCase().trim();
            const lastUserMessage = history.length > 0 ? history.filter(m => m.sender === 'user').pop()?.message.toLowerCase() : '';

            // --- Contextual Responses based on last message ---
            if (lastUserMessage.includes('experience') && (message.includes('where') || message.includes('company') || message.includes('who'))) {
                return "Tharindu's most recent experience is as a **System Support Engineer at EPIC Lanka (Pvt) Ltd.**, a role he's held since June 2023. Before that, he was an IT Intern at ABC Solutions.";
            }
            if (lastUserMessage.includes('skills') && (message.includes('programming') || message.includes('languages'))) {
                return "In terms of programming and scripting, Tharindu is proficient in **Shell Scripting, Python, and JavaScript.** These skills are crucial for automation and web development.";
            }
            if (lastUserMessage.includes('projects') && (message.includes('latest') || message.includes('recent') || message.includes('newest'))) {
                return "His most recent significant projects include the **Aqua Sync-Tech Smart Water Meter** (an IoT-based system) and his **Final Year Research Project - AgrySense360** (predictive analytics for crop yield).";
            }
            if (lastUserMessage.includes('contact') && (message.includes('how') || message.includes('best way'))) {
                return "The best way to contact Tharindu is via **email at tharindulakshan@example.com** or through the <a href='#contact' onclick='window.sendSuggestedMessage(\"how can I contact Tharindu?\")'>Contact Form</a> directly on the website. He's also active on LinkedIn!";
            }

            // --- General Responses ---//
            if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greetings')) {
                return "Hello there! How can I assist you with Tharindu's professional portfolio today? Feel free to ask about his background, projects, or how to connect. I'm here to help!";
            } else if (message.includes('experience') || message.includes('work history') || message.includes('jobs') || message.includes('past work') || message.includes('employment') || message.includes('career')) {
                return "Tharindu is currently a **Associate System Support Engineer at EPIC Lanka (Pvt) Ltd. (March 2025 - Present)**, where he focuses on critical e-Government systems, automation, and database optimization. Prior to this, he gained valuable insights as an ** Intern System Engineer at Epic Lanka (Pvt) Ltd (April 2024 – March 2025)**. You can delve deeper into his professional journey in the <a href='#experience' onclick='window.sendSuggestedMessage(\"show experience section\")'>Experience section</a> on his website.";
            } else if (message.includes('skills') || message.includes('expertise') || message.includes('technical skills') || message.includes('what are your skills') || message.includes('proficient in')) {
                return "Tharindu's core technical expertise includes:<ul><li>**Operating Systems:** Linux (RHEL, Ubuntu), Windows Server</li><li>**DevOps Tools:** Docker, Kubernetes, Jenkins, Ansible, Git</li><li>**Cloud Platforms:** AWS, Microsoft Azure</li><li>**Databases:** MySQL, PostgreSQL, Oracle 12c</li><li>**Scripting & Programming:** Shell Scripting, Python, JavaScript</li><li>**Networking:** TCP/IP, DNS, VPN, Firewalls</li></ul>Visit the <a href='#skills' onclick='window.sendSuggestedMessage(\"show skills section\")'>Skills section</a> for a visual breakdown of his proficiency levels!";
            } else if (message.includes('projects') || message.includes('work examples') || message.includes('show me projects') || message.includes('portfolio') || message.includes('what have you built')) {
                return "Tharindu has worked on diverse and impactful projects such as:<ul><li>NFV Demonstration with Socket Programming in C</li><li>Samba Active Directory Deployment</li><li>Oracle 12c Cloud-Based DB Setup</li><li>CI/CD Pipeline Automation for Microservices</li><li>High Availability with ProxySQL</li><li>The innovative **Aqua Sync-Tech Smart Water Meter** IoT project</li><li>His final year research: **AgrySense360** (Predictive Analytics for Yield Optimization)</li></ul>Explore the <a href='#projects' onclick='window.sendSuggestedMessage(\"show projects section\")'>Projects section</a> for more details and links to his work!";
            } else if (message.includes('contact') || message.includes('reach out') || message.includes('how to contact') || message.includes('email') || message.includes('phone') || message.includes('get in touch')) {
                return "You can easily connect with Tharindu! His email is **tlakshan@gmail.com** and his phone number is **+94 70 466 1700**. You can also find direct links to his LinkedIn, GitHub, and Twitter profiles in the <a href='#contact' onclick='window.sendSuggestedMessage(\"show contact section\")'>Contact section</a>. Feel free to send him a message directly via the contact form there!";
            } else if (message.includes('cv') || message.includes('resume') || message.includes('download cv') || message.includes('curriculum vitae') || message.includes('can i get a copy of your cv')) {
                return "Yes, Tharindu's CV is readily available! You can view it page-by-page directly in the <a href='#cv' onclick='window.sendSuggestedMessage(\"show cv section\")'>CV section</a> by clicking on the image thumbnails. For your convenience, there's also a 'Download Full CV (PDF)' button to save a copy for your records.";
            } else if (message.includes('thank you') || message.includes('thanks') || message.includes('ty') || message.includes('cheers')) {
                return "You're most welcome! I'm glad I could assist. Is there anything else you'd like to know about Tharindu or his work, or perhaps explore other sections of his portfolio?";
            } else if (message.includes('name') || message.includes('who are you') || message.includes('your name')) {
                return "I am Tharindu's automated portfolio assistant, designed to help you quickly find information about his professional background and projects. I don't have a personal name or identity beyond this function.";
            } else if (message.includes('what do you do') || message.includes('your purpose')) {
                return "My purpose is to make your visit to Tharindu's portfolio as informative and engaging as possible! I can answer questions about his experience, skills, projects, services, achievements, and how to contact him. Just ask, or use the quick suggestion buttons!";
            } else if (message.includes('education') || message.includes('university') || message.includes('qualifications') || message.includes('sliit') || message.includes('degree')) {
                return "Tharindu is a final year **Computer Systems & Network Engineering Undergraduate at SLIIT (Sri Lanka Institute of Information Technology)**. His strong academic foundation complements his practical industry experience, making him a well-rounded IT professional.";
            } else if (message.includes('hobbies') || message.includes('interests') || message.includes('personal life') || message.includes('outside work')) {
                return "While my knowledge is focused on Tharindu's professional life and technical expertise, I can tell you he is passionate about continuous learning, especially in cutting-edge technologies, automation, and collaborative tech projects! He's always eager to expand his knowledge and contribute to innovative solutions.";
            } else if (message.includes('services') || message.includes('what can you do for me') || message.includes('what do you offer') || message.includes('your offerings') || message.includes('hire')) {
                return "Tharindu offers a comprehensive range of professional services, including: <ul><li>**Cloud Infrastructure** design and deployment (AWS, Azure)</li><li>**CI/CD Automation** implementation and optimization</li><li>**System Security** hardening and best practices</li><li>**Database Management** and performance tuning</li><li>Specialized **DevOps Consulting**</li><li>Comprehensive **Monitoring & Logging** solutions</li></ul>Find more details on how he can contribute to your projects in the new <a href='#services' onclick='window.sendSuggestedMessage(\"What services do you offer?\")'>Services section</a>.";
            } else if (message.includes('achievements') || message.includes('certifications') || message.includes('awards') || message.includes('accomplishments') || message.includes('show me your achievements')) {
                return "Tharindu has achieved significant milestones and holds valuable certifications, including: <ul><li>An **Introduction to DevOps** certificate from Coursera</li><li>**AWS Certified Cloud Practitioner** certification</li><li>A **Certified Linux Administrator** certification from the Linux Foundation</li></ul>You can explore more about his accomplishments and verified credentials in the <a href='#achievements' onclick='window.sendSuggestedMessage(\"show achievements section\")'>Achievements & Certifications section</a> on his website.";
            } else if (message.includes('gallery') || message.includes('photos') || message.includes('images') || message.includes('visuals')) {
                return "The <a href='#gallery' onclick='window.sendSuggestedMessage(\"show gallery section\")'>Gallery section</a> provides a visual journey into Tharindu's professional world. It features an auto-moving image carousel showcasing various aspects of his work environment and professional experiences. It's a great way to see him in action!";
            } else if (message.includes('testimonials') || message.includes('reviews') || message.includes('feedback') || message.includes('what do others say')) {
                return "Curious about Tharindu's professional reputation? Read what his colleagues and project managers have to say about his dedication, problem-solving abilities, and contributions in the <a href='#testimonials' onclick='window.sendSuggestedMessage(\"show testimonials section\")'>Testimonials section</a>. Their feedback speaks volumes about his work ethic!";
            } else if (message.includes('showcase') || message.includes('interactive') || message.includes('3d') || message.includes('model') || message.includes('alignment')) {
                return "The <a href='#interactive-showcase' onclick='window.sendSuggestedMessage(\"show interactive showcase section\")'>Skill & Experience Alignment section</a> is a dynamic area where you can see how Tharindu's core skills are applied in his professional experiences and projects. It provides a clearer picture of his practical expertise beyond just a list of abilities.";
            } else if (message.includes('website') || message.includes('how was this built') || message.includes('tech stack') || message.includes('technologies used')) {
                return "This website is built with modern web technologies: HTML5 for structure, CSS3 for advanced styling and animations, and JavaScript for all interactive elements and dynamic content. It also integrates Firebase for authentication and analytics (view counts) and Formspree for contact form submissions. The particle effects in the hero section are powered by Three.js!";
            } else if (message.includes('final year project') || message.includes('agrysense360') || message.includes('fyp')) {
                return "Tharindu's final year research project is called **AgrySense360**. It focuses on **Predictive Analytics for Yield Optimization**, aiming to forecast crop yields, optimize planting schedules, and enhance agricultural productivity. You can find a link to its details in the <a href='#projects' onclick='window.sendSuggestedMessage(\"show projects section\")'>Projects section</a>.";
            } else if (message.includes('linux') || message.includes('linux administration')) {
                return "Tharindu has extensive experience with Linux, particularly **RHEL (Red Hat Enterprise Linux) and Ubuntu**. He is a **Certified Linux Administrator** and uses Linux daily for system provisioning, automation, and managing servers. Many of his projects involve Linux as the foundational operating system.";
            } else if (message.includes('devops') || message.includes('ci/cd') || message.includes('automation')) {
                return "DevOps is one of Tharindu's key passions. He has hands-on experience with tools like **Docker, Kubernetes, Jenkins, and Ansible** to automate CI/CD pipelines, ensuring rapid and reliable software delivery. He also focuses on infrastructure automation and monitoring for production environments.";
            } else if (message.includes('cloud') || message.includes('aws') || message.includes('azure')) {
                return "Tharindu is proficient in major cloud platforms including **AWS (Amazon Web Services) and Microsoft Azure**. He has experience deploying and managing cloud solutions, setting up cloud databases, and understanding cloud infrastructure concepts. He is also **AWS Certified Cloud Practitioner**.";
            } else if (message.includes('databases') || message.includes('mysql') || message.includes('postgresql') || message.includes('oracle')) {
                return "Tharindu works with various databases including **MySQL, PostgreSQL, and Oracle 12c**. His expertise includes deployment, optimization, high availability setups (like Percona XtraDB Cluster and ProxySQL), and general database management for critical applications.";
            } else if (message.includes('security') || message.includes('firewall') || message.includes('system hardening')) {
                return "System security is a key area for Tharindu. He has experience in **hardening Linux systems, implementing firewalls, ensuring data integrity, and managing access control** to build secure IT environments.";
            } else if (message.includes('networking') || message.includes('tcp/ip') || message.includes('dns') || message.includes('vpn')) {
                return "Tharindu's networking skills cover core concepts like **TCP/IP, DNS, VPNs, and Firewalls**. He has experience in designing and simulating network layouts for various environments, as seen in his 'Hospital Network Simulation' project.";
            } else {
                return "I'm sorry, I couldn't fully understand your request. My knowledge base is focused on Tharindu's professional profile. I can help with topics like **Experience, Skills, Projects, Services, CV, Contact, Achievements, Education, Gallery, Testimonials,** or the **Skill & Experience Alignment** section. Please try rephrasing your question or selecting one of the suggestion buttons above!";
            }
        };

        const sendMessage = async (suggestedText = null) => {
            const messageText = suggestedText || chatbotInput.value.trim();
            if (messageText === '') return;

            appendMessage('user', messageText);
            chatbotInput.value = '';
            chatbotSendBtn.disabled = true;
            chatbotInput.placeholder = 'Thinking...';

            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('chat-message', 'bot-message', 'loading');
            loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            chatbotBody.appendChild(loadingDiv);
            scrollToBottom();

            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // 1-2 second random delay

            if (chatbotBody.contains(loadingDiv)) {
                chatbotBody.removeChild(loadingDiv);
            }

            const botMessage = getChatbotResponse(messageText, chatHistory); // Pass chat history for context
            appendMessage('bot', botMessage);

            chatbotSendBtn.disabled = false;
            chatbotInput.placeholder = 'Type your message...';
            chatbotInput.focus();
        };

        window.sendSuggestedMessage = (text) => {
            chatbotInput.value = text;
            sendMessage(text);
        };

        chatbotSendBtn.addEventListener('click', () => sendMessage());
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // --- Scroll-to-top button ---
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Three.js Particle Background for Hero Section ---
    const heroCanvas = document.getElementById('hero-background-canvas');
    if (heroCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Particle geometry and material
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2500; // More particles
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 150; // Wider spread
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.1, // Slightly larger particles
            color: 0x00ffff, // Cyan
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: false // No per-vertex colors for now
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 50; // Camera further back to see more particles

        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        const animateParticles = () => {
            requestAnimationFrame(animateParticles);

            particlesMesh.rotation.x += 0.0001; // Slower rotation
            particlesMesh.rotation.y += 0.0002;

            // Subtle camera movement based on mouse
            camera.position.x += (mouseX * 0.001 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 0.001 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animateParticles();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- Authentication Modal and Logic ---
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authModalClose = document.querySelector('.auth-modal-close');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorMessage = document.getElementById('login-error-message');

    const signupEmailInput = document.getElementById('signup-email');
    const signupPasswordInput = document.getElementById('signup-password');
    const signupConfirmPasswordInput = document.getElementById('signup-confirm-password');
    const signupErrorMessage = document.getElementById('signup-error-message');

    // Display error/success message helper
    const showAuthMessage = (element, message, type = 'error') => {
        element.textContent = message;
        element.classList.remove('error', 'success'); // Clear previous types
        element.classList.add(type, 'show'); // Add new type and show
        setTimeout(() => {
            element.classList.remove('show');
            element.textContent = '';
        }, 5000); // Hide after 5 seconds
    };

    // Open/Close Modal
    if (loginBtn && authModal && authModalClose) {
        loginBtn.addEventListener('click', () => {
            authModal.style.display = 'flex';
            loginForm.style.display = 'flex'; // Show login form by default
            signupForm.style.display = 'none';
            // Clear any lingering messages
            loginErrorMessage.classList.remove('show', 'success', 'error');
            signupErrorMessage.classList.remove('show', 'success', 'error');
            loginEmailInput.value = ''; // Clear fields
            loginPasswordInput.value = '';
            signupEmailInput.value = '';
            signupPasswordInput.value = '';
            signupConfirmPasswordInput.value = '';
        });

        authModalClose.addEventListener('click', () => {
            authModal.style.display = 'none';
        });

        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });
    }

    // Toggle between login and signup forms
    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
            // Clear errors on form switch
            loginErrorMessage.classList.remove('show', 'success', 'error');
            signupErrorMessage.classList.remove('show', 'success', 'error');
            signupEmailInput.value = ''; // Clear fields
            signupPasswordInput.value = '';
            signupConfirmPasswordInput.value = '';
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'flex';
            // Clear errors on form switch
            loginErrorMessage.classList.remove('show', 'success', 'error');
            signupErrorMessage.classList.remove('show', 'success', 'error');
            loginEmailInput.value = ''; // Clear fields
            loginPasswordInput.value = '';
        });
    }

    // Handle Signup
    if (signupForm && signupEmailInput && signupPasswordInput && signupConfirmPasswordInput) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupEmailInput.value;
            const password = signupPasswordInput.value;
            const confirmPassword = signupConfirmPasswordInput.value;

            if (password !== confirmPassword) {
                showAuthMessage(signupErrorMessage, 'Passwords do not match.', 'error');
                return;
            }
            if (password.length < 6) {
                showAuthMessage(signupErrorMessage, 'Password must be at least 6 characters long.', 'error');
                return;
            }

            try {
                // firebaseAuth is exposed globally from the module script in index.html
                await window.firebaseAuth.createUserWithEmailAndPassword(window.firebaseAuth.auth, email, password);
                showAuthMessage(signupErrorMessage, 'Account created successfully! You are now logged in.', 'success');
                // Don't close modal immediately, allow user to see success message
                setTimeout(() => {
                    authModal.style.display = 'none';
                }, 1500);
            } catch (error) {
                console.error("Signup error:", error);
                let errorMessage = 'Signup failed. Please try again.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'This email is already in use. Try logging in.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Password is too weak. Choose a stronger one.';
                }
                showAuthMessage(signupErrorMessage, errorMessage, 'error');
            }
        });
    }

    // Handle Login
    if (loginForm && loginEmailInput && loginPasswordInput) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginEmailInput.value;
            const password = loginPasswordInput.value;

            try {
                await window.firebaseAuth.signInWithEmailAndPassword(window.firebaseAuth.auth, email, password);
                showAuthMessage(loginErrorMessage, 'Logged in successfully!', 'success');
                // Don't close modal immediately, allow user to see success message
                setTimeout(() => {
                    authModal.style.display = 'none';
                }, 1500);
            } catch (error) {
                console.error("Login error:", error);
                let errorMessage = 'Login failed. Please check your email and password.';
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Invalid email or password.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Invalid email address.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many failed login attempts. Please try again later.';
                }
                showAuthMessage(loginErrorMessage, errorMessage, 'error');
            }
        });
    }

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await window.firebaseAuth.signOut(window.firebaseAuth.auth);
                console.log("User logged out successfully.");
                // UI will update via onAuthStateChanged listener
                // The analytics will switch back to logging anonymous user data
                // Optional: show a temporary success message somewhere on the main page
            } catch (error) {
                console.error("Logout error:", error);
                // For a more robust app, use a custom modal instead of alert
                alert("Failed to log out. Please try again."); 
            }
        });
    }
});
