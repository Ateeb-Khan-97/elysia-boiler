import "reflect-metadata";

export function Injectable(): ClassDecorator {
  return (target) => {
    if (!(global as any)[target.name]) {
      (global as any)[target.name] = new (target as any)();
    } else {
      console.error("Service already exists please change its name");
      process.exit(-1);
    }
  };
}

export function Inject(Service: new () => any): ParameterDecorator {
  const service_instance = (global as any)[Service.name];
  if (!service_instance) {
    const error = `Service class ${Service.name} cannot be inject, are you sure it has @Injectable decorator`;
    console.error(error);
    process.exit(-1);
  }

  return (target) => {
    const injections: any[] = Reflect.getMetadata("services", target) ?? [];
    injections.unshift(service_instance);
    Reflect.defineMetadata("services", injections, target);
  };
}
