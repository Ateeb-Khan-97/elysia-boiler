import 'reflect-metadata';
import { ApplicationDataSource, connectDB } from '../data-source';
import type { Repository } from 'typeorm';

type IClassLike = new (...props: any[]) => any;

const globalRepositories = new Map<string, Repository<any>>();
const globalServices = new Map<string, any>();

export const Injectable = () => {
  return (target: IClassLike) => {
    if (globalServices.has(target.name)) {
      console.error(`Service named ${target.name} is already injectable`);
      process.exit(-1);
    }

    const repos = Reflect.getMetadata('params', target) || [];
    const params: any[] = [];
    for (const eachRepo of repos) params[eachRepo.pi] = eachRepo.repository;
    globalServices.set(target.name, new target(...params));
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

export const InjectRepository = (entity: new (...props: any) => any) => {
  return (target: IClassLike, pk: string | undefined, pi: number) => {
    let repository = globalRepositories.get(entity.name);
    const params = Reflect.getMetadata('params', target) || [];

    if (repository) {
      params.push({ repository, pi });
    } else {
      repository = ApplicationDataSource.getRepository(entity);
      globalRepositories.set(entity.name, repository);
      params.push({ repository, pi });
    }
    Reflect.defineMetadata('params', params, target);
  };
};

export function injectServices<T>(cls: new (...args: any[]) => T): T {
  const paramtypes = Reflect.getMetadata('design:paramtypes', cls) || [];
  const dependencies = paramtypes.map(
    (param: any) => globalServices.get(param.constructor?.name) || param
  );
  return new cls(...dependencies);
}
