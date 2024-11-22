import { Injectable } from './utils/decorators/injection.decorator';

@Injectable()
export class AppService {
  helloWorld() {
    console.log('Hello World');
  }
}
