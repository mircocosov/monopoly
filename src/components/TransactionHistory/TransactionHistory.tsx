import React, { useEffect, useRef } from "react"
import type { Transaction } from "@/types/game"
import { formatMoney } from "@/utils/gameUtils"
import styles from "./TransactionHistory.module.scss"

interface TransactionHistoryProps {
	transactions: Transaction[]
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
	transactions,
}) => {
	const historyContainerRef = useRef<HTMLDivElement>(null)

	const formatTimestamp = (timestamp: number) => {
		return new Date(timestamp).toLocaleString("ru-RU")
	}

	// Автоматический скролл вниз при добавлении новых транзакций
	useEffect(() => {
		if (historyContainerRef.current) {
			historyContainerRef.current.scrollTop =
				historyContainerRef.current.scrollHeight
		}
	}, [transactions])

	const getTransactionClass = (type: string) => {
		// Фиолетовый цвет по умолчанию для всех типов
		if (!type) return styles.playerAdded

		switch (type) {
			case "income":
				return styles.income
			case "expense":
				return styles.expense
			default:
				return styles.playerAdded
		}
	}

	const getAmountSign = (type: string) => {
		switch (type) {
			case "income":
				return "+"
			case "expense":
				return "-"
			default:
				return ""
		}
	}

	return (
		<div className={styles.transactionHistory}>
			<h3>История транзакций</h3>
			<div className={styles.historyContainer} ref={historyContainerRef}>
				{transactions.length === 0 ? (
					<p className={styles.noTransactions}>
						История транзакций пуста
					</p>
				) : (
					<div className={styles.transactionsList}>
						{transactions
							.slice()
							.reverse()
							.map((transaction) => (
								<div
									key={transaction.id}
									className={`${
										styles.transactionItem
									} ${getTransactionClass(transaction.type)}`}
								>
									<div className={styles.transactionTime}>
										{formatTimestamp(transaction.timestamp)}
									</div>
									<div
										className={
											styles.transactionDescription
										}
									>
										{transaction.description}
									</div>
									<div className={styles.transactionAmount}>
										{getAmountSign(transaction.type)}
										{formatMoney(transaction.amount)}
									</div>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	)
}
