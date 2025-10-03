import React, { useState, useEffect } from "react"
import type { Transaction, GameState } from "@/types/game"
import {
	addPlayer,
	updatePlayerBalance,
	createTransaction,
	saveGameState,
	loadGameState,
	clearGameState,
	generateId,
} from "@/utils/gameUtils"
import PlayerList from "@/components/PlayerList"
import AddPlayerForm from "@/components/AddPlayerForm"
import TransactionForm from "@/components/TransactionForm"
import TransactionHistory from "@/components/TransactionHistory"
import GameBoard from "@/components/GameBoard"
import styles from "./MonopolyGame.module.scss"

export const MonopolyGame: React.FC = () => {
	const [gameState, setGameState] = useState<GameState>({
		players: [],
		transactions: [],
		gameId: generateId(),
	})

	const [showLoadPrompt, setShowLoadPrompt] = useState(false)

	// Загрузка сохраненной игры при первом рендере
	useEffect(() => {
		const savedGame = loadGameState()
		if (savedGame) {
			setShowLoadPrompt(true)
		}
	}, [])

	// Автосохранение при изменении состояния игры
	useEffect(() => {
		if (gameState.players.length > 0 || gameState.transactions.length > 0) {
			saveGameState(gameState)
		}
	}, [gameState])

	const handleLoadGame = () => {
		const savedGame = loadGameState()
		if (savedGame) {
			setGameState(savedGame)
		}
		setShowLoadPrompt(false)
	}

	const handleStartNewGame = () => {
		setGameState({
			players: [],
			transactions: [],
			gameId: generateId(),
		})
		clearGameState()
		setShowLoadPrompt(false)
	}

	const handleAddPlayer = (name: string) => {
		const result = addPlayer(name, gameState.players)

		if (result) {
			const { player, transaction } = result
			setGameState((prev) => ({
				...prev,
				players: [...prev.players, player],
				transactions: [transaction, ...prev.transactions],
			}))
		} else {
			// Имя уже занято - можно добавить уведомление пользователю
			alert(`Игрок с именем "${name}" уже существует!`)
		}
	}

	const handleTransaction = (
		type: "income" | "expense" | "transfer",
		amount: number,
		playerId: string,
		targetPlayerId?: string
	) => {
		const updatedPlayers = [...gameState.players]
		const newTransactions: Transaction[] = []

		if (type === "transfer" && targetPlayerId) {
			// Перевод между игроками
			const fromPlayerIndex = updatedPlayers.findIndex(
				(p) => p.id === playerId
			)
			const toPlayerIndex = updatedPlayers.findIndex(
				(p) => p.id === targetPlayerId
			)

			if (fromPlayerIndex !== -1 && toPlayerIndex !== -1) {
				const fromPlayer = updatedPlayers[fromPlayerIndex]
				const toPlayer = updatedPlayers[toPlayerIndex]

				if (fromPlayer.isActive && toPlayer.isActive) {
					updatedPlayers[fromPlayerIndex] = updatePlayerBalance(
						fromPlayer,
						-amount
					)
					updatedPlayers[toPlayerIndex] = updatePlayerBalance(
						toPlayer,
						amount
					)

					const transferTransaction = createTransaction(
						"transfer",
						amount,
						`"${fromPlayer.name}" передает "${toPlayer.name}" ${amount} тысяч монет`,
						playerId,
						targetPlayerId
					)
					newTransactions.push(transferTransaction)
				}
			}
		} else {
			// Доход или расход
			const playerIndex = updatedPlayers.findIndex(
				(p) => p.id === playerId
			)
			if (playerIndex !== -1) {
				const player = updatedPlayers[playerIndex]
				if (player.isActive) {
					updatedPlayers[playerIndex] = updatePlayerBalance(
						player,
						type === "expense" ? -amount : amount
					)

					const transaction = createTransaction(
						type,
						Math.abs(amount),
						`${player.name} ${
							type === "income" ? "получил" : "потерял"
						} ${Math.abs(amount)} тысяч монет`,
						type === "expense" ? playerId : undefined,
						type === "income" ? playerId : undefined
					)
					newTransactions.push(transaction)
				}
			}
		}

		setGameState((prev) => ({
			...prev,
			players: updatedPlayers,
			transactions: [...newTransactions, ...prev.transactions],
		}))
	}

	const handleFieldInteraction = (
		playerId: string,
		amount: number,
		description: string
	) => {
		const playerIndex = gameState.players.findIndex(
			(p) => p.id === playerId
		)
		if (playerIndex !== -1) {
			const player = gameState.players[playerIndex]
			if (player.isActive) {
				const updatedPlayers = [...gameState.players]
				updatedPlayers[playerIndex] = updatePlayerBalance(
					player,
					amount
				)

				const transaction = createTransaction(
					amount > 0 ? "income" : "expense",
					Math.abs(amount),
					`${player.name}: ${description}`,
					amount < 0 ? playerId : undefined,
					amount > 0 ? playerId : undefined
				)

				setGameState((prev) => ({
					...prev,
					players: updatedPlayers,
					transactions: [transaction, ...prev.transactions],
				}))
			}
		}
	}

	if (showLoadPrompt) {
		return (
			<div className={styles.loadPrompt}>
				<div className={styles.loadPromptContent}>
					<h2>Найдена сохраненная игра</h2>
					<p>Хотите продолжить предыдущую игру или начать новую?</p>
					<div className={styles.loadPromptButtons}>
						<button
							onClick={handleLoadGame}
							className={styles.loadGameBtn}
						>
							Продолжить игру
						</button>
						<button
							onClick={handleStartNewGame}
							className={styles.newGameBtn}
						>
							Новая игра
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.monopolyGame}>
			<header className={styles.gameHeader}>
				<h1>Игра Монополия</h1>
				<button
					onClick={handleStartNewGame}
					className={styles.newGameBtn}
				>
					Новая игра
				</button>
			</header>

			<div className={styles.gameContainer}>
				<div className={styles.leftPanel}>
					<PlayerList players={gameState.players} />
					<AddPlayerForm onAddPlayer={handleAddPlayer} />
					<TransactionForm
						players={gameState.players}
						onTransaction={handleTransaction}
					/>
				</div>

				<div className={styles.centerPanel}>
					<GameBoard
						players={gameState.players}
						onFieldInteraction={handleFieldInteraction}
					/>
				</div>

				<div className={styles.rightPanel}>
					<TransactionHistory transactions={gameState.transactions} />
				</div>
			</div>
		</div>
	)
}
