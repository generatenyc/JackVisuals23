"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function AnimationTestPage() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const cameraFrameRef = useRef(null);
  const nathanPhotoRef = useRef(null);

  // Canvas refs for each effect
  const canvas1Ref = useRef(null);
  const canvas2Ref = useRef(null);
  const canvas3Ref = useRef(null);
  const canvas4Ref = useRef(null);
  const canvas5Ref = useRef(null);

  // Photo refs for each effect
  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  const photo3Ref = useRef(null);
  const photo4Ref = useRef(null);
  const photo5Ref = useRef(null);

  // LCD coordinates in 1440x1440 source frame
  const LCD_COORDS = {
    x: 190,
    y: 440,
    w: 520,
    h: 420,
  };

  // Preload images
  useEffect(() => {
    const cameraImg = new window.Image();
    const photoImg = new window.Image();
    let loaded = 0;

    const checkLoaded = () => {
      loaded++;
      if (loaded === 2) {
        cameraFrameRef.current = cameraImg;
        nathanPhotoRef.current = photoImg;
        setImagesLoaded(true);
      }
    };

    cameraImg.onload = checkLoaded;
    photoImg.onload = checkLoaded;
    cameraImg.src = "/videos/frames/frame_0151.jpg";
    photoImg.src = "/images/jack-nathan.jpg";
  }, []);

  // Draw initial camera frame on all canvases
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvases = [
      canvas1Ref.current,
      canvas2Ref.current,
      canvas3Ref.current,
      canvas4Ref.current,
      canvas5Ref.current,
    ];

    canvases.forEach((canvas) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      drawCameraFrame(ctx, canvas);
    });
  }, [imagesLoaded]);

  const drawCameraFrame = (ctx, canvas) => {
    const img = cameraFrameRef.current;
    if (!img) return;

    const scale = Math.min(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      x,
      y,
      img.naturalWidth * scale,
      img.naturalHeight * scale
    );
  };

  const getLCDCoords = (canvas) => {
    const scale = Math.min(
      canvas.width / 1440,
      canvas.height / 1440
    );
    return {
      x: LCD_COORDS.x * scale,
      y: LCD_COORDS.y * scale,
      w: LCD_COORDS.w * scale,
      h: LCD_COORDS.h * scale,
    };
  };

  // Effect 1: LCD Scanline
  const runEffect1 = () => {
    const canvas = canvas1Ref.current;
    const photo = photo1Ref.current;
    if (!canvas || !photo) return;

    const ctx = canvas.getContext("2d");
    const lcd = getLCDCoords(canvas);

    gsap.set(photo, { opacity: 0, scale: lcd.w / canvas.width });

    const scanline = { y: lcd.y };
    const lineHeight = 3;

    gsap.to(scanline, {
      y: lcd.y + lcd.h,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        // Draw camera frame
        drawCameraFrame(ctx, canvas);

        // Clear LCD area that's been scanned
        const scannedHeight = scanline.y - lcd.y;
        ctx.clearRect(lcd.x, lcd.y, lcd.w, scannedHeight);

        // Draw glowing blue scanline
        const gradient = ctx.createLinearGradient(
          0,
          scanline.y - lineHeight * 2,
          0,
          scanline.y + lineHeight * 2
        );
        gradient.addColorStop(0, "rgba(41, 151, 255, 0)");
        gradient.addColorStop(0.5, "rgba(41, 151, 255, 1)");
        gradient.addColorStop(1, "rgba(41, 151, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(lcd.x, scanline.y - lineHeight, lcd.w, lineHeight * 2);
      },
      onComplete: () => {
        // Reveal photo in LCD area
        gsap.to(photo, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            // Fade out canvas
            gsap.to(canvas, {
              opacity: 0,
              duration: 0.5,
            });
            // Expand photo
            gsap.to(photo, {
              scale: 1,
              duration: 0.7,
              ease: "expo.out",
            });
          },
        });
      },
    });
  };

  // Effect 2: LCD Pixel Dissolve
  const runEffect2 = () => {
    const canvas = canvas2Ref.current;
    const photo = photo2Ref.current;
    if (!canvas || !photo) return;

    const ctx = canvas.getContext("2d");
    const lcd = getLCDCoords(canvas);

    gsap.set(photo, { opacity: 0, scale: lcd.w / canvas.width });

    const gridSize = 12;
    const tileW = lcd.w / gridSize;
    const tileH = lcd.h / gridSize;
    const tiles = [];

    // Create tile array
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        tiles.push({
          x: lcd.x + col * tileW,
          y: lcd.y + row * tileH,
          w: tileW,
          h: tileH,
          alpha: 1,
        });
      }
    }

    // Shuffle tiles
    tiles.sort(() => Math.random() - 0.5);

    // Animate tiles dropping away
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.to(photo, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            gsap.to(canvas, { opacity: 0, duration: 0.5 });
            gsap.to(photo, { scale: 1, duration: 0.7, ease: "expo.out" });
          },
        });
      },
    });

    tiles.forEach((tile, i) => {
      timeline.to(
        tile,
        {
          alpha: 0,
          duration: 0.05,
          onUpdate: () => {
            drawCameraFrame(ctx, canvas);
            // Draw remaining tiles
            tiles.forEach((t) => {
              if (t.alpha > 0) {
                ctx.globalAlpha = t.alpha;
                ctx.fillStyle = "#000";
                ctx.fillRect(t.x, t.y, t.w, t.h);
              }
            });
            ctx.globalAlpha = 1;
          },
        },
        i * 0.01
      );
    });
  };

  // Effect 3: LCD Horizontal Scan
  const runEffect3 = () => {
    const canvas = canvas3Ref.current;
    const photo = photo3Ref.current;
    if (!canvas || !photo) return;

    const ctx = canvas.getContext("2d");
    const lcd = getLCDCoords(canvas);

    gsap.set(photo, { opacity: 0, scale: lcd.w / canvas.width });

    const scanline = { x: lcd.x };
    const lineWidth = 2;

    gsap.to(scanline, {
      x: lcd.x + lcd.w,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        drawCameraFrame(ctx, canvas);

        // Clear scanned area
        const scannedWidth = scanline.x - lcd.x;
        ctx.clearRect(lcd.x, lcd.y, scannedWidth, lcd.h);

        // Draw glowing vertical scanline
        const gradient = ctx.createLinearGradient(
          scanline.x - lineWidth * 2,
          0,
          scanline.x + lineWidth * 2,
          0
        );
        gradient.addColorStop(0, "rgba(41, 151, 255, 0)");
        gradient.addColorStop(0.5, "rgba(41, 151, 255, 1)");
        gradient.addColorStop(1, "rgba(41, 151, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(scanline.x - lineWidth, lcd.y, lineWidth * 2, lcd.h);
      },
      onComplete: () => {
        gsap.to(photo, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            gsap.to(canvas, { opacity: 0, duration: 0.5 });
            gsap.to(photo, { scale: 1, duration: 0.7, ease: "expo.out" });
          },
        });
      },
    });
  };

  // Effect 4: LCD Mirror Fold
  const runEffect4 = () => {
    const canvas = canvas4Ref.current;
    const photo = photo4Ref.current;
    if (!canvas || !photo) return;

    const ctx = canvas.getContext("2d");
    const lcd = getLCDCoords(canvas);

    gsap.set(photo, { opacity: 0, scale: lcd.w / canvas.width });

    const centerY = lcd.y + lcd.h / 2;
    const fold = { gap: 0 };

    gsap.to(fold, {
      gap: lcd.h / 2,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        drawCameraFrame(ctx, canvas);

        // Draw top panel sliding up
        ctx.fillStyle = "#000";
        ctx.fillRect(lcd.x, lcd.y, lcd.w, lcd.h / 2 - fold.gap);

        // Draw bottom panel sliding down
        ctx.fillRect(
          lcd.x,
          centerY + fold.gap,
          lcd.w,
          lcd.h / 2 - fold.gap
        );

        // Draw glowing centerline
        const gradient = ctx.createLinearGradient(0, centerY - 2, 0, centerY + 2);
        gradient.addColorStop(0, "rgba(41, 151, 255, 0)");
        gradient.addColorStop(0.5, "rgba(41, 151, 255, 1)");
        gradient.addColorStop(1, "rgba(41, 151, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(lcd.x, centerY - 1, lcd.w, 2);
      },
      onComplete: () => {
        gsap.to(photo, {
          opacity: 1,
          duration: 0.3,
          onComplete: () => {
            gsap.to(canvas, { opacity: 0, duration: 0.5 });
            gsap.to(photo, { scale: 1, duration: 0.7, ease: "expo.out" });
          },
        });
      },
    });
  };

  // Effect 5: Full Canvas Scan Wipe
  const runEffect5 = () => {
    const canvas = canvas5Ref.current;
    const photo = photo5Ref.current;
    if (!canvas || !photo) return;

    const ctx = canvas.getContext("2d");

    gsap.set(photo, { opacity: 0 });

    const scanline = { x: 0 };
    const lineWidth = 3;

    gsap.to(scanline, {
      x: canvas.width,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        // Clear everything left of scanline (black)
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, scanline.x, canvas.height);

        // Draw camera frame right of scanline
        const img = cameraFrameRef.current;
        if (!img) return;

        const scale = Math.min(
          canvas.width / img.naturalWidth,
          canvas.height / img.naturalHeight
        );
        const x = (canvas.width - img.naturalWidth * scale) / 2;
        const y = (canvas.height - img.naturalHeight * scale) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(scanline.x, 0, canvas.width - scanline.x, canvas.height);
        ctx.clip();
        ctx.drawImage(
          img,
          x,
          y,
          img.naturalWidth * scale,
          img.naturalHeight * scale
        );
        ctx.restore();

        // Draw glowing vertical scanline
        const gradient = ctx.createLinearGradient(
          scanline.x - lineWidth * 3,
          0,
          scanline.x + lineWidth * 3,
          0
        );
        gradient.addColorStop(0, "rgba(41, 151, 255, 0)");
        gradient.addColorStop(0.3, "rgba(41, 151, 255, 0.6)");
        gradient.addColorStop(0.5, "rgba(41, 151, 255, 1)");
        gradient.addColorStop(0.7, "rgba(41, 151, 255, 0.6)");
        gradient.addColorStop(1, "rgba(41, 151, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(scanline.x - lineWidth, 0, lineWidth * 2, canvas.height);

        // Reveal photo in wake of scanline
        const photoOpacity = Math.min(scanline.x / canvas.width, 1);
        photo.style.opacity = photoOpacity;
      },
      onComplete: () => {
        gsap.to(canvas, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            photo.style.opacity = 1;
          },
        });
      },
    });
  };

  const resetEffect = (canvasRef, photoRef) => {
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    if (!canvas || !photo) return;

    gsap.killTweensOf([canvas, photo]);
    canvas.style.opacity = 1;
    photo.style.opacity = 0;
    photo.style.transform = "scale(1)";

    const ctx = canvas.getContext("2d");
    drawCameraFrame(ctx, canvas);
  };

  if (!imagesLoaded) {
    return (
      <div style={{ padding: "40px", color: "#fff", background: "#000", minHeight: "100vh" }}>
        Loading images...
      </div>
    );
  }

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", color: "#666", marginBottom: "40px", textTransform: "uppercase", letterSpacing: "1px" }}>
          ANIMATION TEST — DELETE BEFORE LAUNCH
        </p>

        <h1 style={{ fontFamily: "system-ui", fontSize: "32px", marginBottom: "60px" }}>
          Viewfinder Reveal — Effect Comparison
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "60px",
          }}
        >
          {/* Effect 1 */}
          <div>
            <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#2997ff" }}>
              1. LCD Scanline (Top to Bottom)
            </h2>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px", aspectRatio: "1/1", background: "#000" }}>
              <canvas
                ref={canvas1Ref}
                width={400}
                height={400}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
              />
              <div
                ref={photo1Ref}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/jack-nathan.jpg"
                  alt="Nathan"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={runEffect1}
                style={{
                  padding: "10px 20px",
                  background: "#2997ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Play Effect
              </button>
              <button
                onClick={() => resetEffect(canvas1Ref, photo1Ref)}
                style={{
                  padding: "10px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Effect 2 */}
          <div>
            <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#2997ff" }}>
              2. LCD Pixel Dissolve
            </h2>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px", aspectRatio: "1/1", background: "#000" }}>
              <canvas
                ref={canvas2Ref}
                width={400}
                height={400}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
              />
              <div
                ref={photo2Ref}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/jack-nathan.jpg"
                  alt="Nathan"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={runEffect2}
                style={{
                  padding: "10px 20px",
                  background: "#2997ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Play Effect
              </button>
              <button
                onClick={() => resetEffect(canvas2Ref, photo2Ref)}
                style={{
                  padding: "10px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Effect 3 */}
          <div>
            <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#2997ff" }}>
              3. LCD Horizontal Scan
            </h2>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px", aspectRatio: "1/1", background: "#000" }}>
              <canvas
                ref={canvas3Ref}
                width={400}
                height={400}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
              />
              <div
                ref={photo3Ref}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/jack-nathan.jpg"
                  alt="Nathan"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={runEffect3}
                style={{
                  padding: "10px 20px",
                  background: "#2997ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Play Effect
              </button>
              <button
                onClick={() => resetEffect(canvas3Ref, photo3Ref)}
                style={{
                  padding: "10px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Effect 4 */}
          <div>
            <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#2997ff" }}>
              4. LCD Mirror Fold
            </h2>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px", aspectRatio: "1/1", background: "#000" }}>
              <canvas
                ref={canvas4Ref}
                width={400}
                height={400}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
              />
              <div
                ref={photo4Ref}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/jack-nathan.jpg"
                  alt="Nathan"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={runEffect4}
                style={{
                  padding: "10px 20px",
                  background: "#2997ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Play Effect
              </button>
              <button
                onClick={() => resetEffect(canvas4Ref, photo4Ref)}
                style={{
                  padding: "10px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Effect 5 */}
          <div>
            <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#2997ff" }}>
              5. Full Canvas Scan Wipe (Jo's idea)
            </h2>
            <div style={{ position: "relative", width: "100%", maxWidth: "400px", aspectRatio: "1/1", background: "#000" }}>
              <canvas
                ref={canvas5Ref}
                width={400}
                height={400}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2 }}
              />
              <div
                ref={photo5Ref}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/jack-nathan.jpg"
                  alt="Nathan"
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                onClick={runEffect5}
                style={{
                  padding: "10px 20px",
                  background: "#2997ff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Play Effect
              </button>
              <button
                onClick={() => resetEffect(canvas5Ref, photo5Ref)}
                style={{
                  padding: "10px 20px",
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "80px", padding: "20px", background: "#111", borderLeft: "3px solid #2997ff" }}>
          <h3 style={{ fontSize: "14px", marginBottom: "10px", color: "#2997ff" }}>Notes</h3>
          <ul style={{ fontSize: "13px", lineHeight: "1.8", color: "#999" }}>
            <li>All effects use the actual camera frame (frame_0151.jpg) and Nathan's photo</li>
            <li>LCD coordinates: (190, 440) to (710, 860) in 1440×1440 source, scaled proportionally</li>
            <li>Effects 1-4 reveal photo in LCD area first, then expand to full size</li>
            <li>Effect 5 reveals photo at full size across entire canvas (no expand needed)</li>
            <li>All timing and easing can be adjusted based on preference</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
