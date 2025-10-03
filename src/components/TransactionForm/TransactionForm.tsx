import React, { useState } from "react"
import type { Player } from "@/types/game"
import styles from "./TransactionForm.module.scss"
import { Modal } from "@/components/Modal/Modal"

interface TransactionFormProps {
	players: Player[]
	onTransaction: (
		type: "income" | "expense" | "transfer",
		amount: number,
		playerId: string,
		targetPlayerId?: string
	) => void
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
	players,
	onTransaction,
}) => {
	const [transactionType, setTransactionType] = useState<
		"income" | "expense" | "transfer"
	>("income")
	const [amount, setAmount] = useState("")
	const [playerId, setPlayerId] = useState("")
	const [targetPlayerId, setTargetPlayerId] = useState("")
	const [error, setError] = useState("")
	const [isModalOpen, setIsModalOpen] = useState(false)

	const activePlayers = players.filter((player) => player.isActive)

	const player = playerId ? players.find((p) => p.id === playerId) : undefined
	const maxTransferAmount = player ? Math.max(player.balance - 1, 0) : 0

	const clearError = () => {
		setError("")
		setIsModalOpen(false)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		clearError()

		const numAmount = parseInt(amount)
		if (isNaN(numAmount)) {
			showError("Введите корректную сумму")
			return
		}

		if (numAmount <= 0) {
			showError("Сумма должна быть положительной")
			return
		}

		if (!playerId) {
			showError("Выберите игрока")
			return
		}

		if (transactionType === "transfer") {
			if (!targetPlayerId) {
				showError("Выберите получателя перевода")
				return
			}

			if (player && player.balance - numAmount < 1) {
				showError(
					`Нельзя перевести больше ${maxTransferAmount} тысяч монет. ` +
						`После перевода должно остаться минимум 1000 монет.`
				)
				return
			}
		}

		if (transactionType === "transfer" && targetPlayerId) {
			onTransaction(transactionType, numAmount, playerId, targetPlayerId)
		} else if (transactionType !== "transfer") {
			onTransaction(transactionType, numAmount, playerId)
		}
		setAmount("")
	}

	const showError = (message: string) => {
		setError(message)
		setIsModalOpen(true)
	}

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		if (value === "" || /^\d+$/.test(value)) {
			setAmount(value)
			clearError()
		}
	}

	return (
		<div className={styles.transactionForm}>
			<Modal isOpen={isModalOpen} message={error} onClose={clearError} />

			<h3>Финансовые операции</h3>
			<form onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label>Тип операции:</label>
					<select
						value={transactionType}
						onChange={(e) => {
							setTransactionType(e.target.value as any)
							clearError()
						}}
						className={styles.transactionTypeSelect}
					>
						<option value="income">Получение денег</option>
						<option value="expense">Потеря денег</option>
						<option value="transfer">Перевод игроку</option>
					</select>
				</div>

				<div className={styles.formGroup}>
					<label>Игрок:</label>
					<select
						value={playerId}
						onChange={(e) => {
							setPlayerId(e.target.value)
							clearError()
						}}
						className={styles.playerSelect}
						required
					>
						<option value="">Выберите игрока</option>
						{activePlayers.map((player) => (
							<option key={player.id} value={player.id}>
								{player.name} (баланс: {player.balance} тыс.)
							</option>
						))}
					</select>
				</div>

				{transactionType === "transfer" && (
					<div className={styles.formGroup}>
						<label>Получатель:</label>
						<select
							value={targetPlayerId}
							onChange={(e) => {
								setTargetPlayerId(e.target.value)
								clearError()
							}}
							className={styles.playerSelect}
							required
						>
							<option value="">Выберите получателя</option>
							{activePlayers
								.filter((player) => player.id !== playerId)
								.map((player) => (
									<option key={player.id} value={player.id}>
										{player.name} (баланс: {player.balance}{" "}
										тыс.)
									</option>
								))}
						</select>
					</div>
				)}

				<div className={styles.formGroup}>
					<label>Сумма (в тысячах монет):</label>
					<input
						type="text"
						value={amount}
						onChange={handleAmountChange}
						placeholder="Например: 15000 для 15 миллионов"
						className={styles.amountInput}
						required
					/>
				</div>

				<button type="submit" className={styles.transactionBtn}>
					Выполнить операцию
				</button>
			</form>
		</div>
	)
}
