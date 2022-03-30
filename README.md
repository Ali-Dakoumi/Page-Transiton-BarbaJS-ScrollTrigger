# Page-Transiton-BarbaJS-ScrollTrigger

The purppse of this demo is to use barba js (page transition) scrolltrigger from gsap (scroll animation) and smooth scrollbar combined together.

Check it out here : https://ali-dakoumi.github.io/Page-Transiton-BarbaJS-ScrollTrigger/

Usually third part scripts make some problems when it is combined with other libraries, so if we use barba js for page transitions, and you are using other
libraries for smooth scroll and on scroll animations, we will face a lot of problems, so here is a demo how i found out a solution for those problems and now
i am able to use those three libraries together without any problem.

### libraries used in the demo:

- Barba JS
- SmoothScroll Bar
- ScrollTrigger (gsap plugin)

### Demos that helped me:

- ihatetomatoes demo for page transition with smoothscroll, you can find it on here https://github.com/Ihatetomatoes/barbajs-demos/tree/master/barbajs-gsap-smooth-scrollbar
- Greensock demo on codepen which combines scrolltrigger plugin with locmotive scroll

## The main steps

1. Init the smooth scrollbar
2. Init the scrolltrigger proxy which is necessary to be able to work with a smoothscroll
3. Update the scrollbar and the scroltrigger
4. Fix the markers position of scrolltrigger
5. Kill the triggers before leaving the current page, use the barba global hook for that
6. Make sure to update everything about the scrollbar in the barba global hook
7. the animation function and the markers position function should be called on the onComplete function, just to make sure that the new page has already entered
8. use the lazy boolean variable in the .from gsap tweens to avoid any issues...
