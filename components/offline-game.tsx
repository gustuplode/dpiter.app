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
  }, [])

  useEffect(() => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true)
    }
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
        jumpForce: -13,
        gravity: 0.65,
        legFrame: 0,
      },
      obstacles: [] as Array<{ x: number; width: number; height: number; scored: boolean; type: string }>,
      ground: canvas.height - 20,
      gameSpeed: 7,
      frameCount: 0,
      score: 0,
      clouds: [] as Array<{ x: number; y: number }>,
    }

    gameState.dino.y = gameState.ground - gameState.dino.height
    gameStateRef.current = gameState

    // Initialize clouds
    for (let i = 0; i < 5; i++) {
      gameState.clouds.push({
        x: Math.random() * canvas.width,
        y: 20 + Math.random() * 60,
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
        if (gameOver) {
          handleRestart()
        } else {
          jump()
        }
      }
    }

    const handleClick = () => {
      if (gameOver) {
        handleRestart()
      } else {
        jump()
      }
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      if (gameOver) {
        handleRestart()
      } else {
        jump()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchstart", handleTouch)

    const drawDino = () => {
      const { x, y, legFrame } = gameState.dino

      ctx.fillStyle = "#535353"
      ctx.fillRect(x + 6, y + 20, 34, 22)
      ctx.fillRect(x + 20, y + 12, 14, 8)
      ctx.fillRect(x + 30, y + 4, 12, 12)

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x + 36, y + 7, 3, 3)

      ctx.fillStyle = "#535353"
      ctx.fillRect(x, y + 24, 8, 6)
      ctx.fillRect(x - 4, y + 28, 6, 4)

      if (!gameState.dino.isJumping) {
        if (legFrame < 10) {
          ctx.fillRect(x + 12, y + 42, 6, 5)
          ctx.fillRect(x + 24, y + 42, 6, 5)
        } else {
          ctx.fillRect(x + 14, y + 42, 6, 5)
          ctx.fillRect(x + 26, y + 42, 6, 5)
        }
      } else {
        ctx.fillRect(x + 13, y + 42, 6, 5)
        ctx.fillRect(x + 25, y + 42, 6, 5)
      }

      ctx.fillRect(x + 20, y + 20, 4, 8)
    }

    const drawCactus = (x: number, y: number, width: number, height: number) => {
      ctx.fillStyle = "#535353"
      ctx.fillRect(x, y, width, height)
      const armY = y + height / 3
      ctx.fillRect(x - 4, armY, 4, height / 3)
      ctx.fillRect(x + width, armY, 4, height / 3)
    }

    const drawBird = (x: number, y: number) => {
      ctx.fillStyle = "#535353"
      ctx.fillRect(x + 4, y + 6, 16, 8)
      ctx.fillRect(x + 16, y + 4, 8, 6)
      ctx.fillRect(x + 22, y + 6, 4, 2)
      const wingY = Math.sin(gameState.frameCount * 0.3) * 3
      ctx.fillRect(x, y + 8 + wingY, 12, 4)
      ctx.fillRect(x + 12, y + 8 - wingY, 12, 4)
    }

    const gameLoop = () => {
      ctx.fillStyle = "#f7f7f7"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      gameState.clouds.forEach((cloud) => {
        cloud.x -= 0.8
        if (cloud.x < -50) cloud.x = canvas.width + 50

        ctx.fillStyle = "#e0e0e0"
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2)
        ctx.arc(cloud.x + 15, cloud.y - 5, 18, 0, Math.PI * 2)
        ctx.arc(cloud.x + 30, cloud.y, 15, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.strokeStyle = "#535353"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, gameState.ground)
      ctx.lineTo(canvas.width, gameState.ground)
      ctx.stroke()

      for (let i = 0; i < canvas.width; i += 40) {
        const offset = (gameState.frameCount * gameState.gameSpeed) % 40
        ctx.fillStyle = "#535353"
        ctx.fillRect(i - offset, gameState.ground + 2, 20, 2)
      }

      gameState.dino.velocityY += gameState.dino.gravity
      gameState.dino.y += gameState.dino.velocityY

      if (gameState.dino.y >= gameState.ground - gameState.dino.height) {
        gameState.dino.y = gameState.ground - gameState.dino.height
        gameState.dino.velocityY = 0
        gameState.dino.isJumping = false
      }

      if (!gameState.dino.isJumping) {
        gameState.dino.legFrame = (gameState.dino.legFrame + 1) % 20
      }

      drawDino()

      gameState.frameCount++
      if (gameState.frameCount % 75 === 0) {
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

      for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.obstacles[i]
        obs.x -= gameState.gameSpeed

        const obsY = obs.type === "bird" ? gameState.ground - obs.height - 40 : gameState.ground - obs.height

        if (obs.type === "bird") {
          drawBird(obs.x, obsY)
        } else {
          drawCactus(obs.x, obsY, obs.width, obs.height)
        }

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

        if (!obs.scored && obs.x + obs.width < gameState.dino.x) {
          obs.scored = true
          gameState.score += 1
        }

        if (obs.x < -obs.width - 20) {
          gameState.obstacles.splice(i, 1)
        }
      }

      setScore(Math.floor(gameState.score))

      if (gameState.gameSpeed < 14) {
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
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouch)
    }
  }, [gameStarted, gameOver, highScore])

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setTimeout(() => setGameStarted(true), 50)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-white dark:bg-gray-900">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 mb-6 shadow-2xl">
          <span className="material-symbols-outlined text-6xl text-white">cloud_off</span>
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">No Internet Connection</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg">Play the T-Rex game while waiting!</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          The website will automatically load when connection is restored
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="text-2xl font-mono font-bold text-gray-700 dark:text-gray-300">
            HI {highScore.toString().padStart(5, "0")}
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
            {score.toString().padStart(5, "0")}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={1000}
          height={250}
          className="w-full border-4 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl"
        />

        {gameOver && (
          <div className="text-center mt-8">
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 tracking-widest">G A M E O V E R</p>
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105"
            >
              Restart Game
            </button>
          </div>
        )}

        {!gameOver && (
          <p className="text-center mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">
            Press <kbd className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md font-mono text-sm">Space</kbd> or{" "}
            <span className="font-semibold">Tap</span> to Jump
          </p>
        )}
      </div>
    </div>
  )
}
