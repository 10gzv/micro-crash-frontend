
import { IBet } from "@10gzv/crash-core";

export interface IBetCardProps extends IBet {
  withActions?: boolean;
  tag?: React.ElementType<any>;
}
