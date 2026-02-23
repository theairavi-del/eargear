const heroImg = document.querySelector(".hero-img");
const glare = document.querySelector(".glare");
const introScreen = document.getElementById("intro-screen");
const heroSection = document.getElementById("hero");

// SCROLL OBSERVER for EarGear Story
const scrollSteps = document.querySelectorAll(".scroll-step");
const eargearImages = document.querySelectorAll(".eargear-img");

const observerOptions = {
  root: null,
  rootMargin: "-40% 0px -40% 0px", // Trigger when text is centered
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = entry.target.getAttribute("data-index");
      
      // Update text opacity
      scrollSteps.forEach(step => step.classList.remove("active"));
      entry.target.classList.add("active");
      
      // Crossfade the sticky image
      eargearImages.forEach(img => img.classList.remove("active"));
      const targetImg = document.getElementById(`eg-img-${index}`);
      if (targetImg) {
        targetImg.classList.add("active");
      }
    }
  });
}, observerOptions);

scrollSteps.forEach(step => {
  observer.observe(step);
});

// MAIN SCROLL EVENT
window.addEventListener("scroll", () => {
  // Hero section scroll calculation
  const html = document.documentElement;
  const scrollTop = html.scrollTop;
  
  const heroTop = heroSection.offsetTop;
  const heroHeight = heroSection.offsetHeight;
  
  const maxHeroScroll = heroHeight - window.innerHeight;
  let scrollFraction = (scrollTop - heroTop) / maxHeroScroll;
  scrollFraction = Math.max(0, Math.min(1, scrollFraction));
  
  // 1-IMAGE MAGIC MATH
  requestAnimationFrame(() => {
    // Stage 1: Intro Text Fade Out (0% to 20% scroll)
    if (introScreen) {
      const introOpacity = Math.max(0, 1 - (scrollFraction * 5));
      const introY = scrollFraction * 150; // text slightly moves up
      introScreen.style.opacity = introOpacity;
      introScreen.style.transform = `translate(-50%, calc(-50% - ${introY}px))`;
    }

    if (heroImg && glare) {
      // Stage 2: Case appears and light sweeps (20% to 100% scroll)
      let caseProgress = (scrollFraction - 0.2) / 0.8;
      caseProgress = Math.max(0, Math.min(1, caseProgress));

      if (scrollFraction < 0.2) {
        heroImg.style.opacity = 0;
        glare.style.opacity = 0;
      } else {
        // 1. Camera Zoom out
        const scale = 1.3 - (caseProgress * 0.3);
        
        // 2. Camera Blur
        const blur = Math.max(0, 10 - (caseProgress * 20));
        
        // 3. Opacity fade in
        const opacity = Math.min(1, caseProgress * 3); // fades in fast
        
        // Apply transforms
        heroImg.style.transform = `scale(${scale})`;
        heroImg.style.filter = `blur(${blur}px)`;
        heroImg.style.opacity = opacity;
        glare.style.opacity = 1;
        
        // 4. Studio Light Sweep
        const glarePos = -100 + (caseProgress * 200);
        const glareOpacity = Math.max(0, Math.sin(caseProgress * Math.PI) * 0.9);
        
        glare.style.transform = `translateX(${glarePos}%)`;
        glare.style.background = `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, ${glareOpacity}) 48%, rgba(255, 255, 255, ${glareOpacity}) 52%, transparent 60%)`;
      }
    }
  });
});