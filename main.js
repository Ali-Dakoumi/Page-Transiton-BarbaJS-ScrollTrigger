gsap.registerPlugin(ScrollTrigger);
let sections = gsap.utils.toArray(".panel");

// Smoooth Scrollbar
// Setup
const scroller = document.querySelector(".scroller");

const bodyScrollBar = Scrollbar.init(scroller, {
  damping: 0.1,
  delegateTo: document,
  alwaysShowTracks: true,
});

// use the scroller proxy to be able to use a third party library like smoothscroll bar
ScrollTrigger.scrollerProxy(".scroller", {
  scrollTop(value) {
    if (arguments.length) {
      bodyScrollBar.scrollTop = value;
    }
    return bodyScrollBar.scrollTop;
  },
});

// we update the scrollbar everytime the page load
function updateScroll(params) {
  bodyScrollBar.update();
  bodyScrollBar.scrollTo(0, 0);
  bodyScrollBar.addListener(ScrollTrigger.update);
  ScrollTrigger.defaults({ scroller: scroller });
}
updateScroll();

// Services page animation
function servicesAnimation() {
  let sections = gsap.utils.toArray(".panel");
  let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none", // <-- IMPORTANT!
    scrollTrigger: {
      trigger: ".container",
      pin: true,
      scrub: 0.1,
      //snap: directionalSnap(1 / (sections.length - 1)),
      end: "+=3000",
    },
  });

  gsap.set(".box-1, .box-2", { y: 100 });
  ScrollTrigger.defaults({
    markers: { startColor: "white", endColor: "white" },
  });

  // red section
  gsap.to(".box-1", {
    y: -130,
    duration: 2,
    ease: "elastic",
    scrollTrigger: {
      trigger: ".box-1",
      containerAnimation: scrollTween,
      start: "left center",
      toggleActions: "play none none reset",
      id: "1",
    },
  });

  // gray section
  gsap.to(".box-2", {
    y: -120,
    backgroundColor: "#1e90ff",
    ease: "none",
    scrollTrigger: {
      trigger: ".box-2",
      containerAnimation: scrollTween,
      start: "center 80%",
      end: "center 20%",
      scrub: true,
      id: "2",
    },
  });

  // purple section
  ScrollTrigger.create({
    trigger: ".box-3",
    containerAnimation: scrollTween,
    toggleClass: "active",
    start: "center 60%",
    id: "3",
  });

  // green section
  ScrollTrigger.create({
    trigger: ".green",
    containerAnimation: scrollTween,
    start: "center 65%",
    end: "center 51%",
    onEnter: () => console.log("enter"),
    onLeave: () => console.log("leave"),
    onEnterBack: () => console.log("enterBack"),
    onLeaveBack: () => console.log("leaveBack"),
    onToggle: (self) => console.log("active", self.isActive),
    id: "4",
  });

  // only show the relevant section's markers at any given time
  gsap.set(
    ".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end",
    { autoAlpha: 0 }
  );
  ["reda", "gray", "purple", "green"].forEach((triggerClass, i) => {
    ScrollTrigger.create({
      trigger: "." + triggerClass,
      containerAnimation: scrollTween,
      start: "left 30%",
      end: i === 3 ? "right right" : "right 30%",
      markers: false,
      onToggle: (self) =>
        gsap.to(".marker-" + (i + 1), {
          duration: 0.25,
          autoAlpha: self.isActive ? 1 : 0,
        }),
    });
  });
}
// home and about page animation
function animation() {
  const tl = gsap.timeline({});
  gsap.to("section.grey .text", {
    rotation: 360,
    scrollTrigger: {
      trigger: "section.grey",
      start: "top top",
      end: () => "+=" + innerHeight,
      pin: true,
      scrub: true,
      markers: true,
    },
  });
  gsap.to("section.red .text", {
    rotation: 360,
    scrollTrigger: {
      trigger: "section.red",
      start: "top top",
      end: () => "+=" + innerHeight,
      scrub: true,
      markers: true,
      pin: true,
    },
  });
  gsap.from("section.blue .text", {
    x: 300,
    opacity: 0,
    lazy: false, // the .from tween of gsap had some issues in the last release, thie boolean will fix that
    scrollTrigger: {
      trigger: "section.blue",
      start: "top 50%",
      toggleActions: "play none none reset",
    },
  });
  gsap.to("section.cyan .text", {
    rotation: 360,
    scrollTrigger: {
      trigger: "section.cyan",
      start: "top top",
      end: () => "+=" + innerHeight,
      pin: true,
      scrub: true,
      markers: true,
    },
  });
}

// Only necessary to correct marker position - not needed in production
function markersPosition() {
  if (document.querySelector(".gsap-marker-scroller-start")) {
    const markers = gsap.utils.toArray('[class *= "gsap-marker"]');

    bodyScrollBar.addListener(({ offset }) => {
      gsap.set(markers, { marginTop: -offset.y });
    });
  }
}
markersPosition();

// it is necessary to kill all the triggers before entering the new page
barba.hooks.leave(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
barba.hooks.after(() => {});

barba.init({
  // debug: true,
  transitions: [
    {
      name: "general-transition",
      once: ({ next }) => {
        gsap.to(next.container, 1, {
          autoAlpha: 1,
          onComplete: () => {
            // we should load everything after the new page is already entered
            animation();
            servicesAnimation();
            markersPosition();
          },
        });
      },
      leave: ({ current }) => {
        return gsap.to(current.container, 1, {
          autoAlpha: 0,
          onComplete: () => {
            updateScroll();
          },
        });
      },
      enter({ next }) {
        gsap.to(next.container, 1, {
          autoAlpha: 1,
          onComplete: () => {
            // we should load everything after the new page is already entered
            animation();
            servicesAnimation();
            markersPosition();
          },
        });
      },
    },
  ],
});
