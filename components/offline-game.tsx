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
      const container = containerRef.current
      if (container) {
        if (isFullscreen) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight - 80
        } else {
          canvas.width = container.clientWidth
          canvas.height = Math.min(350, window.innerHeight * 0.4)
        }
      }
    }
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    const scale = isFullscreen ? Math.min(window.innerWidth / 800, 2) : Math.min(canvas.width / 600, 1.2)
    const groundHeight = 50 * scale

    const gameState = {
      dino: {
        x: 80 * scale,
        y: 0,
        width: 50 * scale,
        height: 55 * scale,
        velocityY: 0,
        isJumping: false,
        jumpForce: -18 * scale,
        gravity: 0.8 * scale,
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
        size: number
      }>,
      ground: canvas.height - groundHeight,
      gameSpeed: 7 * scale,
      frameCount: 0,
      score: 0,
      combo: 0,
      clouds: [] as Array<{ x: number; y: number; size: number }>,
      stars: [] as Array<{ x: number; y: number; size: number; twinkle: number; brightness: number }>,
      mountains: [] as Array<{ x: number; height: number; width: number; color: string }>,
      isNight: false,
      nightTimer: 0,
      nightTransition: 0,
      groundOffset: 0,
      skyGradient: null as CanvasGradient | null,
    }

    gameState.dino.y = gameState.ground - gameState.dino.height
    gameStateRef.current = gameState

    // Initialize clouds
    for (let i = 0; i < 10; i++) {
      gameState.clouds.push({
        x: Math.random() * canvas.width,
        y: 40 + Math.random() * 100,
        size: 0.6 + Math.random() * 0.8,
      })
    }

    for (let i = 0; i < 100; i++) {
      gameState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.6),
        size: Math.random() * 3 + 1,
        twinkle: Math.random() * Math.PI * 2,
        brightness: 0.5 + Math.random() * 0.5,
      })
    }

    // Initialize mountains with varied colors
    for (let i = 0; i < 6; i++) {
      gameState.mountains.push({
        x: i * (canvas.width / 4),
        height: 80 + Math.random() * 100,
        width: 120 + Math.random() * 120,
        color: `hsl(${220 + Math.random() * 20}, ${20 + Math.random() * 10}%, ${25 + Math.random() * 15}%)`,
      })
    }

    const jump = () => {
      if (!gameState.dino.isJumping && !gameState.dino.isDucking) {
        gameState.dino.velocityY = gameState.dino.jumpForce
        gameState.dino.isJumping = true
        addParticles(gameState.dino.x + gameState.dino.width / 2, gameState.ground, "#a08060", 5, 3)
      }
    }

    const duck = (isDucking: boolean) => {
      if (!gameState.dino.isJumping) {
        gameState.dino.isDucking = isDucking
        if (isDucking) {
          gameState.dino.height = 30 * scale
          gameState.dino.y = gameState.ground - gameState.dino.height
        } else {
          gameState.dino.height = 55 * scale
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

    const drawDino = () => {
      const { x, y, legFrame, isDucking, width, height, invincible } = gameState.dino

      if (invincible && Math.floor(gameState.frameCount / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5
      }

      const bodyColor = gameState.isNight ? "#d0d0d0" : "#535353"
      const detailColor = gameState.isNight ? "#b0b0b0" : "#3a3a3a"

      ctx.fillStyle = bodyColor

      if (isDucking) {
        // Ducking dino
        ctx.fillRect(x, y + 10 * scale, 65 * scale, 20 * scale)
        ctx.fillRect(x + 50 * scale, y, 20 * scale, 20 * scale)
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 60 * scale, y + 6 * scale, 5 * scale, 5 * scale)
      } else {
        // Body
        ctx.fillRect(x + 10 * scale, y + 20 * scale, 36 * scale, 28 * scale)
        // Neck
        ctx.fillRect(x + 24 * scale, y + 12 * scale, 16 * scale, 12 * scale)
        // Head
        ctx.fillRect(x + 30 * scale, y + 2 * scale, 20 * scale, 16 * scale)
        // Eye
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(x + 42 * scale, y + 6 * scale, 5 * scale, 5 * scale)
        ctx.fillStyle = "#000000"
        ctx.fillRect(x + 44 * scale, y + 7 * scale, 2 * scale, 3 * scale)
        // Mouth
        ctx.fillStyle = detailColor
        ctx.fillRect(x + 45 * scale, y + 13 * scale, 5 * scale, 2 * scale)
        // Tail
        ctx.fillStyle = bodyColor
        ctx.fillRect(x, y + 24 * scale, 12 * scale, 10 * scale)
        ctx.fillRect(x - 8 * scale, y + 28 * scale, 10 * scale, 8 * scale)
        // Arms
        ctx.fillRect(x + 24 * scale, y + 22 * scale, 8 * scale, 14 * scale)
        // Legs animation
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
      const cactusColor = gameState.isNight ? "#3d6b4f" : "#228b22"
      const cactusDark = gameState.isNight ? "#2d5040" : "#1a6b1a"

      ctx.fillStyle = cactusColor
      // Main body
      ctx.fillRect(x + width * 0.3, y, width * 0.4, height)
      // Left arm
      ctx.fillRect(x, y + height * 0.3, width * 0.35, height * 0.18)
      ctx.fillRect(x, y + height * 0.15, width * 0.18, height * 0.33)
      // Right arm
      ctx.fillRect(x + width * 0.65, y + height * 0.45, width * 0.35, height * 0.18)
      ctx.fillRect(x + width * 0.82, y + height * 0.35, width * 0.18, height * 0.28)
      // Details
      ctx.fillStyle = cactusDark
      ctx.fillRect(x + width * 0.45, y + height * 0.1, width * 0.1, height * 0.8)
    }

    const drawBird = (x: number, y: number) => {
      const birdColor = gameState.isNight ? "#a0a0a0" : "#535353"
      const wingColor = gameState.isNight ? "#808080" : "#3a3a3a"

      ctx.fillStyle = birdColor
      // Body
      ctx.fillRect(x + 8 * scale, y + 10 * scale, 24 * scale, 12 * scale)
      // Head
      ctx.fillRect(x + 26 * scale, y + 6 * scale, 14 * scale, 12 * scale)
      // Beak
      ctx.fillStyle = gameState.isNight ? "#ffd700" : "#ff8c00"
      ctx.fillRect(x + 38 * scale, y + 10 * scale, 10 * scale, 5 * scale)
      // Eye
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + 32 * scale, y + 8 * scale, 4 * scale, 4 * scale)
      ctx.fillStyle = "#000000"
      ctx.fillRect(x + 33 * scale, y + 9 * scale, 2 * scale, 2 * scale)
      // Wings animation
      ctx.fillStyle = wingColor
      const wingY = Math.sin(gameState.frameCount * 0.5) * 8 * scale
      ctx.fillRect(x, y + 12 * scale + wingY, 18 * scale, 8 * scale)
      ctx.fillRect(x + 12 * scale, y + 12 * scale - wingY, 16 * scale, 8 * scale)
    }

    const gameLoop = () => {
      // Day/Night cycle with smooth transition
      gameState.nightTimer++
      if (gameState.nightTimer > 600) {
        gameState.isNight = !gameState.isNight
        gameState.nightTimer = 0
      }

      if (gameState.isNight) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#0f0f2d")
        gradient.addColorStop(0.3, "#1a1a4a")
        gradient.addColorStop(0.6, "#252560")
        gradient.addColorStop(1, "#353580")
        ctx.fillStyle = gradient
      } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#4fb8e8")
        gradient.addColorStop(0.4, "#87ceeb")
        gradient.addColorStop(0.7, "#b8e0f0")
        gradient.addColorStop(1, "#e8f4f8")
        ctx.fillStyle = gradient
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (gameState.isNight) {
        gameState.stars.forEach((star) => {
          star.twinkle += 0.08
          const brightness = star.brightness * (0.6 + Math.sin(star.twinkle) * 0.4)

          // Star glow
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness})`)
          gradient.addColorStop(0.5, `rgba(200, 220, 255, ${brightness * 0.4})`)
          gradient.addColorStop(1, "rgba(200, 220, 255, 0)")
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fill()

          // Star core
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        })

        const moonX = canvas.width - 120
        const moonY = 80
        const moonGlow = ctx.createRadialGradient(moonX, moonY, 30, moonX, moonY, 80)
        moonGlow.addColorStop(0, "rgba(255, 255, 220, 0.3)")
        moonGlow.addColorStop(0.5, "rgba(255, 255, 200, 0.1)")
        moonGlow.addColorStop(1, "rgba(255, 255, 200, 0)")
        ctx.fillStyle = moonGlow
        ctx.beginPath()
        ctx.arc(moonX, moonY, 80, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffd8"
        ctx.beginPath()
        ctx.arc(moonX, moonY, 40, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#e8e8c0"
        ctx.beginPath()
        ctx.arc(moonX - 10, moonY - 10, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(moonX + 15, moonY + 10, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(moonX - 5, moonY + 15, 5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Sun with rays
        const sunX = canvas.width - 100
        const sunY = 70

        // Sun glow
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 25, sunX, sunY, 70)
        sunGlow.addColorStop(0, "rgba(255, 220, 50, 0.4)")
        sunGlow.addColorStop(0.5, "rgba(255, 200, 50, 0.1)")
        sunGlow.addColorStop(1, "rgba(255, 200, 50, 0)")
        ctx.fillStyle = sunGlow
        ctx.beginPath()
        ctx.arc(sunX, sunY, 70, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffdd00"
        ctx.beginPath()
        ctx.arc(sunX, sunY, 35, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#fff5cc"
        ctx.beginPath()
        ctx.arc(sunX, sunY, 28, 0, Math.PI * 2)
        ctx.fill()
      }

      // Mountains
      gameState.mountains.forEach((mountain) => {
        mountain.x -= gameState.gameSpeed * 0.15
        if (mountain.x < -mountain.width) {
          mountain.x = canvas.width + Math.random() * 200
          mountain.height = 80 + Math.random() * 100
        }

        ctx.fillStyle = gameState.isNight ? "#1a1a3a" : "#9cb8c8"
        ctx.beginPath()
        ctx.moveTo(mountain.x, gameState.ground)
        ctx.lineTo(mountain.x + mountain.width / 2, gameState.ground - mountain.height)
        ctx.lineTo(mountain.x + mountain.width, gameState.ground)
        ctx.closePath()
        ctx.fill()

        // Snow cap
        ctx.fillStyle = gameState.isNight ? "#4a4a7a" : "#ffffff"
        ctx.beginPath()
        ctx.moveTo(mountain.x + mountain.width * 0.32, gameState.ground - mountain.height * 0.65)
        ctx.lineTo(mountain.x + mountain.width / 2, gameState.ground - mountain.height)
        ctx.lineTo(mountain.x + mountain.width * 0.68, gameState.ground - mountain.height * 0.65)
        ctx.closePath()
        ctx.fill()
      })

      // Clouds
      gameState.clouds.forEach((cloud) => {
        cloud.x -= gameState.gameSpeed * 0.35
        if (cloud.x < -100) {
          cloud.x = canvas.width + 100
          cloud.y = 40 + Math.random() * 100
        }

        const s = cloud.size
        ctx.fillStyle = gameState.isNight ? "rgba(80, 80, 120, 0.5)" : "rgba(255, 255, 255, 0.95)"
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, 22 * s, 0, Math.PI * 2)
        ctx.arc(cloud.x + 28 * s, cloud.y - 12 * s, 28 * s, 0, Math.PI * 2)
        ctx.arc(cloud.x + 55 * s, cloud.y, 22 * s, 0, Math.PI * 2)
        ctx.arc(cloud.x + 28 * s, cloud.y + 6 * s, 20 * s, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ground
      ctx.fillStyle = gameState.isNight ? "#1a1a2e" : "#dcb894"
      ctx.fillRect(0, gameState.ground, canvas.width, groundHeight)

      // Ground texture
      gameState.groundOffset = (gameState.groundOffset + gameState.gameSpeed) % 25
      ctx.fillStyle = gameState.isNight ? "#2a2a4e" : "#c4a67a"
      for (let i = -25; i < canvas.width + 25; i += 25) {
        ctx.fillRect(i - gameState.groundOffset, gameState.ground + 3, 15, 4)
        ctx.fillRect(i - gameState.groundOffset + 8, gameState.ground + 12, 10, 3)
      }

      // Ground line
      ctx.strokeStyle = gameState.isNight ? "#3a3a6e" : "#a08060"
      ctx.lineWidth = 3
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
      const spawnRate = Math.max(35, 65 - Math.floor(gameState.score / 12))
      if (gameState.frameCount % spawnRate === 0) {
        const type = Math.random() > 0.7 ? "bird" : "cactus"
        const height = type === "bird" ? 32 * scale : (40 + Math.random() * 30) * scale
        const width = type === "bird" ? 48 * scale : (18 + Math.random() * 15) * scale
        const birdHeight = Math.random() > 0.5 ? 55 : 100

        gameState.obstacles.push({
          x: canvas.width + 30,
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
            x: gameState.dino.x + 14 * scale,
            y: gameState.dino.y + 10 * scale,
            width: gameState.dino.width - 28 * scale,
            height: gameState.dino.height - 18 * scale,
          }

          if (
            dinoHitbox.x < obs.x + obs.width - 10 * scale &&
            dinoHitbox.x + dinoHitbox.width > obs.x + 10 * scale &&
            dinoHitbox.y < obs.y + obs.height - 6 * scale &&
            dinoHitbox.y + dinoHitbox.height > obs.y + 6 * scale
          ) {
            addParticles(
              gameState.dino.x + gameState.dino.width / 2,
              gameState.dino.y + gameState.dino.height / 2,
              "#ff4444",
              25,
              5,
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

          if (gameState.combo >= 5) {
            setCombo(gameState.combo)
            setShowCombo(true)
            setTimeout(() => setShowCombo(false), 1000)
          }

          addParticles(obs.x + obs.width, obs.y, "#44ff44", 8, 4)
        }

        if (obs.x < -obs.width - 40) {
          gameState.obstacles.splice(i, 1)
        }
      }

      // Update particles
      for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const p = gameState.particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35
        p.life--

        ctx.globalAlpha = p.life / 40
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        if (p.life <= 0) {
          gameState.particles.splice(i, 1)
        }
      }

      setScore(Math.floor(gameState.score))

      if (gameState.gameSpeed < 16 * scale) {
        gameState.gameSpeed += 0.003
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      window.removeEventListener("resize", updateCanvasSize)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouch)
    }
  }, [gameStarted, gameOver, highScore, isFullscreen, isPaused, startGame])

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center w-full ${
        isFullscreen
          ? "fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 z-[100]"
          : "min-h-screen px-0 py-4 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800"
      }`}
    >
      {!gameStarted && !gameOver && (
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-6 shadow-xl">
            <span className="material-symbols-outlined text-7xl text-gray-600 dark:text-gray-300">cloud_off</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">No Internet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Play Dino Runner while you wait!</p>
          <button
            onClick={startGame}
            className="px-10 py-5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl font-bold text-xl hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
          >
            Start Game
          </button>
          <p className="text-gray-500 dark:text-gray-500 mt-6 text-sm">Tap or press Space to jump</p>
        </div>
      )}

      {(gameStarted || gameOver) && (
        <div className={`w-full ${isFullscreen ? "px-0" : "px-0"}`}>
          {/* Game Header */}
          <div className="flex justify-between items-center mb-3 px-4">
            <div
              className={`font-mono font-bold ${isFullscreen ? "text-2xl text-white" : "text-xl text-gray-700 dark:text-gray-300"}`}
            >
              <span className="text-gray-500">HI:</span> {highScore.toString().padStart(5, "0")} |{" "}
              <span className="text-primary">{score.toString().padStart(5, "0")}</span>
            </div>

            {showCombo && (
              <div className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-yellow-400 animate-bounce drop-shadow-lg">
                {combo}x COMBO!
              </div>
            )}

            <div className="flex items-center gap-2">
              {!gameOver && (
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
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
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isFullscreen
                    ? "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isFullscreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
              {gameOver && (
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Restart
                </button>
              )}
            </div>
          </div>

          <div
            className={`relative overflow-hidden ${isFullscreen ? "" : "rounded-none"}`}
            style={{ boxShadow: isFullscreen ? "none" : "0 4px 30px rgba(0,0,0,0.15)" }}
          >
            <canvas ref={canvasRef} className="w-full block" />

            {/* Pause Overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-white mb-6">pause_circle</span>
                  <p className="text-3xl font-bold text-white">PAUSED</p>
                  <p className="text-white/70 mt-3 text-lg">Press P or tap Resume</p>
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-8xl text-red-400 mb-6">sentiment_sad</span>
                  <p className="text-4xl font-bold text-white mb-3">GAME OVER</p>
                  <p className="text-2xl text-white/80 mb-6">Score: {score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-xl text-yellow-400 font-bold mb-6 animate-pulse">New High Score!</p>
                  )}
                  <p className="text-white/60 text-lg">Tap or press Space to play again</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls Info */}
          {!gameOver && !isPaused && (
            <div
              className={`text-center mt-4 px-4 ${isFullscreen ? "text-white/70" : "text-gray-600 dark:text-gray-400"}`}
            >
              <div className="flex justify-center gap-6 text-sm flex-wrap">
                <span className="flex items-center gap-2">
                  <kbd
                    className={`px-3 py-1.5 rounded text-xs font-mono ${isFullscreen ? "bg-white/10" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    Space
                  </kbd>
                  <span>/ Tap to Jump</span>
                </span>
                <span className="flex items-center gap-2">
                  <kbd
                    className={`px-3 py-1.5 rounded text-xs font-mono ${isFullscreen ? "bg-white/10" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    ↓
                  </kbd>
                  <span>Duck</span>
                </span>
                <span className="flex items-center gap-2">
                  <kbd
                    className={`px-3 py-1.5 rounded text-xs font-mono ${isFullscreen ? "bg-white/10" : "bg-gray-200 dark:bg-gray-700"}`}
                  >
                    P
                  </kbd>
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
