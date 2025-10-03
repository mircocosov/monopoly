import React from 'react';
import type { Player } from '@/types/game';
import { formatMoney } from '@/utils/gameUtils';
import styles from './PlayerList.module.scss';

interface PlayerListProps {
  players: Player[];
}

export const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const activePlayers = players.filter(player => player.isActive);
  const inactivePlayers = players.filter(player => !player.isActive);

  return (
    <div className={styles.playerList}>
      <h3>Игроки</h3>
      
      {activePlayers.length > 0 && (
        <div className="active-players">
          <h4>Активные игроки</h4>
          {activePlayers.map(player => (
            <div 
              key={player.id} 
              className={`${styles.playerCard} ${player.balance < 0 ? styles.negativeBalance : ''}`}
            >
              <div className={styles.playerName}>{player.name}</div>
              <div className={`${styles.playerBalance} ${player.balance < 0 ? styles.negative : styles.positive}`}>
                {formatMoney(player.balance)}
              </div>
            </div>
          ))}
        </div>
      )}

      {inactivePlayers.length > 0 && (
        <div className="inactive-players">
          <h4>Выбывшие игроки</h4>
          {inactivePlayers.map(player => (
            <div key={player.id} className={`${styles.playerCard} ${styles.inactive}`}>
              <div className={styles.playerName}>{player.name}</div>
              <div className={`${styles.playerBalance} ${styles.negative}`}>
                {formatMoney(player.balance)} (выбыл)
              </div>
            </div>
          ))}
        </div>
      )}

      {players.length === 0 && (
        <p className={styles.noPlayers}>Нет игроков. Добавьте первого игрока!</p>
      )}
    </div>
  );
};
