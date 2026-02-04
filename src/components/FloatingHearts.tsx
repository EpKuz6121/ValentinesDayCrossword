const FloatingHearts = () => {
  const hearts = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((i) => (
        <div
          key={i}
          className="absolute text-primary/20 animate-float"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.5}s`,
            fontSize: `${24 + (i % 3) * 12}px`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
