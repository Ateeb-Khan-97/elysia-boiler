import type Elysia from "elysia";

type Controllers = new (props: any[]) => any;
export function Module(props: { controllers: Controllers[] }): ClassDecorator {
  return (target) => {
    Reflect.defineProperty(target.prototype, "init", {
      value: async (app: Elysia) => {
        return new Promise((resolve) => {
          process.nextTick(() => {
            props.controllers.forEach((ec: any) => {
              if (ec?.init) return ec.init(app);

              const error = `Invalid controller class ${ec?.name}, are you sure it has @Controller decorator`;
              console.error(error);
              process.exit(-1);
            });
            resolve(app);
          });
        });
      },
      writable: true,
      configurable: true,
    });
  };
}
