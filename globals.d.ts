declare module '*.css';

declare module '@pqina/flip' {
  export interface TickInstance {
    value: any;
    destroy(): void;
  }

  export interface Counter {
    onupdate: (value: any) => void;
    timer: {
      stop(): void;
    };
  }

  export interface TickDOM {
    createAt?: (element: HTMLElement) => TickInstance;
    create(
      element: HTMLElement | null,
      options?: {
        value?: any;
        didInit?: (tick: TickInstance) => void;
      }
    ): TickInstance;
    destroy(instance: TickInstance | HTMLElement | undefined): void;
  }

  export interface TickHelper {
    duration(value: number, unit: string): number;
    interval(callback: (value: any) => void, options?: any): any;
  }

  export interface TickCount {
    down(
      deadline: Date | string | number,
      options?: {
        format?: string[];
      }
    ): Counter;
  }

  export interface Tick {
    DOM: TickDOM;
    helper: TickHelper;
    count: TickCount;
    plugin: { add(plugin: unknown): void };
  }

  const Tick: Tick;
  export default Tick;
}