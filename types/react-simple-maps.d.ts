declare module "react-simple-maps" {
  import type { ReactNode } from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: { scale?: number; center?: [number, number] };
    width?: number;
    height?: number;
    children?: ReactNode;
  }

  export const ComposableMap: (props: ComposableMapProps) => JSX.Element;

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: unknown[] }) => ReactNode;
  }

  export const Geographies: (props: GeographiesProps) => JSX.Element;

  export interface GeographyProps {
    geography: unknown;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: { default?: object; hover?: object; pressed?: object };
    children?: ReactNode;
  }

  export const Geography: (props: GeographyProps) => JSX.Element;
}
