
import {
  BetAcceptedInterface,
  BetCashoutedInterface,
  CONSOLE_TYPES_DEPEND_ON_PANEL,
  GameConnection,
  notificationStore,
  translationStore,
} from '@10gzv/crash-core';

import { GameStateUpdateInterface } from '@/lego/interfaces';

export class GameLiveConnection extends GameConnection {
  override onGameStateUpdate(data: GameStateUpdateInterface) {
    super.onGameStateUpdate(data);
  }

  override onBetAccepted(data: BetAcceptedInterface): void {
    super.onBetAccepted(data);

    const panelKey =
      CONSOLE_TYPES_DEPEND_ON_PANEL[
        data.ticket_name as keyof typeof CONSOLE_TYPES_DEPEND_ON_PANEL
      ];
    if (!panelKey) return;

    notificationStore.updateNotificationsData(
      {
        active: true,
        content: translationStore.t('notification.betAccepted', {
          defaultValue: 'Bet accepted!',
        }),
      },
      panelKey,
    );
  }

  override onBetCashouted(data: BetCashoutedInterface): void {
    super.onBetCashouted(data);

    const panelKey =
      CONSOLE_TYPES_DEPEND_ON_PANEL[
        data.ticket_name as keyof typeof CONSOLE_TYPES_DEPEND_ON_PANEL
      ];
    if (!panelKey) return;

    const panel = notificationStore.notificationsData[panelKey];
    if (!panel.active || !panel.content) return;

    notificationStore.updateNotificationsData(
      {
        active: true,
        content: `${panel.content}#${data.cashout_odd}`,
      },
      panelKey,
    );
  }
}
