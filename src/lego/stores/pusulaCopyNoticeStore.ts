import { makeAutoObservable } from 'mobx';

export const PUSULA_COPY_NOTICE_MS = 2500;

class PusulaCopyNoticeStore {
  visible = false;

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  show = () => {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.visible = true;
    this.hideTimer = setTimeout(() => {
      this.visible = false;
      this.hideTimer = null;
    }, PUSULA_COPY_NOTICE_MS);
  };
}

export const pusulaCopyNoticeStore = new PusulaCopyNoticeStore();
