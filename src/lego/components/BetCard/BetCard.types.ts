/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBet } from "@10gzv/crash-core";

export interface IBetCardProps extends IBet {
  withActions?: boolean;
  tag?: React.ElementType<any>;
}
