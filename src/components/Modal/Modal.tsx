import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import styles from "./Modal.module.scss"

interface ModalProps {
	isOpen: boolean
	message: string
	onClose: () => void
}

export const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose()
		}

		if (isOpen) document.addEventListener("keydown", handleEsc)
		return () => document.removeEventListener("keydown", handleEsc)
	}, [isOpen, onClose])

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h3>Ошибка операции</h3>
					<button className={styles.closeButton} onClick={onClose}>
						&times;
					</button>
				</div>
				<div className={styles.modalBody}>
					<p>{message}</p>
				</div>
				<div className={styles.modalFooter}>
					<button className={styles.confirmButton} onClick={onClose}>
						Понятно
					</button>
				</div>
			</div>
		</div>,
		document.body
	)
}
