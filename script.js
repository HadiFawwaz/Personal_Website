document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: false,
    disable: "mobile", // Disable AOS on mobile for better performance
  });

  // Mobile Navigation
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links li");
  let menuOpen = false;

  // Add index to nav items for staggered animation
  navItems.forEach((item, index) => {
    item.style.setProperty("--item-index", index);
  });

  menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
      menuBtn.classList.add("open");
      navLinks.classList.add("active");
      menuOpen = true;
      document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
    } else {
      menuBtn.classList.remove("open");
      navLinks.classList.remove("active");
      menuOpen = false;
      document.body.style.overflow = ""; // Re-enable scrolling
    }
  });

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("open");
      navLinks.classList.remove("active");
      menuOpen = false;
      document.body.style.overflow = ""; // Re-enable scrolling
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      menuOpen &&
      !e.target.closest(".nav-links") &&
      !e.target.closest(".menu-btn")
    ) {
      menuBtn.classList.remove("open");
      navLinks.classList.remove("active");
      menuOpen = false;
      document.body.style.overflow = ""; // Re-enable scrolling
    }
  });

  // Header scroll effect
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Active nav links on scroll
  const sections = document.querySelectorAll("section");
  const navItemLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + 100; // Add offset for header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navItemLinks.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href").substring(1) === current) {
        item.classList.add("active");
      }
    });
  });

  // Back to top button
  const backToTopButton = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("active");
    } else {
      backToTopButton.classList.remove("active");
    }
  });

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Smooth scrolling for all links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Form submission
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Here you would typically add form submission logic
      alert("Thank you for your message! I will get back to you soon.");
      contactForm.reset();
    });
  }

  // Check if on mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Add touch-friendly interactions for mobile
  if (isMobile) {
    document.body.classList.add("mobile-device");

    // Make portfolio items more touch-friendly
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    portfolioItems.forEach((item) => {
      item.addEventListener(
        "touchstart",
        function () {
          this.classList.add("touch-active");
        },
        { passive: true }
      );
    });

    // Add swipe detection for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      // Detect right swipe to close menu
      if (menuOpen && touchEndX > touchStartX + 50) {
        menuBtn.classList.remove("open");
        navLinks.classList.remove("active");
        menuOpen = false;
        document.body.style.overflow = "";
      }
    }
  }

  // Enhanced portfolio touch interactions for mobile
  if (isMobile) {
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    portfolioItems.forEach((item) => {
      // Add touch start event
      item.addEventListener(
        "touchstart",
        function () {
          // Remove active class from all items
          portfolioItems.forEach((i) => i.classList.remove("touch-active"));
          // Add active class to current item
          this.classList.add("touch-active");
        },
        { passive: true }
      );

      // Add click event for portfolio links to work better on mobile
      const portfolioLink = item.querySelector(".portfolio-link");
      if (portfolioLink) {
        portfolioLink.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent bubbling to parent
        });
      }
    });

    // Remove active class when touching outside portfolio items
    document.addEventListener(
      "touchstart",
      (e) => {
        if (!e.target.closest(".portfolio-item")) {
          portfolioItems.forEach((item) =>
            item.classList.remove("touch-active")
          );
        }
      },
      { passive: true }
    );

    // Improve timeline scrolling on mobile
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (timelineItems.length > 0) {
      // Add intersection observer to animate timeline items when they come into view
      const timelineObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              timelineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      timelineItems.forEach((item) => {
        timelineObserver.observe(item);
      });
    }
  }

  // Add lazy loading for images
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }
});
