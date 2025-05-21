function toggleMenu(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Find which heading is currently closest to the top of the viewport
    let currentElement = getCurrentHeadingElement();
    
    let sidebar = document.getElementById("sidebar");
    let article = document.querySelector("article");
    
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        article.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        article.style.marginLeft = "250px";
    }
    
    // After toggling, restore the position of the previously identified element
    setTimeout(() => {
        if (currentElement) {
            currentElement.scrollIntoView({ block: "start" });
        }
    }, 310);
}

function closeMenu(event) {
    if (event) {
        event.preventDefault();
    }
    
    let currentElement = getCurrentHeadingElement();
    
    let sidebar = document.getElementById("sidebar");
    let article = document.querySelector("article");
    
    sidebar.style.width = "0";
    article.style.marginLeft = "0";
    
    setTimeout(() => {
        if (currentElement) {
            currentElement.scrollIntoView({ block: "start" });
        }
    }, 310);
}

function getCurrentHeadingElement() {
    // Get all h2 and h3 elements
    const headings = document.querySelectorAll('h2, h3');
    let closestHeading = null;
    let closestDistance = Infinity;
    
    // Find the heading closest to the top of the viewport
    headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        // Calculate distance from top of viewport (positive values are below viewport top)
        const distance = Math.abs(rect.top);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestHeading = heading;
        }
    });
    
    return closestHeading;
}

function generateMenu() {
    // Create close button first
    let sidebar = document.getElementById("sidebar");
    
    // Clear existing content to avoid duplicates
    sidebar.innerHTML = '';
    
    let closeBtn = document.createElement("a");
    closeBtn.innerHTML = "&times;";
    closeBtn.className = "close-btn";
    closeBtn.href = "#";
    closeBtn.onclick = closeMenu;
    sidebar.appendChild(closeBtn);
    
    // Then add menu items
    let sections = document.querySelectorAll("h2");
    sections.forEach((section, index) => {
        // Add h2 link
        let h2Link = document.createElement("a");
        h2Link.innerText = section.innerText;
        h2Link.href = "#";
        h2Link.onclick = function(event) {
            event.preventDefault();
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        sidebar.appendChild(h2Link);
        
        // Find all h3 elements under this h2
        let nextElement = section.nextElementSibling;
        let h3List = document.createElement("div");
        h3List.className = "h3-list";
        
        while(nextElement && nextElement.tagName !== 'H2') {
            if(nextElement.tagName === 'H3') {
                let h3Link = document.createElement("a");
                h3Link.innerText = "• " + nextElement.innerText;
                h3Link.href = "#";
                h3Link.className = "h3-link";
                h3Link.onclick = function(event) {
                    event.preventDefault();
                    nextElement.scrollIntoView({ behavior: "smooth", block: "start" });
                };
                h3List.appendChild(h3Link);
            }
            nextElement = nextElement.nextElementSibling;
        }
        
        if(h3List.children.length > 0) {
            sidebar.appendChild(h3List);
        }
    });
}

// Initialize sidebar width on page load
document.addEventListener("DOMContentLoaded", function() {
    let sidebar = document.getElementById("sidebar");
    // Ensure sidebar has initial state
    if (!sidebar.style.width) {
        sidebar.style.width = "0";
    }
    generateMenu();
});

// Update URL hash as user scrolls
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("h2, h3");
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5 // When 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
                history.replaceState(null, null, `#${entry.target.id}`);
            }
        });
    }, options);

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
});