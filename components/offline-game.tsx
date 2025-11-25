"use client"

import { useState, useEffect, useRef, useCallback } from "react"

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
  const gameLoopRef = useRef<number | null>(null)
  const gameStateRef = useRef<any>(null)

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
  }, [])

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
      if (isFullscreen) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight - 100
      } else {
        canvas.width = Math.min(800, window.innerWidth - 32)
        canvas.height = 250
      }
    }
    updateCanvasSize()

    const scale = isFullscreen ? 1.8 : 1
    const groundHeight = 40 * scale

    const gameState = {
      dino: {
        x: 60 * scale,
        y: 0,
        width: 44 * scale,
        height: 47 * scale,
        velocityY: 0,
        isJumping: false,
        jumpForce: -15 * scale,
        gravity: 0.7 * scale,
        legFrame: 0,
        isDucking: false,
        invincible: false,
        invincibleTimer: 0,
      },
      obstacles: [] as Array<{
        x: number
        width: number
        height: number
        scored: boolean
        type: string
        y: number
      }>,
      powerups: [] as Array<{
        x: number
        y: number
        type: string
        collected: boolean
      }>,
      particles: [] as Array<{
        x: number
        y: number
        vx: number
        vy: number
        life: number
        color: string
      }>,
      ground: canvas.height - groundHeight,
      gameSpeed: 6 * scale,
      frameCount: 0,
      score: 0,
      combo: 0,
      clouds: [] as Array<{ x: number; y: number; size: number }>,
      stars: [] as Array<{ x: number; y: number; size: number; twinkle: number }>,
      mountains: [] as Array<{ x: number; height: number; width: number }>,
      isNight: false,
      nightTimer: 0,
      groundOffset: 0,
    }

    gameState.dino.y = gameState.ground - gameState.dino.height
    gameStateRef.current = gameState

    // Initialize clouds
    for (let i = 0; i < 8; i++) {
      gameState.clouds.push({
        x: Math.random() * canvas.width,
        y: 30 + Math.random() * 80,
        size: 0.5 + Math.random() * 0.8,
      })
    }

    // Initialize stars
    for (let i = 0; i < 50; i++) {
      gameState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.5),
        size: Math.random() * 2 + 1,
        twinkle: Math.random() * Math.PI * 2,
      })
    }

    // Initialize mountains
    for (let i = 0; i < 5; i++) {
      gameState.mountains.push({
        x: i * (canvas.width / 4),
        height: 60 + Math.random() * 80,
        width: 100 + Math.random() * 100,
      })
    }

    const jump = () => {
      if (!gameState.dino.isJumping && !gameState.dino.isDucking) {
        gameState.dino.velocityY = gameState.dino.jumpForce
        gameState.dino.isJumping = true
      }
    }

    const duck = (isDucking: boolean) => {
      if (!gameState.dino.isJumping) {
        gameState.dino.isDucking = isDucking
        if (isDucking) {
          gameState.dino.height = 25 * scale
          gameState.dino.y = gameState.ground - gameState.dino.height
        } else {
          gameState.dino.height = 47 * scale
          gameState.dino.y = gameState.ground - gameState.dino.height
        }
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
        duck(true)
      }
      if (e.code === "KeyP" || e.code === "Escape") {
        setIsPaused((p) => !p)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        duck(false)
      }
    }

    const handleClick = () => {
      if (gameOver) {
        startGame()
      } else {
        jump()
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

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchstart", handleTouch)

    const addParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        gameState.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 3,
          life: 30,
          color,
        })
      }
    }

    const drawDino = () => {
      const { x, y, legFrame, isDucking, width, height, invincible } = gameState.dino

      // Invincibility flash
      if (invincible && Math.floor(gameState.frameCount / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5
      }

      ctx.fillStyle = gameState.isNight ? "#e8e8e8" : "#535353"

      if (isDucking) {
        // Ducking dino - flattened body
        ctx.fillRect(x, y + 8 * scale, 55 * scale, 18 * scale)
        ctx.fillRect(x + 45 * scale, y, 18 * scale, 18 * scale)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 55 * scale, y + 5 * scale, 4 * scale, 4 * scale)
      } else {
        // Body
        ctx.fillRect(x + 8 * scale, y + 18 * scale, 32 * scale, 24 * scale)
        // Neck
        ctx.fillRect(x + 22 * scale, y + 10 * scale, 14 * scale, 10 * scale)
        // Head
        ctx.fillRect(x + 28 * scale, y + 2 * scale, 16 * scale, 14 * scale)
        // Eye
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 38 * scale, y + 5 * scale, 4 * scale, 4 * scale)
        // Mouth line
        ctx.fillStyle = gameState.isNight ? "#e8e8e8" : "#535353"
        ctx.fillRect(x + 40 * scale, y + 11 * scale, 4 * scale, 2 * scale)
        // Tail
        ctx.fillRect(x, y + 22 * scale, 10 * scale, 8 * scale)
        ctx.fillRect(x - 6 * scale, y + 26 * scale, 8 * scale, 6 * scale)
        // Arms
        ctx.fillRect(x + 22 * scale, y + 20 * scale, 6 * scale, 12 * scale)
        // Legs animation
        if (!gameState.dino.isJumping) {
          if (legFrame < 10) {
            ctx.fillRect(x + 12 * scale, y + 42 * scale, 8 * scale, 6 * scale)
            ctx.fillRect(x + 28 * scale, y + 42 * scale, 8 * scale, 6 * scale)
          } else {
            ctx.fillRect(x + 16 * scale, y + 42 * scale, 8 * scale, 6 * scale)
            ctx.fillRect(x + 32 * scale, y + 42 * scale, 8 * scale, 6 * scale)
          }
        } else {
          ctx.fillRect(x + 14 * scale, y + 42 * scale, 8 * scale, 6 * scale)
          ctx.fillRect(x + 30 * scale, y + 42 * scale, 8 * scale, 6 * scale)
        }
      }

      ctx.globalAlpha = 1
    }

    const drawCactus = (x: number, y: number, width: number, height: number) => {
      ctx.fillStyle = gameState.isNight ? "#4a7c59" : "#2d5016"

      // Main body
      ctx.fillRect(x + width * 0.3, y, width * 0.4, height)

      // Left arm
      ctx.fillRect(x, y + height * 0.3, width * 0.3, height * 0.15)
      ctx.fillRect(x, y + height * 0.2, width * 0.15, height * 0.25)

      // Right arm
      ctx.fillRect(x + width * 0.7, y + height * 0.5, width * 0.3, height * 0.15)
      ctx.fillRect(x + width * 0.85, y + height * 0.4, width * 0.15, height * 0.25)
    }

    const drawBird = (x: number, y: number) => {
      ctx.fillStyle = gameState.isNight ? "#c4c4c4" : "#535353"

      // Body
      ctx.fillRect(x + 6 * scale, y + 8 * scale, 20 * scale, 10 * scale)
      // Head
      ctx.fillRect(x + 22 * scale, y + 5 * scale, 12 * scale, 10 * scale)
      // Beak
      ctx.fillStyle = gameState.isNight ? "#ffcc00" : "#ff9500"
      ctx.fillRect(x + 32 * scale, y + 8 * scale, 8 * scale, 4 * scale)
      // Eye
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + 28 * scale, y + 7 * scale, 3 * scale, 3 * scale)
      // Wings animation
      ctx.fillStyle = gameState.isNight ? "#c4c4c4" : "#535353"
      const wingY = Math.sin(gameState.frameCount * 0.4) * 6 * scale
      ctx.fillRect(x, y + 10 * scale + wingY, 16 * scale, 6 * scale)
      ctx.fillRect(x + 10 * scale, y + 10 * scale - wingY, 14 * scale, 6 * scale)
    }

    const gameLoop = () => {
      // Day/Night cycle
      gameState.nightTimer++
      if (gameState.nightTimer > 800) {
        gameState.isNight = !gameState.isNight
        gameState.nightTimer = 0
      }

      // Background gradient
      if (gameState.isNight) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0a0a1a")
        gradient.addColorStop(0.5, "#1a1a3a")
        gradient.addColorStop(1, "#2a2a4a")
        ctx.fillStyle = gradient
      } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#87ceeb")
        gradient.addColorStop(0.6, "#b8e0f0")
        gradient.addColorStop(1, "#f0f8ff")
        ctx.fillStyle = gradient
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Stars (night only)
      if (gameState.isNight) {
        gameState.stars.forEach((star) => {
          star.twinkle += 0.05
          const brightness = 0.5 + Math.sin(star.twinkle) * 0.5
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        })

        // Moon
        ctx.fillStyle = "#f5f5dc"
        ctx.beginPath()
        ctx.arc(canvas.width - 100, 60, 35, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#e8e8c8"
        ctx.beginPath()
        ctx.arc(canvas.width - 90, 55, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(canvas.width - 110, 70, 5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Sun
        ctx.fillStyle = "#ffdd00"
        ctx.beginPath()
        ctx.arc(canvas.width - 80, 60, 30, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#fff5cc"
        ctx.beginPath()
        ctx.arc(canvas.width - 80, 60, 25, 0, Math.PI * 2)
        ctx.fill()
      }

      // Mountains (background)
      gameState.mountains.forEach((mountain) => {
        mountain.x -= gameState.gameSpeed * 0.1
        if (mountain.x < -mountain.width) {
          mountain.x = canvas.width + Math.random() * 200
          mountain.height = 60 + Math.random() * 80
        }

        ctx.fillStyle = gameState.isNight ? "#2a2a4a" : "#c8d6e5"
        ctx.beginPath()
        ctx.moveTo(mountain.x, gameState.ground)
        ctx.lineTo(mountain.x + mountain.width / 2, gameState.ground - mountain.height)
        ctx.lineTo(mountain.x + mountain.width, gameState.ground)
        ctx.closePath()
        ctx.fill()

        // Snow cap
        ctx.fillStyle = gameState.isNight ? "#4a4a6a" : "#ffffff"
        ctx.beginPath()
        ctx.moveTo(mountain.x + mountain.width * 0.35, gameState.ground - mountain.height * 0.7)
        ctx.lineTo(mountain.x + mountain.width / 2, gameState.ground - mountain.height)
        ctx.lineTo(mountain.x + mountain.width * 0.65, gameState.ground - mountain.height * 0.7)
        ctx.closePath()
        ctx.fill()
      })

      // Clouds
      gameState.clouds.forEach((cloud) => {
        cloud.x -= gameState.gameSpeed * 0.3
        if (cloud.x < -80) {
          cloud.x = canvas.width + 80
          cloud.y = 30 + Math.random() * 80
        }

        const s = cloud.size
        ctx.fillStyle = gameState.isNight ? "rgba(60, 60, 100, 0.6)" : "rgba(255, 255, 255, 0.9)"
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, 20 * s, 0, Math.PI * 2)
        ctx.arc(cloud.x + 25 * s, cloud.y - 10 * s, 25 * s, 0, Math.PI * 2)
        ctx.arc(cloud.x + 50 * s, cloud.y, 20 * s, 0, Math.PI * 2)
        ctx.arc(cloud.x + 25 * s, cloud.y + 5 * s, 18 * s, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ground
      ctx.fillStyle = gameState.isNight ? "#1a1a2e" : "#dcb894"
      ctx.fillRect(0, gameState.ground, canvas.width, groundHeight)

      // Ground texture
      gameState.groundOffset = (gameState.groundOffset + gameState.gameSpeed) % 20
      ctx.fillStyle = gameState.isNight ? "#2a2a3e" : "#c4a67a"
      for (let i = -20; i < canvas.width + 20; i += 20) {
        ctx.fillRect(i - gameState.groundOffset, gameState.ground + 2, 12, 3)
        ctx.fillRect(i - gameState.groundOffset + 5, gameState.ground + 8, 8, 2)
      }

      // Ground line
      ctx.strokeStyle = gameState.isNight ? "#3a3a5e" : "#a08060"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, gameState.ground)
      ctx.lineTo(canvas.width, gameState.ground)
      ctx.stroke()

      // Dino physics
      gameState.dino.velocityY += gameState.dino.gravity
      gameState.dino.y += gameState.dino.velocityY

      if (gameState.dino.y >= gameState.ground - gameState.dino.height) {
        gameState.dino.y = gameState.ground - gameState.dino.height
        gameState.dino.velocityY = 0
        gameState.dino.isJumping = false
      }

      if (!gameState.dino.isJumping && !gameState.dino.isDucking) {
        gameState.dino.legFrame = (gameState.dino.legFrame + 1) % 20
      }

      // Invincibility timer
      if (gameState.dino.invincible) {
        gameState.dino.invincibleTimer--
        if (gameState.dino.invincibleTimer <= 0) {
          gameState.dino.invincible = false
        }
      }

      drawDino()

      // Spawn obstacles
      gameState.frameCount++
      const spawnRate = Math.max(40, 70 - Math.floor(gameState.score / 15))
      if (gameState.frameCount % spawnRate === 0) {
        const type = Math.random() > 0.7 ? "bird" : "cactus"
        const height = type === "bird" ? 28 * scale : (35 + Math.random() * 25) * scale
        const width = type === "bird" ? 40 * scale : (15 + Math.random() * 10) * scale
        const birdHeight = Math.random() > 0.5 ? 50 : 90

        gameState.obstacles.push({
          x: canvas.width + 20,
          width,
          height,
          scored: false,
          type,
          y: type === "bird" ? gameState.ground - height - birdHeight * scale : gameState.ground - height,
        })
      }

      // Update and draw obstacles
      for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.obstacles[i]
        obs.x -= gameState.gameSpeed

        if (obs.type === "bird") {
          drawBird(obs.x, obs.y)
        } else {
          drawCactus(obs.x, obs.y, obs.width, obs.height)
        }

        // Collision detection
        if (!gameState.dino.invincible) {
          const dinoHitbox = {
            x: gameState.dino.x + 12 * scale,
            y: gameState.dino.y + 8 * scale,
            width: gameState.dino.width - 24 * scale,
            height: gameState.dino.height - 16 * scale,
          }

          if (
            dinoHitbox.x < obs.x + obs.width - 8 * scale &&
            dinoHitbox.x + dinoHitbox.width > obs.x + 8 * scale &&
            dinoHitbox.y < obs.y + obs.height - 5 * scale &&
            dinoHitbox.y + dinoHitbox.height > obs.y + 5 * scale
          ) {
            // Game over
            addParticles(
              gameState.dino.x + gameState.dino.width / 2,
              gameState.dino.y + gameState.dino.height / 2,
              "#ff4444",
              20,
            )
            setGameOver(true)
            const newScore = Math.floor(gameState.score)
            setScore(newScore)
            if (newScore > highScore) {
              setHighScore(newScore)
              localStorage.setItem("dinoHighScore", newScore.toString())
            }
            if (gameLoopRef.current) {
              cancelAnimationFrame(gameLoopRef.current)
            }
            return
          }
        }

        // Score when passed
        if (!obs.scored && obs.x + obs.width < gameState.dino.x) {
          obs.scored = true
          gameState.score += 1
          gameState.combo += 1

          // Combo bonus
          if (gameState.combo >= 5) {
            setCombo(gameState.combo)
            setShowCombo(true)
            setTimeout(() => setShowCombo(false), 1000)
          }

          // Add particles for scoring
          addParticles(obs.x + obs.width, obs.y, "#44ff44", 5)
        }

        // Remove off-screen obstacles
        if (obs.x < -obs.width - 30) {
          gameState.obstacles.splice(i, 1)
        }
      }

      // Update particles
      for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const p = gameState.particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.life--

        ctx.globalAlpha = p.life / 30
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, 4 * scale, 4 * scale)
        ctx.globalAlpha = 1

        if (p.life <= 0) {
          gameState.particles.splice(i, 1)
        }
      }

      setScore(Math.floor(gameState.score))

      // Increase speed gradually
      if (gameState.gameSpeed < 14 * scale) {
        gameState.gameSpeed += 0.002
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouch)
    }
  }, [gameStarted, gameOver, highScore, isFullscreen, isPaused, startGame])

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center ${
        isFullscreen
          ? "fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 z-[100]"
          : "min-h-[70vh] px-4 py-8"
      }`}
    >
      {!gameStarted && !gameOver && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-4 shadow-lg">
            <span className="material-symbols-outlined text-6xl text-gray-600 dark:text-gray-300">cloud_off</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Internet Connection</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Play the Dino Runner while waiting!</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Start Game
          </button>
        </div>
      )}

      {(gameStarted || gameOver) && (
        <div className={`w-full ${isFullscreen ? "max-w-none px-4 md:px-8" : "max-w-3xl"}`}>
          {/* Game Header */}
          <div className="flex justify-between items-center mb-4">
            <div
              className={`font-mono font-bold ${isFullscreen ? "text-2xl text-white" : "text-lg text-gray-700 dark:text-gray-300"}`}
            >
              <span className="text-gray-500">HI:</span> {highScore.toString().padStart(5, "0")} |{" "}
              <span className="text-primary">{score.toString().padStart(5, "0")}</span>
            </div>

            {showCombo && (
              <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-yellow-400 animate-bounce">
                {combo}x COMBO!
              </div>
            )}

            <div className="flex items-center gap-2">
              {!gameOver && (
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isFullscreen
                      ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isFullscreen
                    ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span className="material-symbols-outlined">{isFullscreen ? "fullscreen_exit" : "fullscreen"}</span>
              </button>
              {gameOver && (
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Restart
                </button>
              )}
            </div>
          </div>

          {/* Game Canvas */}
          <div
            className={`relative rounded-xl overflow-hidden shadow-2xl ${isFullscreen ? "border-4 border-white/10" : "border-2 border-gray-300 dark:border-gray-600"}`}
          >
            <canvas
              ref={canvasRef}
              width={isFullscreen ? window.innerWidth : 800}
              height={isFullscreen ? window.innerHeight - 100 : 250}
              className="w-full block"
            />

            {/* Pause Overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-white mb-4">pause_circle</span>
                  <p className="text-2xl font-bold text-white">PAUSED</p>
                  <p className="text-white/70 mt-2">Press P or click Resume</p>
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-red-400 mb-4">sentiment_sad</span>
                  <p className="text-3xl font-bold text-white mb-2">GAME OVER</p>
                  <p className="text-xl text-white/80 mb-4">Score: {score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-lg text-yellow-400 font-bold mb-4">New High Score!</p>
                  )}
                  <p className="text-white/60">Tap or press Space to play again</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Info */}
          {!gameOver && !isPaused && (
            <div className={`text-center mt-4 ${isFullscreen ? "text-white/70" : "text-gray-600 dark:text-gray-400"}`}>
              <div className="flex justify-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd>
                  <span>/ ↑ Jump</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">↓</kbd>
                  <span>Duck</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">P</kbd>
                  <span>Pause</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
