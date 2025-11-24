"use client"

import { useState, useEffect, useRef } from "react"

export function OfflineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const gameStateRef = useRef<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem("dinoHighScore")
    if (saved) setHighScore(Number.parseInt(saved))

    setGameStarted(true)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !gameStarted || gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameState = {
      dino: {
        x: 50,
        y: 0,
        width: 44,
        height: 47,
        velocityY: 0,
        isJumping: false,
        jumpForce: -12,
        gravity: 0.6,
        legFrame: 0,
      },
      obstacles: [] as Array<{ x: number; width: number; height: number; scored: boolean; type: string }>,
      ground: canvas.height - 20,
      gameSpeed: 6,
      frameCount: 0,
      score: 0,
      clouds: [] as Array<{ x: number; y: number }>,
    }

    gameState.dino.y = gameState.ground - gameState.dino.height
    gameStateRef.current = gameState

    // Initialize clouds
    for (let i = 0; i < 4; i++) {
      gameState.clouds.push({
        x: Math.random() * canvas.width,
        y: 20 + Math.random() * 50,
      })
    }

    const jump = () => {
      if (!gameState.dino.isJumping) {
        gameState.dino.velocityY = gameState.dino.jumpForce
        gameState.dino.isJumping = true
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => jump()
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      jump()
    }

    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchstart", handleTouch)

    const drawDino = () => {
      const { x, y, legFrame } = gameState.dino

      // Body
      ctx.fillStyle = "#535353"
      ctx.fillRect(x + 6, y + 20, 34, 22)

      // Neck
      ctx.fillRect(x + 20, y + 12, 14, 8)

      // Head
      ctx.fillRect(x + 30, y + 4, 12, 12)

      // Eye
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + 36, y + 7, 3, 3)

      // Tail
      ctx.fillStyle = "#535353"
      ctx.fillRect(x, y + 24, 8, 6)
      ctx.fillRect(x - 4, y + 28, 6, 4)

      // Legs (animated running)
      ctx.fillStyle = "#535353"
      if (!gameState.dino.isJumping) {
        if (legFrame < 10) {
          // Left leg forward
          ctx.fillRect(x + 12, y + 42, 6, 5)
          ctx.fillRect(x + 24, y + 42, 6, 5)
        } else {
          // Right leg forward
          ctx.fillRect(x + 14, y + 42, 6, 5)
          ctx.fillRect(x + 26, y + 42, 6, 5)
        }
      } else {
        // Both legs centered when jumping
        ctx.fillRect(x + 13, y + 42, 6, 5)
        ctx.fillRect(x + 25, y + 42, 6, 5)
      }

      // Front arm
      ctx.fillRect(x + 20, y + 20, 4, 8)
    }

    const drawCactus = (x: number, y: number, width: number, height: number) => {
      ctx.fillStyle = "#535353"
      // Main body
      ctx.fillRect(x, y, width, height)
      // Arms
      const armY = y + height / 3
      ctx.fillRect(x - 4, armY, 4, height / 3)
      ctx.fillRect(x + width, armY, 4, height / 3)
    }

    const drawBird = (x: number, y: number) => {
      ctx.fillStyle = "#535353"
      // Body
      ctx.fillRect(x + 4, y + 6, 16, 8)
      // Head
      ctx.fillRect(x + 16, y + 4, 8, 6)
      // Beak
      ctx.fillRect(x + 22, y + 6, 4, 2)
      // Wings (animated)
      const wingY = Math.sin(gameState.frameCount * 0.3) * 3
      ctx.fillRect(x, y + 8 + wingY, 12, 4)
      ctx.fillRect(x + 12, y + 8 - wingY, 12, 4)
    }

    const gameLoop = () => {
      // Clear and draw sky
      ctx.fillStyle = "#f7f7f7"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw clouds
      gameState.clouds.forEach((cloud, i) => {
        cloud.x -= 0.5
        if (cloud.x < -50) cloud.x = canvas.width + 50

        ctx.fillStyle = "#e0e0e0"
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2)
        ctx.arc(cloud.x + 15, cloud.y - 5, 18, 0, Math.PI * 2)
        ctx.arc(cloud.x + 30, cloud.y, 15, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw ground line
      ctx.strokeStyle = "#535353"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, gameState.ground)
      ctx.lineTo(canvas.width, gameState.ground)
      ctx.stroke()

      // Ground dashes
      for (let i = 0; i < canvas.width; i += 40) {
        const offset = (gameState.frameCount * gameState.gameSpeed) % 40
        ctx.fillStyle = "#535353"
        ctx.fillRect(i - offset, gameState.ground + 2, 20, 2)
      }

      // Update dino physics
      gameState.dino.velocityY += gameState.dino.gravity
      gameState.dino.y += gameState.dino.velocityY

      if (gameState.dino.y >= gameState.ground - gameState.dino.height) {
        gameState.dino.y = gameState.ground - gameState.dino.height
        gameState.dino.velocityY = 0
        gameState.dino.isJumping = false
      }

      // Animate legs
      if (!gameState.dino.isJumping) {
        gameState.dino.legFrame = (gameState.dino.legFrame + 1) % 20
      }

      drawDino()

      // Spawn obstacles
      gameState.frameCount++
      if (gameState.frameCount % 80 === 0) {
        const type = Math.random() > 0.7 ? "bird" : "cactus"
        const height = type === "bird" ? 24 : 30 + Math.random() * 20
        const width = type === "bird" ? 30 : 12

        gameState.obstacles.push({
          x: canvas.width,
          width: width,
          height: height,
          scored: false,
          type: type,
        })
      }

      // Update and draw obstacles
      for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.obstacles[i]
        obs.x -= gameState.gameSpeed

        const obsY = obs.type === "bird" ? gameState.ground - obs.height - 40 : gameState.ground - obs.height

        if (obs.type === "bird") {
          drawBird(obs.x, obsY)
        } else {
          drawCactus(obs.x, obsY, obs.width, obs.height)
        }

        // Collision detection (more precise)
        if (
          gameState.dino.x + 10 < obs.x + obs.width - 5 &&
          gameState.dino.x + gameState.dino.width - 10 > obs.x + 5 &&
          gameState.dino.y + 5 < obsY + obs.height &&
          gameState.dino.y + gameState.dino.height > obsY + 5
        ) {
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

        // Score
        if (!obs.scored && obs.x + obs.width < gameState.dino.x) {
          obs.scored = true
          gameState.score += 1
        }

        if (obs.x < -obs.width - 20) {
          gameState.obstacles.splice(i, 1)
        }
      }

      // Update score
      setScore(Math.floor(gameState.score))

      // Gradually increase speed
      if (gameState.gameSpeed < 12) {
        gameState.gameSpeed += 0.001
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      document.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouch)
    }
  }, [gameStarted, gameOver, highScore])

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(true) // Start immediately on restart
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <span className="material-symbols-outlined text-5xl text-gray-600 dark:text-gray-400">cloud_off</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Internet Connection</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Play the T-Rex game while waiting!</p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-mono text-gray-700 dark:text-gray-300">
            HI: {highScore.toString().padStart(5, "0")} {score.toString().padStart(5, "0")}
          </div>
          {gameOver && (
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              Restart
            </button>
          )}
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
        />

        {gameOver && (
          <div className="text-center mt-4">
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">G A M E O V E R</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Press Space or Tap to Restart</p>
          </div>
        )}

        {!gameOver && (
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">Press Space or Tap to Jump</p>
        )}
      </div>
    </div>
  )
}
