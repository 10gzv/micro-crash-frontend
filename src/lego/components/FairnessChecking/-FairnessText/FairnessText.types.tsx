export interface IFairnessTextProps {
  caption?: string;
  copiable?: boolean;
  horizontal?: boolean;
  text: string;
  onCopy?: () => void;
}
