"use client"

import { useState, useEffect, useRef } from "react"

export function OfflineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameStateRef = useRef<any>(null)

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const player = { x: 50, y: 150, width: 30, height: 30, velocityY: 0, gravity: 0.6, jumpPower: -12 }
    const obstacles: Array<{ x: number; y: number; width: number; height: number; passed?: boolean }> = []
    const obstacleSpeed = 3
    let frameCount = 0
    let currentScore = 0
    let animationId: number

    gameStateRef.current = { player, obstacles, frameCount, currentScore }

    const handleJump = () => {
      if (!gameOver && player.y + player.height >= canvas.height - 20) {
        player.velocityY = player.jumpPower
      }
    }

    const handleClick = () => handleJump()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        handleJump()
      }
    }

    canvas.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeyDown)

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      player.velocityY += player.gravity
      player.y += player.velocityY

      if (player.y + player.height >= canvas.height - 20) {
        player.y = canvas.height - 20 - player.height
        player.velocityY = 0
      }

      if (player.y <= 0) {
        player.y = 0
        player.velocityY = 0
      }

      ctx.fillStyle = "#8A3224"
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20)

      ctx.fillStyle = "#FF6B35"
      ctx.fillRect(player.x, player.y, player.width, player.height)

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

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i]
        obs.x -= obstacleSpeed

        ctx.fillStyle = "#8A3224"
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height)

        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          setGameOver(true)
          cancelAnimationFrame(animationId)
          return
        }

        if (obs.x + obs.width < player.x && !obs.passed) {
          obs.passed = true
          currentScore++
          setScore(currentScore)
        }

        if (obs.x < -obs.width) {
          obstacles.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
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
