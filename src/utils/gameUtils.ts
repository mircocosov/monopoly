import type { Player, Transaction, GameState } from "@/types/game"
import { STARTING_BALANCE, MIN_BALANCE } from "@/types/game"

export const formatMoney = (amount: number): string => {
	if (amount === 0) return "0 монет"
	const millions = Math.floor(amount / 1000)
	const thousands = amount % 1000

	let result = ""

	if (millions !== 0) {
		result += `${millions} миллион${
			millions === 1 ? "" : millions < 5 ? "а" : "ов"
		}`
	}

	if (thousands !== 0) {
		if (result) result += " "
		result += `${thousands} тысяч${
			thousands === 1 ? "а" : thousands < 5 ? "и" : ""
		}`
	}

	result += " монет"
	return result
}

export const generateId = (): string => {
	return Math.random().toString(36).substring(2, 11)
}

export const addPlayer = (
	name: string,
	existingPlayers: Player[]
): { player: Player; transaction: Transaction } | null => {
	// Проверяем уникальность имени
	const isNameTaken = existingPlayers.some(
		(player) =>
			player.name.toLowerCase().trim() === name.toLowerCase().trim()
	)

	if (isNameTaken) {
		return null // Имя уже занято
	}
	const player: Player = {
		id: generateId(),
		name,
		balance: STARTING_BALANCE,
		isActive: true,
	}

	const transaction: Transaction = {
		id: generateId(),
		timestamp: Date.now(),
		type: "player_added",
		amount: STARTING_BALANCE,
		toPlayerId: player.id,
		description: `Добавлен игрок "${name}" со стартовым балансом ${formatMoney(
			STARTING_BALANCE
		)}`,
	}

	return { player, transaction }
}

export const updatePlayerBalance = (player: Player, amount: number): Player => {
	const newBalance = player.balance + amount
	const isActive = newBalance >= MIN_BALANCE

	return {
		...player,
		balance: newBalance,
		isActive,
	}
}

export const createTransaction = (
	type: Transaction["type"],
	amount: number,
	description: string,
	fromPlayerId?: string,
	toPlayerId?: string
): Transaction => {
	return {
		id: generateId(),
		timestamp: Date.now(),
		type,
		amount,
		fromPlayerId,
		toPlayerId,
		description,
	}
}

export const saveGameState = (gameState: GameState): void => {
	localStorage.setItem("monopoly-game-state", JSON.stringify(gameState))
}

export const loadGameState = (): GameState | null => {
	const saved = localStorage.getItem("monopoly-game-state")
	if (!saved) return null

	try {
		return JSON.parse(saved)
	} catch {
		return null
	}
}

export const clearGameState = (): void => {
	localStorage.removeItem("monopoly-game-state")
}
