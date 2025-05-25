import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Try multiple URL formats for S3 bucket
  const imageUrls = [
    'https://dzimycz-hb.s3.eu-central-1.amazonaws.com/photo_2025-05-23+11.20.42.jpeg',
    'https://dzimycz-hb.s3.eu-central-1.amazonaws.com/photo_2025-05-23%2B11.20.42.jpeg',
    'https://dzimycz-hb.s3.eu-central-1.amazonaws.com/photo_2025-05-23%2011.20.42.jpeg'
  ];

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      document.body.appendChild(confetti);
    }
  };

  const celebrate = useCallback(() => {
    console.log('Кнопка святкавання націснута!');

    // Create more confetti
    createConfetti();

    // Show YouTube video
    setShowVideo(true);
    setShowCompletion(true);

    // Scroll to video after it appears
    setTimeout(() => {
      document.getElementById('youtube-player')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 500);

    // Create sparkles
    const sparklesContainer = document.getElementById('sparkles');
    if (sparklesContainer) {
      sparklesContainer.innerHTML = '';

      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';
          sparkle.style.width = Math.random() * 8 + 4 + 'px';
          sparkle.style.height = sparkle.style.width;
          sparkle.style.setProperty('--x', (Math.random() - 0.5) * 200 + 'px');
          sparkle.style.setProperty('--y', (Math.random() - 0.5) * 200 + 'px');
          sparklesContainer.appendChild(sparkle);
        }, i * 50);
      }
    }

    // Alert removed for better user experience
  }, []);

  useEffect(() => {
    createConfetti();
    
    // Add keyboard event listener
    const handleKeyPress = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        celebrate();
      }
    };
    
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [celebrate]);

  // Smooth rotation animation using requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;
    
    const animate = (currentTime) => {
      if (currentTime - lastTime >= 16) { // Smooth 60fps updates
        setRotation(prev => {
          const newRotation = (prev + 0.3) % 360; // Smaller increments for smoother rotation
          return newRotation;
        });
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const handleImageLoad = () => {
    console.log('Выява паспяхова загружана!');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.log('Не ўдалося загрузіць выяву:', imageUrls[currentUrlIndex]);
    if (currentUrlIndex < imageUrls.length - 1) {
      setTimeout(() => {
        setCurrentUrlIndex(currentUrlIndex + 1);
      }, 1000);
    } else {
      setImageError(true);
    }
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="birthday-text">З Днём нараджэння!</h1>

        <div 
          className="photo-frame" 
          id="photo-frame"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Rotation indicator dot */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '12px',
            height: '12px',
            backgroundColor: '#ff4444',
            borderRadius: '50%',
            zIndex: 10
          }}></div>

          {!imageLoaded && !imageError && (
            <div className="photo-placeholder" id="placeholder">
              <p>📷 Загружаецца твая фатаграфія...</p>
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                Загрузка з S3...
              </p>
            </div>
          )}
          
          {imageError && (
            <div className="photo-placeholder">
              <p>❌ Не ўдалося загрузіць выяву</p>
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                Выява S3 недаступная. Праверце CORS і дазволы.
              </p>
            </div>
          )}

          <img
            id="birthday-photo"
            src={imageUrls[currentUrlIndex]}
            alt="Іменіннік"
            style={{ 
              display: imageLoaded ? 'block' : 'none',
              transform: `rotate(${rotation}deg) scale(1.1)`
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>

        <div className="cake">🎂</div>

        <p className="message">
          <strong>Мы, Галя і Ягор, жадаем табе, Дзіма:</strong><br/>
          Дня, поўнага шчасця, і года, поўнага радасці!<br/>
          Хай усе твае мары збываюцца ў гэты асаблівы дзень! 🎉
        </p>

        <button onClick={celebrate}>Націсні для святкавання! 🎊</button>

        {showVideo && (
          <div className="youtube-player" id="youtube-player">
            <button 
              className="close-video" 
              onClick={closeVideo} 
              title="Закрыць відэа"
            >
              ×
            </button>
            <iframe
              className="youtube-iframe"
              id="youtube-iframe"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&start=0"
              title="Сюрпрыз да дня нараджэння"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}

        {showCompletion && (
          <div className="youtube-button-container" id="youtube-button-container">
            <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '15px' }}>
              🎵 Падабаецца сюрпрыз? 🎵
            </p>
            <p style={{ fontSize: '0.9em', color: '#999' }}>
              Святкаванне дня нараджэння завершана!
            </p>
          </div>
        )}

        <div className="sparkles" id="sparkles"></div>

        <div className="footer">
          🌟 Размешчана на AWS | Зроблена з ❤️
        </div>
      </div>
    </div>
  );
}

export default App;
