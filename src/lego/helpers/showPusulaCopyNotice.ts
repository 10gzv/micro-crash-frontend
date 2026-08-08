import { pusulaCopyNoticeStore } from '@lego/stores/pusulaCopyNoticeStore';

/** Figma pill toast — same family as stage bet / cashout notices. */
export function showPusulaCopyNotice() {
  pusulaCopyNoticeStore.show();
}
