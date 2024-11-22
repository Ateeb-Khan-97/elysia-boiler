import { Injectable } from '@/utils/decorators/injection.decorator';

@Injectable()
export class CommonService {
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
}
