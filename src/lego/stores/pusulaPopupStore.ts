import { makeAutoObservable } from 'mobx';

class PusulaPopupStore {
  gameLimitsOpen = false;
  gameRulesOpen = false;
  provablyFairOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  openGameLimits = () => {
    this.gameLimitsOpen = true;
  };

  closeGameLimits = () => {
    this.gameLimitsOpen = false;
  };

  openGameRules = () => {
    this.gameRulesOpen = true;
  };

  closeGameRules = () => {
    this.gameRulesOpen = false;
  };

  openProvablyFair = () => {
    this.provablyFairOpen = true;
  };

  closeProvablyFair = () => {
    this.provablyFairOpen = false;
  };
}

export const pusulaPopupStore = new PusulaPopupStore();
