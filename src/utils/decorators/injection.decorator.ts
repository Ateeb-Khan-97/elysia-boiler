import 'reflect-metadata';
type IClassLike = new (...props: any[]) => any;

const globalServices = new Map<string, any>();

export const Injectable = () => {
  return (target: IClassLike) => {
    if (globalServices.has(target.name)) {
      console.error(`Service named ${target.name} is already injectable`);
      process.exit(-1);
    }

    globalServices.set(target.name, new target());
  };
};

export const Inject = () => {
  return (target: IClassLike, pk: string | undefined, pi: number) => {
    const parameters: IClassLike[] = Reflect.getMetadata('design:paramtypes', target) || [];
    const ServiceClass = parameters[pi];
    const serviceInstance = globalServices.get(ServiceClass.name);

    if (!serviceInstance) {
      let err = `${ServiceClass.name} not found add @Injectable on it`;
      if (ServiceClass.name === 'Object') err = `@Inject didn't receive a class`;
      console.error(err);
      process.exit(-1);
    }

    parameters[pi] = serviceInstance;
    Reflect.defineMetadata('design:paramtypes', parameters, target);
  };
};

export function injectServices<T>(cls: new (...args: any[]) => T): T {
  const paramtypes = Reflect.getMetadata('design:paramtypes', cls) || [];
  const dependencies = paramtypes.map(
    (param: any) => globalServices.get(param.constructor?.name) || param
  );
  return new cls(...dependencies);
}
