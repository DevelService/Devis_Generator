// renderPDFOnCanvas.ts
import * as pdfjsLib from "pdfjs-dist/webpack";

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker.js';

export const renderPDFOnCanvas = async (
  url: string,
  canvasRefs: React.MutableRefObject<HTMLCanvasElement[]>,
  currentRenderTask: React.MutableRefObject<any>,
  setIsRendering: (isRendering: boolean) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  if (currentRenderTask.current) {
    currentRenderTask.current.cancel();
  }

  setIsRendering(true);
  const container = document.getElementById('pdf-canvas-container');
  if (container) {
    container.innerHTML = '';
    canvasRefs.current = [];
  }

  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const renderPage = async (pageNum: number) => {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      const newCanvas = document.createElement('canvas');
      newCanvas.className = "w-full flex-grow rounded-xl";
      canvasRefs.current[pageNum - 1] = newCanvas;
      document.getElementById('pdf-canvas-container')!.appendChild(newCanvas);

      const canvas = canvasRefs.current[pageNum - 1];
      const context = canvas.getContext("2d");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;
    };

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      await renderPage(pageNum);
    }
  } catch (error) {
    if ((error as any).name !== 'RenderingCancelledException') {
      console.error('Erreur de rendu du PDF:', error);
    }
  } finally {
    setIsRendering(false);
    setIsLoading(false);
  }
};