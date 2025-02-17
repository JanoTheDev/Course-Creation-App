import { useEffect } from 'react';

export function useScreenProtection() {
  useEffect(() => {
    const preventRecording = () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };

    const preventCapture = (e: KeyboardEvent) => {
      if (
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.shiftKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 'P') ||
        (e.metaKey && e.key === 'p') ||
        (e.metaKey && e.shiftKey && e.key === 'p')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', preventCapture);
    document.addEventListener('enterpictureinpicture', preventRecording);
    document.addEventListener('leavepictureinpicture', preventRecording);

    return () => {
      document.removeEventListener('keydown', preventCapture);
      document.removeEventListener('enterpictureinpicture', preventRecording);
      document.removeEventListener('leavepictureinpicture', preventRecording);
    };
  }, []);
} 