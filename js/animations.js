// Animations driven by scrollmagic

// init controller
const controller = new ScrollMagic.Controller();

const serviceSceneParams = {
    triggerElement: "#services",
    triggerHook: 0.9, // show, when scrolled 10% into view
    // duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
    offset: 50 // move trigger to center of element
};

new ScrollMagic.Scene(serviceSceneParams)
    .setClassToggle("#services .left-block", "animate__fadeInLeft") // left block
    .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

new ScrollMagic.Scene(serviceSceneParams)
    .setClassToggle("#services .middle-block", "animate__fadeIn") // add class to reveal
    .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

new ScrollMagic.Scene(serviceSceneParams)
    .setClassToggle("#services .right-block", "animate__fadeInRight") // add class to reveal
    .addIndicators() // add indicators (requires plugin)
    .addTo(controller);

const aboutSceneParams = {
    triggerElement: "#about",
    triggerHook: 0.9, // show, when scrolled 10% into view
    // duration: "80%", // hide 10% before exiting view (80% + 10% from bottom)
    offset: 50 // move trigger to center of element
};

new ScrollMagic.Scene(aboutSceneParams)
    .setClassToggle("#about .member-short", "animate__fadeInRight") // add class to reveal
    .addIndicators() // add indicators (requires plugin)
    .addTo(controller);