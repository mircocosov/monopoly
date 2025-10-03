import React from 'react';
import type { Player } from '@/types/game';
import { formatMoney } from '@/utils/gameUtils';
import styles from './GameBoard.module.scss';

interface GameBoardProps {
  players: Player[];
  onFieldInteraction: (playerId: string, amount: number, description: string) => void;
}

interface GameField {
  id: number;
  name: string;
  description: string;
  effect: 'income' | 'expense';
  amount: number;
}

const gameFields: GameField[] = [
  { id: 1, name: 'Старт', description: 'Получите 2 миллиона монет', effect: 'income', amount: 2000 },
  { id: 2, name: 'Банк', description: 'Получите 3 миллиона монет', effect: 'income', amount: 3000 },
  { id: 3, name: 'Лотерея', description: 'Получите 1.5 миллиона монет', effect: 'income', amount: 1500 },
  { id: 4, name: 'Бонус', description: 'Получите 1 миллион монет', effect: 'income', amount: 1000 },
  { id: 5, name: 'Налоговая', description: 'Заплатите 1 миллион монет', effect: 'expense', amount: 1000 },
  { id: 6, name: 'Штраф', description: 'Заплатите 500 тысяч монет', effect: 'expense', amount: 500 },
  { id: 7, name: 'Больница', description: 'Заплатите 2 миллиона монет', effect: 'expense', amount: 2000 },
  { id: 8, name: 'Пожар', description: 'Заплатите 1.5 миллиона монет', effect: 'expense', amount: 1500 },
];

export const GameBoard: React.FC<GameBoardProps> = ({ players, onFieldInteraction }) => {
  const activePlayers = players.filter(player => player.isActive);

  const handleFieldClick = (field: GameField) => {
    if (activePlayers.length === 0) return;
    
    // Выбираем случайного активного игрока
    const randomPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];
    const amount = field.effect === 'income' ? field.amount : -field.amount;
    
    onFieldInteraction(randomPlayer.id, amount, field.description);
  };

  return (
    <div className={styles.gameBoard}>
      <h3>Игровое поле</h3>
      <div>
        <div className={styles.fieldsGrid}>
          {gameFields.map(field => (
            <div
              key={field.id}
              className={`${styles.gameField} ${field.effect === 'income' ? styles.incomeField : styles.expenseField}`}
              onClick={() => handleFieldClick(field)}
            >
              <div className={styles.fieldName}>{field.name}</div>
              <div className={styles.fieldDescription}>{field.description}</div>
              <div className={styles.fieldAmount}>
                {field.effect === 'income' ? '+' : '-'}{formatMoney(field.amount)}
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.boardInstructions}>
          <p>Нажмите на любое поле, чтобы случайный активный игрок взаимодействовал с ним</p>
          {activePlayers.length === 0 && (
            <p className={styles.warning}>Нет активных игроков для взаимодействия с полями</p>
          )}
        </div>
      </div>
    </div>
  );
};
