import { FC, useEffect, type CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { Chat as ChatCore } from '@10gzv/crash-core/chat';
import { chatStore } from '@10gzv/crash-core';

import { chatConnection } from '@/connection';

export const Chat: FC = observer(() => {
  const { isChatConnected, isChatOpened, online } = chatStore;

  useEffect(() => {
    if (!isChatConnected && isChatOpened) {
      chatConnection.createConnection();
    }
  }, [isChatConnected, isChatOpened]);

  return (
    <div
      className="Pusula-ChatRoot"
      style={
        {
          '--pusula-chat-online-count': `"${online}"`,
        } as CSSProperties
      }
    >
      <ChatCore onClose={() => chatStore.setIsChatOpened(false)} />
    </div>
  );
});
