import { Application } from '@splinetool/runtime';
const canvas = document.getElementById('canvas');
const spline = new Application(canvas);

const header = {
    progress: document.querySelector('.header_progress'),
    progressLine: document.querySelector('.header_progress_line'),
};

let t1spline = gsap.timeline({
    paused: true,
    defaults: { duration: 2, ease: "expo.inOut" },
});

let animationFrame,
    timeStart,
    progress = 0,
    progressComplete = false;

const longPressDuration = 1000;

const loadSpline = async () => {
    const splineSceneLink = "https://prod.spline.design/pp6lF5SlWqpP9RCm/scene.splinecode",
          splineObjectName = "icon",
          splineDevID = "a5fdfc7a-e894-41b2-b769-9e1467b0f792";

    spline.load(splineSceneLink).then(async () => {
        const obj = spline.findObjectByName(splineObjectName) || spline.findObjectById(splineDevID); 

        gsap.set(canvas, { pointerEvents: "none" });
        gsap.set(obj.position, { y: -1700 });
        t1spline.to(obj.position, { y: 300 });
    });
};

const progressBarAnimation = (xPercent, isAnimated) => {
    header.progressLine.style.transform = `translateX(${xPercent}%)`;

    if (isAnimated) {
        header.progressLine.style.transition = 'transform 0.5s linear';
    } else {
        header.progressLine.style.transition = 'none';
    }
};

const resetAnimation = () => {
    t1spline.reverse();
    gsap.set(canvas, { pointerEvents: "none" });

    progressComplete = false;
};

const initAnimation = () => {
    t1spline.play();
    gsap.set(canvas, { pointerEvents: 'auto' });

    progressBarAnimation(100, true);

    window.addEventListener('mousedown', resetAnimation);
    window.addEventListener('touchstart', resetAnimation);

    progressComplete = true;
};

const updateProgress = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - timeStart;

    progress = Math.min(elapsedTime / longPressDuration, 1);

    // Update progress bar
    progressBarAnimation(-100 + progress * 100, false);

    if (progress < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
    } else {
        initAnimation();
    }
};

const startProgress = () => {
    if (!progressComplete) {
        timeStart = new Date().getTime();
        animationFrame = requestAnimationFrame(updateProgress);
        progressBarAnimation(-100, false);
    }
};

const endProgress = () => {
    if (!progressComplete) {
        cancelAnimationFrame(animationFrame);
        progressBarAnimation(-100, true);
        progress = 0;
    }
};

// Event listeners
window.addEventListener('mousedown', startProgress);
window.addEventListener('mouseup', endProgress);
window.addEventListener('touchstart', startProgress);
window.addEventListener('touchend', endProgress);
window.addEventListener('touchcancel', endProgress);
window.addEventListener('DOMContentLoaded', loadSpline);
