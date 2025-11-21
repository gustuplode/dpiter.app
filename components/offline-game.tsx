"use client"

import { useState, useEffect, useRef } from "react"

export function OfflineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game state
    const player = { x: 50, y: 150, width: 30, height: 30, velocityY: 0, gravity: 0.6, jumpPower: -12 }
    let obstacles: Array<{ x: number; y: number; width: number; height: number }> = []
    const obstacleSpeed = 3
    let frameCount = 0
    let currentScore = 0

    // Handle jump
    const handleJump = () => {
      if (!gameOver) {
        player.velocityY = player.jumpPower
      }
    }

    canvas.addEventListener("click", handleJump)
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") handleJump()
    })

    // Game loop
    const gameLoop = () => {
      if (gameOver) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update player
      player.velocityY += player.gravity
      player.y += player.velocityY

      // Ground collision
      if (player.y + player.height >= canvas.height - 20) {
        player.y = canvas.height - 20 - player.height
        player.velocityY = 0
      }

      // Top collision
      if (player.y <= 0) {
        player.y = 0
        player.velocityY = 0
      }

      // Draw ground
      ctx.fillStyle = "#8A3224"
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20)

      // Draw player
      ctx.fillStyle = "#FF6B35"
      ctx.fillRect(player.x, player.y, player.width, player.height)

      // Generate obstacles
      frameCount++
      if (frameCount % 90 === 0) {
        const height = Math.random() * 80 + 40
        obstacles.push({
          x: canvas.width,
          y: canvas.height - 20 - height,
          width: 25,
          height: height,
        })
      }

      // Update and draw obstacles
      obstacles = obstacles.filter((obs) => {
        obs.x -= obstacleSpeed

        // Draw obstacle
        ctx.fillStyle = "#8A3224"
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height)

        // Collision detection
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          setGameOver(true)
          return false
        }

        // Score when passing obstacle
        if (obs.x + obs.width < player.x && !obs.passed) {
          obs.passed = true
          currentScore++
          setScore(currentScore)
        }

        return obs.x > -obs.width
      })

      requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      canvas.removeEventListener("click", handleJump)
    }
  }, [gameStarted, gameOver])

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <span className="material-symbols-outlined text-5xl text-gray-400">cloud_off</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">You're Offline</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No internet connection. Play this game while you wait!</p>
      </div>

      {!gameStarted ? (
        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Start Game
        </button>
      ) : (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold">Score: {score}</div>
            {gameOver && (
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Restart
              </button>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full border-4 border-[#8A3224] rounded-lg bg-white dark:bg-gray-900"
          />

          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            {gameOver ? "Game Over! Tap restart to play again" : "Tap or press Space to jump"}
          </p>
        </div>
      )}
    </div>
  )
}
