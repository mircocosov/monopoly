import React, { useState } from "react"
import styles from "./AddPlayerForm.module.scss"
import { Modal } from "@/components/Modal/Modal"

interface AddPlayerFormProps {
	onAddPlayer: (name: string) => void
}

export const AddPlayerForm: React.FC<AddPlayerFormProps> = ({
	onAddPlayer,
}) => {
	const [playerName, setPlayerName] = useState("")
	const [error, setError] = useState("")
	const [isModalOpen, setIsModalOpen] = useState(false)

	const clearError = () => {
		setError("")
		setIsModalOpen(false)
	}

	const showError = (message: string) => {
		setError(message)
		setIsModalOpen(true)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const trimmedName = playerName.trim()

		if (!trimmedName) {
			showError("Введите имя игрока")
			return
		}

		if (trimmedName.length < 2) {
			showError("Имя должно содержать минимум 2 символа")
			return
		}

		if (trimmedName.length > 20) {
			showError("Имя не должно превышать 20 символов")
			return
		}

		onAddPlayer(trimmedName)
		setPlayerName("")
	}

	return (
		<div className={styles.addPlayerForm}>
			<Modal isOpen={isModalOpen} message={error} onClose={clearError} />

			<h3>Добавить игрока</h3>
			<form onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<input
						type="text"
						value={playerName}
						onChange={(e) => {
							setPlayerName(e.target.value)
							clearError()
						}}
						placeholder="Имя игрока"
						className={styles.playerNameInput}
						maxLength={20}
						required
					/>
				</div>
				<button type="submit" className={styles.addPlayerBtn}>
					Добавить игрока
				</button>
			</form>
		</div>
	)
}
