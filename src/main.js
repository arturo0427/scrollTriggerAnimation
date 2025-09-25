import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const spotlightImages = document.querySelector('.spotlight-images');
  const maskContainer = document.querySelector('.mask-container');
  const maskImage = document.querySelector('.mask-img');
  const maskHeader = document.querySelector('.mask-container .header h1');

  //Altura del contenedor en pixeles
  const spotlightContainerHeight = spotlightImages.offsetHeight;

  //Tamaño de la ventana
  const viewportHeight = window.innerHeight;

  //Offset inicial
  const initialOffset = spotlightContainerHeight * 0.05;

  const totalMovement =
    spotlightContainerHeight + initialOffset + viewportHeight;

  let headerSplit = null;

  if (maskHeader) {
    headerSplit = SplitText.create(maskHeader, {
      type: 'words',
      wordsClass: 'sportlight-word',
    });

    gsap.set(headerSplit.words, { opacity: 0 });
  }

  // gsap.set(maskImage, { transformOrigin: '50% 50%' });

  ScrollTrigger.create({
    trigger: '.spotlight',
    start: 'top top',
    end: `+=${window.innerHeight * 7}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;

      if (progress <= 0.5) {
        //Mapea el progreso de 0 a 0.5 a un rango de 0 a 1
        const imagesMoveProgress = progress / 0.5;

        //Rango de movimiento
        const startY = 5;
        const endY = -(totalMovement / spotlightContainerHeight) * 100;

        //Valor intermedio entre dos puntos
        //imagesMoveProgress -> actualuza el valor intermedio cda vez que se llama al update
        const currentY = startY + (endY - startY) * imagesMoveProgress;

        gsap.set(spotlightImages, {
          y: `${currentY}%`,
        });
      }

      //? MASK ANIMATION
      if (maskContainer && maskImage) {
        if (progress < 0.25) {
          maskContainer.style.setProperty('-webkit-mask-size', '0% 0%');
          maskContainer.style.setProperty('mask-size', '0% 0%');

          gsap.set(maskImage, {
            scale: 1.5,
          });
        } else if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;

          const maskSize = `${maskProgress * 2000}% ${maskProgress * 2000}%`;
          const imageScale = 1.5 - maskProgress * 0.5;

          maskContainer.style.setProperty('-webkit-mask-size', maskSize);
          maskContainer.style.setProperty('mask-size', maskSize);

          gsap.set(maskImage, {
            scale: imageScale,
          });
        } else if (progress > 0.75) {
          maskContainer.style.setProperty('-webkit-mask-size', '2000% 2000%');
          maskContainer.style.setProperty('mask-size', '2000% 2000%');

          gsap.set(maskImage, {
            scale: 1,
          });
        }
      }

      //? TEXT ANIMATION

      if (headerSplit && headerSplit.words.length > 0) {
        if (progress >= 0.75 && progress <= 0.95) {
          const textProgress = (progress - 0.75) / 0.2;
          const totalWords = headerSplit.words.length;

          headerSplit.words.forEach((word, index) => {
            const wordRevealProgress = index / totalWords;

            if (textProgress >= wordRevealProgress) {
              gsap.set(word, { opacity: 1 });
            } else {
              gsap.set(word, { opacity: 0 });
            }
          });
        } else if (progress < 0.75) {
          gsap.set(headerSplit.words, { opacity: 0 });
        } else if (progress > 0.95) {
          gsap.set(headerSplit.words, { opacity: 1 });
        }
      }
    },
  });
});
