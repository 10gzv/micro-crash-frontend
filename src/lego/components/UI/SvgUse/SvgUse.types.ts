export interface ISvgUseProps {
  id:
    | 'share'
    | 'reset'
    | 'burger'
    | 'chat'
    | 'clock'
    | 'info'
    | 'music'
    | 'sound'
    | 'wallet'
    | 'logo'
    | 'user'
    | 'provable'
    | 'heart-fill'
    | 'messageSend'
    | 'heart'
    | 'online'
    | 'emoji'
    | 'abcd'
    | 'ellipsis'
    | 'fairness-simple'
    | 'animation'
    | 'rules'
    | 'limits'
    | 'score'
    | 'copy'
    | 'home'
    | 'ticket';
  className?: string;
  onClick?: () => void;
}
