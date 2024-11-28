class CommonService {
  async awaited<T>(promise: Promise<T>) {
    try {
      return [undefined, (await promise) as T] as const;
    } catch (error: any) {
      return [error as Error, undefined] as const;
    }
  }

  async sleep(ms = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  exclude<T, Key extends keyof T>(object: T, keys: Key[]): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(object as Record<any, any>).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<T, Key>;
  }
}

export const commonService = new CommonService();
