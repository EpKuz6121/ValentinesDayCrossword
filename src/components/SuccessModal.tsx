import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ["#e91e63", "#ff4081", "#f48fb1", "#fce4ec", "#c2185b"];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Big burst in the center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-2xl p-8 md:p-12 shadow-romantic border-4 border-primary animate-scale-in max-w-md mx-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient-romantic mb-4">
          Happy Valentine's Day!
        </h2>
        <p className="text-lg font-body text-foreground mb-6">
          You solved it! I love you! 💕
        </p>
        <div className="text-5xl mb-6 animate-float">
          💐🍫🧸
        </div>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-romantic"
        >
          Close ❤️
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
