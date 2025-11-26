"use client"

import { useRef, useState, useEffect, useCallback } from "react"

export function OfflineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [combo, setCombo] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const gameLoopRef = useRef<number | null>(null)
  const gameStateRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("dinoHighScore")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playSound = useCallback(
    (type: "jump" | "score" | "gameOver" | "milestone") => {
      if (!soundEnabled) return

      try {
        const ctx = initAudio()
        if (ctx.state === "suspended") {
          ctx.resume()
        }

        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        switch (type) {
          case "jump":
            oscillator.frequency.setValueAtTime(400, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1)
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.15)
            break

          case "score":
            oscillator.frequency.setValueAtTime(800, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05)
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.1)
            break

          case "milestone":
            oscillator.type = "square"
            oscillator.frequency.setValueAtTime(523, ctx.currentTime) // C5
            oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1) // E5
            oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2) // G5
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.35)
            break

          case "gameOver":
            oscillator.type = "sawtooth"
            oscillator.frequency.setValueAtTime(300, ctx.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.4)
            break
        }
      } catch (e) {
        // Silently fail if audio not supported
      }
    },
    [soundEnabled, initAudio],
  )

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error("Fullscreen error:", err)
    }
  }

  const startGame = useCallback(() => {
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
    setGameStarted(true)
    setCombo(0)
    initAudio() // Initialize audio on game start
  }, [initAudio])

  useEffect(() => {
    if (!canvasRef.current || !gameStarted || gameOver || isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = isFullscreen ? window.innerHeight - 60 : Math.min(400, window.innerHeight * 0.5)
    }
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    const scale = Math.min(canvas.width / 600, 1.5)
    const groundHeight = 60 * scale

    const gameState = {
      dino: {
        x: 60 * scale,
        y: canvas.height - groundHeight - 56 * scale,
        width: 50 * scale,
        height: 56 * scale,
        velocityY: 0,
        isJumping: false,
        isDucking: false,
        legFrame: 0,
        invincible: false,
      },
      obstacles: [] as any[],
      particles: [] as any[],
      clouds: [] as any[],
      stars: [] as any[],
      groundOffset: 0,
      speed: 8,
      score: 0,
      frameCount: 0,
      isNight: false,
      transitionProgress: 0,
    }

    gameStateRef.current = gameState

    // Initialize stars for night mode
    for (let i = 0; i < 60; i++) {
      gameState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - groundHeight - 100),
        size: Math.random() * 3 + 1,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
      })
    }

    // Initialize clouds
    for (let i = 0; i < 4; i++) {
      gameState.clouds.push({
        x: Math.random() * canvas.width,
        y: 40 + Math.random() * 80,
        width: (60 + Math.random() * 40) * scale,
      })
    }

    const gravity = 0.8 * scale
    const jumpForce = -16 * scale
    const groundY = canvas.height - groundHeight

    const addObstacle = () => {
      const minDistance = 350 * scale
      const lastObstacle = gameState.obstacles[gameState.obstacles.length - 1]
      if (lastObstacle && canvas.width - lastObstacle.x < minDistance) return

      const type = Math.random() > 0.75 ? "bird" : "cactus"

      if (type === "bird") {
        const heights = [groundY - 70 * scale, groundY - 45 * scale, groundY - 100 * scale]
        gameState.obstacles.push({
          type: "bird",
          x: canvas.width,
          y: heights[Math.floor(Math.random() * heights.length)],
          width: 46 * scale,
          height: 30 * scale,
        })
      } else {
        const sizes = [
          { w: 25, h: 50 },
          { w: 35, h: 60 },
          { w: 50, h: 45 },
        ]
        const size = sizes[Math.floor(Math.random() * sizes.length)]
        gameState.obstacles.push({
          type: "cactus",
          x: canvas.width,
          y: groundY - size.h * scale,
          width: size.w * scale,
          height: size.h * scale,
        })
      }
    }

    const addParticles = (x: number, y: number, color: string, count: number, size = 4) => {
      for (let i = 0; i < count; i++) {
        gameState.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 4,
          life: 40,
          color,
          size: size * scale,
        })
      }
    }

    const drawBackground = () => {
      // Sky gradient based on day/night
      let gradient
      if (gameState.isNight) {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0a0a1a")
        gradient.addColorStop(0.4, "#1a1a3a")
        gradient.addColorStop(0.7, "#2a2a4a")
        gradient.addColorStop(1, "#3a3a5a")
      } else {
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#87CEEB")
        gradient.addColorStop(0.5, "#B0E2FF")
        gradient.addColorStop(1, "#E0F4FF")
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Stars (night only) with better visibility
      if (gameState.isNight) {
        gameState.stars.forEach((star: any) => {
          star.twinkle += star.speed
          const brightness = 0.6 + Math.sin(star.twinkle) * 0.4
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()

          // Star glow
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.3})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Sun or Moon
      if (gameState.isNight) {
        const moonX = canvas.width - 100 * scale
        const moonY = 80 * scale

        const moonGlow = ctx.createRadialGradient(moonX, moonY, 20 * scale, moonX, moonY, 60 * scale)
        moonGlow.addColorStop(0, "rgba(255, 255, 200, 0.4)")
        moonGlow.addColorStop(1, "rgba(255, 255, 200, 0)")
        ctx.fillStyle = moonGlow
        ctx.beginPath()
        ctx.arc(moonX, moonY, 60 * scale, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#f0f0e0"
        ctx.beginPath()
        ctx.arc(moonX, moonY, 30 * scale, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#d0d0c0"
        ctx.beginPath()
        ctx.arc(moonX - 8 * scale, moonY - 5 * scale, 6 * scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(moonX + 10 * scale, moonY + 8 * scale, 4 * scale, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const sunGlow = ctx.createRadialGradient(80 * scale, 60 * scale, 20 * scale, 80 * scale, 60 * scale, 60 * scale)
        sunGlow.addColorStop(0, "rgba(255, 200, 100, 0.6)")
        sunGlow.addColorStop(1, "rgba(255, 200, 100, 0)")
        ctx.fillStyle = sunGlow
        ctx.beginPath()
        ctx.arc(80 * scale, 60 * scale, 60 * scale, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#FFD700"
        ctx.beginPath()
        ctx.arc(80 * scale, 60 * scale, 30 * scale, 0, Math.PI * 2)
        ctx.fill()
      }

      // Clouds
      ctx.fillStyle = gameState.isNight ? "rgba(100, 100, 120, 0.6)" : "rgba(255, 255, 255, 0.9)"
      gameState.clouds.forEach((cloud: any) => {
        cloud.x -= gameState.speed * 0.3
        if (cloud.x + cloud.width < 0) {
          cloud.x = canvas.width
          cloud.y = 40 + Math.random() * 80
        }

        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, cloud.width * 0.3, 0, Math.PI * 2)
        ctx.arc(cloud.x + cloud.width * 0.25, cloud.y - cloud.width * 0.1, cloud.width * 0.25, 0, Math.PI * 2)
        ctx.arc(cloud.x + cloud.width * 0.5, cloud.y, cloud.width * 0.35, 0, Math.PI * 2)
        ctx.arc(cloud.x + cloud.width * 0.75, cloud.y - cloud.width * 0.05, cloud.width * 0.2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Mountains
      ctx.fillStyle = gameState.isNight ? "#2a2a4a" : "#a8c4a8"
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      for (let i = 0; i < canvas.width + 200; i += 200) {
        const offset = (gameState.groundOffset * 0.2) % 200
        ctx.lineTo(i - offset, groundY - 120 * scale)
        ctx.lineTo(i + 100 - offset, groundY)
      }
      ctx.fill()

      // Snow caps
      ctx.fillStyle = gameState.isNight ? "#4a4a6a" : "#ffffff"
      for (let i = 0; i < canvas.width + 200; i += 200) {
        const offset = (gameState.groundOffset * 0.2) % 200
        ctx.beginPath()
        ctx.moveTo(i - offset - 30, groundY - 90 * scale)
        ctx.lineTo(i - offset, groundY - 120 * scale)
        ctx.lineTo(i - offset + 30, groundY - 90 * scale)
        ctx.fill()
      }
    }

    const drawDino = () => {
      const { x, y, legFrame, isDucking, invincible } = gameState.dino

      if (invincible && Math.floor(gameState.frameCount / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5
      }

      const bodyColor = gameState.isNight ? "#c0c0c0" : "#535353"
      const detailColor = gameState.isNight ? "#a0a0a0" : "#3a3a3a"

      ctx.fillStyle = bodyColor

      if (isDucking) {
        ctx.fillRect(x, y + 10 * scale, 65 * scale, 20 * scale)
        ctx.fillRect(x + 50 * scale, y, 20 * scale, 20 * scale)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 60 * scale, y + 6 * scale, 5 * scale, 5 * scale)
      } else {
        ctx.fillRect(x + 10 * scale, y + 20 * scale, 36 * scale, 28 * scale)
        ctx.fillRect(x + 24 * scale, y + 12 * scale, 16 * scale, 12 * scale)
        ctx.fillRect(x + 30 * scale, y + 2 * scale, 20 * scale, 16 * scale)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 42 * scale, y + 6 * scale, 5 * scale, 5 * scale)
        ctx.fillStyle = "#000000"
        ctx.fillRect(x + 44 * scale, y + 7 * scale, 2 * scale, 3 * scale)
        ctx.fillStyle = detailColor
        ctx.fillRect(x + 45 * scale, y + 13 * scale, 5 * scale, 2 * scale)
        ctx.fillStyle = bodyColor
        ctx.fillRect(x, y + 24 * scale, 12 * scale, 10 * scale)
        ctx.fillRect(x - 8 * scale, y + 28 * scale, 10 * scale, 8 * scale)
        ctx.fillRect(x + 24 * scale, y + 22 * scale, 8 * scale, 14 * scale)

        if (!gameState.dino.isJumping) {
          if (legFrame < 10) {
            ctx.fillRect(x + 14 * scale, y + 48 * scale, 10 * scale, 8 * scale)
            ctx.fillRect(x + 30 * scale, y + 48 * scale, 10 * scale, 8 * scale)
          } else {
            ctx.fillRect(x + 18 * scale, y + 48 * scale, 10 * scale, 8 * scale)
            ctx.fillRect(x + 34 * scale, y + 48 * scale, 10 * scale, 8 * scale)
          }
        } else {
          ctx.fillRect(x + 16 * scale, y + 48 * scale, 10 * scale, 8 * scale)
          ctx.fillRect(x + 32 * scale, y + 48 * scale, 10 * scale, 8 * scale)
        }
      }

      ctx.globalAlpha = 1
    }

    const drawCactus = (x: number, y: number, width: number, height: number) => {
      const cactusColor = gameState.isNight ? "#4d8b5f" : "#228b22"
      const cactusDark = gameState.isNight ? "#3d7b4f" : "#1a6b1a"

      ctx.fillStyle = cactusColor
      ctx.fillRect(x + width * 0.3, y, width * 0.4, height)
      ctx.fillRect(x, y + height * 0.3, width * 0.35, height * 0.18)
      ctx.fillRect(x, y + height * 0.15, width * 0.18, height * 0.33)
      ctx.fillRect(x + width * 0.65, y + height * 0.45, width * 0.35, height * 0.18)
      ctx.fillRect(x + width * 0.82, y + height * 0.35, width * 0.18, height * 0.28)
      ctx.fillStyle = cactusDark
      ctx.fillRect(x + width * 0.45, y + height * 0.1, width * 0.1, height * 0.8)
    }

    const drawBird = (x: number, y: number) => {
      const birdColor = gameState.isNight ? "#b0b0b0" : "#535353"
      const wingColor = gameState.isNight ? "#909090" : "#3a3a3a"

      ctx.fillStyle = birdColor
      ctx.fillRect(x + 8 * scale, y + 10 * scale, 24 * scale, 12 * scale)
      ctx.fillRect(x + 26 * scale, y + 6 * scale, 14 * scale, 12 * scale)
      ctx.fillStyle = gameState.isNight ? "#ffd700" : "#ff8c00"
      ctx.fillRect(x + 38 * scale, y + 10 * scale, 10 * scale, 5 * scale)
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + 32 * scale, y + 8 * scale, 4 * scale, 4 * scale)
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + 33 * scale, y + 9 * scale, 2 * scale, 2 * scale)
      ctx.fillStyle = wingColor
      const wingY = Math.sin(gameState.frameCount * 0.5) * 8 * scale
      ctx.fillRect(x, y + 12 * scale + wingY, 18 * scale, 8 * scale)
      ctx.fillRect(x + 12 * scale, y + 12 * scale - wingY, 16 * scale, 8 * scale)
    }

    const drawGround = () => {
      const groundColor = gameState.isNight ? "#3a3a5a" : "#8B7355"
      const groundDark = gameState.isNight ? "#2a2a4a" : "#6B5344"

      ctx.fillStyle = groundColor
      ctx.fillRect(0, groundY, canvas.width, groundHeight)

      ctx.fillStyle = groundDark
      for (let i = 0; i < canvas.width + 20; i += 20) {
        const offset = gameState.groundOffset % 20
        ctx.fillRect(i - offset, groundY, 2, groundHeight)
      }

      ctx.fillStyle = gameState.isNight ? "#4a4a6a" : "#9B8365"
      for (let i = 0; i < canvas.width + 40; i += 40) {
        const offset = (gameState.groundOffset * 1.5) % 40
        ctx.fillRect(i - offset, groundY + 5, 15, 3)
        ctx.fillRect(i - offset + 20, groundY + 12, 10, 2)
      }
    }

    const checkCollision = (dino: any, obstacle: any) => {
      const padding = 8 * scale
      return (
        dino.x + padding < obstacle.x + obstacle.width - padding &&
        dino.x + dino.width - padding > obstacle.x + padding &&
        dino.y + padding < obstacle.y + obstacle.height - padding &&
        dino.y + dino.height - padding > obstacle.y + padding
      )
    }

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Day/night cycle
      if (gameState.score > 0 && gameState.score % 500 === 0 && gameState.score !== gameState.lastNightSwitch) {
        gameState.isNight = !gameState.isNight
        gameState.lastNightSwitch = gameState.score
        playSound("milestone")
      }

      drawBackground()

      // Update dino
      if (gameState.dino.isJumping) {
        gameState.dino.velocityY += gravity
        gameState.dino.y += gameState.dino.velocityY

        if (gameState.dino.y >= groundY - gameState.dino.height) {
          gameState.dino.y = groundY - gameState.dino.height
          gameState.dino.isJumping = false
          gameState.dino.velocityY = 0
          addParticles(gameState.dino.x + 25 * scale, groundY, gameState.isNight ? "#4a4a6a" : "#8B7355", 5, 3)
        }
      }

      // Duck height adjustment
      if (gameState.dino.isDucking && !gameState.dino.isJumping) {
        gameState.dino.height = 30 * scale
        gameState.dino.y = groundY - gameState.dino.height
      } else if (!gameState.dino.isDucking) {
        gameState.dino.height = 56 * scale
        if (!gameState.dino.isJumping) {
          gameState.dino.y = groundY - gameState.dino.height
        }
      }

      gameState.dino.legFrame = (gameState.dino.legFrame + 1) % 20

      drawDino()

      // Update and draw obstacles
      gameState.groundOffset += gameState.speed

      if (Math.random() < 0.015) {
        addObstacle()
      }

      gameState.obstacles = gameState.obstacles.filter((obstacle) => {
        obstacle.x -= gameState.speed

        if (obstacle.type === "cactus") {
          drawCactus(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        } else {
          drawBird(obstacle.x, obstacle.y)
        }

        if (!gameState.dino.invincible && checkCollision(gameState.dino, obstacle)) {
          addParticles(gameState.dino.x + 25 * scale, gameState.dino.y + 25 * scale, "#ff4444", 20, 5)
          playSound("gameOver")
          setGameOver(true)
          setGameStarted(false)

          if (gameState.score > highScore) {
            setHighScore(gameState.score)
            localStorage.setItem("dinoHighScore", gameState.score.toString())
          }
        }

        return obstacle.x + obstacle.width > 0
      })

      // Update particles
      gameState.particles = gameState.particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.life--

        ctx.globalAlpha = p.life / 40
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.size, p.size)
        ctx.globalAlpha = 1

        return p.life > 0
      })

      drawGround()

      // Score
      gameState.score++
      gameState.frameCount++
      setScore(gameState.score)

      // Speed increase and score milestone sounds
      if (gameState.score % 100 === 0 && gameState.score !== gameState.lastScoreSound) {
        playSound("score")
        gameState.lastScoreSound = gameState.score
      }

      if (gameState.score % 200 === 0 && gameState.score !== gameState.lastCombo) {
        gameState.speed = Math.min(gameState.speed + 0.3, 18)
        setCombo((c) => c + 1)
        setShowCombo(true)
        setTimeout(() => setShowCombo(false), 1500)
        gameState.lastCombo = gameState.score
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    const jump = () => {
      if (!gameState.dino.isJumping && !gameState.dino.isDucking) {
        gameState.dino.isJumping = true
        gameState.dino.velocityY = jumpForce
        addParticles(gameState.dino.x + 25 * scale, groundY, gameState.isNight ? "#4a4a6a" : "#8B7355", 8, 3)
        playSound("jump")
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        if (gameOver) {
          startGame()
        } else {
          jump()
        }
      }
      if (e.code === "ArrowDown") {
        e.preventDefault()
        gameState.dino.isDucking = true
      }
      if (e.code === "KeyP") {
        setIsPaused((p) => !p)
      }
      if (e.code === "KeyM") {
        setSoundEnabled((s) => !s)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        gameState.dino.isDucking = false
      }
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      if (gameOver) {
        startGame()
      } else {
        jump()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    canvas.addEventListener("touchstart", handleTouch, { passive: false })
    canvas.addEventListener("click", () => {
      if (gameOver) startGame()
      else jump()
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("resize", updateCanvasSize)
      canvas.removeEventListener("touchstart", handleTouch)
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver, isPaused, isFullscreen, highScore, startGame, playSound])

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center w-full ${
        isFullscreen
          ? "fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 z-[100]"
          : "min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
      }`}
    >
      {!gameStarted && !gameOver && (
        <div className="text-center px-4 w-full max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 mb-6 shadow-xl">
            <span className="material-symbols-outlined text-6xl text-gray-500 dark:text-gray-400">wifi_off</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">No Internet Connection</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Play while you wait for the connection to restore</p>
          <button
            onClick={startGame}
            className="w-full max-w-xs px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-lg"
          >
            Play Dino Run
          </button>
          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-400">
            <span>Space / Tap = Jump</span>
            <span>Down = Duck</span>
          </div>
        </div>
      )}

      {(gameStarted || gameOver) && (
        <div className="w-full">
          {/* Game Header */}
          <div className="flex justify-between items-center py-2 px-4">
            <div
              className={`font-mono font-bold ${isFullscreen ? "text-xl text-white" : "text-lg text-gray-700 dark:text-gray-300"}`}
            >
              <span className="text-gray-500">HI:</span> {highScore.toString().padStart(5, "0")} |{" "}
              <span className="text-primary">{score.toString().padStart(5, "0")}</span>
            </div>

            {showCombo && (
              <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-yellow-400 animate-bounce drop-shadow-lg">
                {combo}x COMBO!
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled((s) => !s)}
                className={`p-2 rounded-lg transition-all ${
                  isFullscreen
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{soundEnabled ? "volume_up" : "volume_off"}</span>
              </button>
              {!gameOver && (
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                    isFullscreen
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg transition-all ${
                  isFullscreen
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
            </div>
          </div>

          {/* Canvas - Full Width */}
          <div className="relative w-full overflow-hidden">
            <canvas ref={canvasRef} className="w-full block" />

            {/* Pause Overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-7xl text-white mb-4">pause_circle</span>
                  <p className="text-2xl font-bold text-white">PAUSED</p>
                  <p className="text-white/60 mt-2">Press P or tap Resume</p>
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-7xl text-red-400 mb-4">sentiment_sad</span>
                  <p className="text-3xl font-bold text-white mb-2">GAME OVER</p>
                  <p className="text-xl text-white/80 mb-4">Score: {score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-lg text-yellow-400 font-bold mb-4 animate-pulse">New High Score!</p>
                  )}
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls Info */}
          {!gameOver && !isPaused && (
            <div className={`text-center py-3 ${isFullscreen ? "text-white/60" : "text-gray-500 dark:text-gray-400"}`}>
              <div className="flex justify-center gap-4 text-xs">
                <span>Space/Tap = Jump</span>
                <span>↓ = Duck</span>
                <span>P = Pause</span>
                <span>M = Sound</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
