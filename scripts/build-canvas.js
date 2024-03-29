;(function buildCanvas() {
  const canvasBox = document.querySelector('.canvas-box');
  
  // размеры окна со скролингом
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const minLength = (windowWidth > windowHeight) ? windowHeight: windowWidth;
  
  const canvas = document.createElement('canvas');

  const sqr = Math.floor(minLength / 30);
  canvas.height = 25 * sqr;
  canvas.width = 25 * sqr;

  canvas.classList.add('ctx');
  canvasBox.prepend(canvas);
})();