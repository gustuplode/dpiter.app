"use client"

import { useState, useEffect, useRef } from "react"

export function OfflineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const player = {
      x: 50,
      y: 150,
      width: 30,
      height: 30,
      velocityY: 0,
      gravity: 0.6,
      jumpPower: -12,
      isJumping: false,
    }
    const obstacles: Array<{ x: number; y: number; width: number; height: number; passed?: boolean }> = []
    const obstacleSpeed = 3
    let frameCount = 0
    let currentScore = 0

    const handleJump = () => {
      if (!player.isJumping) {
        player.velocityY = player.jumpPower
        player.isJumping = true
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

      // Update player
      player.velocityY += player.gravity
      player.y += player.velocityY

      if (player.y + player.height >= canvas.height - 20) {
        player.y = canvas.height - 20 - player.height
        player.velocityY = 0
        player.isJumping = false
      }

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

      // Spawn obstacles
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
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i]
        obs.x -= obstacleSpeed

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
          if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current)
          }
          return
        }

        // Score increment
        if (obs.x + obs.width < player.x && !obs.passed) {
          obs.passed = true
          currentScore++
          setScore(currentScore)
        }

        // Remove off-screen obstacles
        if (obs.x < -obs.width) {
          obstacles.splice(i, 1)
        }
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      canvas.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameStarted, gameOver])

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setTimeout(() => setGameStarted(true), 50)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 mb-4">
          <span className="material-symbols-outlined text-5xl text-[#8A3224]">cloud_off</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark">You're Offline</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">No internet connection. Play this game while you wait!</p>
      </div>

      {!gameStarted ? (
        <button
          onClick={handleRestart}
          className="px-8 py-3 bg-[#8A3224] text-white rounded-lg font-medium hover:bg-[#6B2619] transition-colors shadow-lg"
        >
          Start Game
        </button>
      ) : (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-[#8A3224]">Score: {score}</div>
            {gameOver && (
              <div className="flex gap-2 items-center">
                <span className="text-lg font-bold text-red-600">Game Over!</span>
                <button
                  onClick={handleRestart}
                  className="px-6 py-2 bg-[#8A3224] text-white rounded-lg font-medium hover:bg-[#6B2619] transition-colors shadow-lg"
                >
                  Restart
                </button>
              </div>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full border-4 border-[#8A3224] rounded-xl bg-white dark:bg-gray-900 shadow-2xl"
          />

          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            {gameOver ? "Tap restart to play again!" : "Tap screen or press Space to jump over obstacles"}
          </p>
        </div>
      )}
    </div>
  )
}
