gsap.registerPlugin(ScrollTrigger);

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

// The actual animations and ScrollTriggers
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
barba.hooks.after(() => {
  updateScroll();
});

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
            markersPosition();
          },
        });
      },
      leave: ({ current }) => gsap.to(current.container, 1, { autoAlpha: 0 }),
      enter({ next }) {
        gsap.to(next.container, 1, {
          autoAlpha: 1,
          onComplete: () => {
            // we should load everything after the new page is already entered
            animation();
            markersPosition();
          },
        });
      },
    },
  ],
});
