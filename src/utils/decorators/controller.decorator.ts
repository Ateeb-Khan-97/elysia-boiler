import "reflect-metadata";
import type { Context, Elysia, TSchema } from "elysia";
import LoggerService from "@/helper/logger.service";

type Method = "post" | "put" | "patch" | "delete" | "get";
type Service = new () => void;
type Metadata = {
  path: string;
  method: Method;
  class_method: string;
  body?: { schema: TSchema; param_index: number };
  query?: { schema: TSchema; param_index: number };
  param?: { key: string; param_index: number };
  context?: { param_index: number };
  public: boolean;
};

export function Controller(prefix: string): ClassDecorator {
  return (target) => {
    const next_tick = () => {
      const services: Service[] = Reflect.getMetadata("services", target) ?? [];
      const apiTag: string | undefined = Reflect.getMetadata("api_tag", target);
      const targetInstance = new (target as any)(...services);
      const metadata: Metadata[] =
        Reflect.getMetadata("metadata", target) ?? [];

      async function init(app: Elysia) {
        LoggerService("RoutesResolver").log(`${target.name} {${prefix}}`);

        for (const em of metadata) {
          const path = prefix + em.path;
          const route_exp_msg = `Mapped {${path}, ${em.method.toUpperCase()}} route`;
          LoggerService("RouterExplorer").log(route_exp_msg);

          const handler_parameters = [] as any[];
          const bind_handler =
            targetInstance[em.class_method].bind(targetInstance);
          const isGenerator = bind_handler.constructor.name
            .toLowerCase()
            .endsWith("generatorfunction");

          let handler: Function;
          if (isGenerator) {
            handler = async function* (c: any) {
              if (typeof em.body?.param_index === "number")
                handler_parameters[em.body.param_index] = c.body;
              if (typeof em.query?.param_index === "number")
                handler_parameters[em.query.param_index] = c.query;
              if (typeof em.param?.param_index === "number")
                handler_parameters[em.param.param_index] =
                  c.params[em.param.key];
              if (typeof em.context?.param_index === "number")
                handler_parameters[em.context.param_index] = c;

              for await (let chunk of bind_handler(...handler_parameters))
                yield chunk;
            };
          } else {
            handler = async function (c: any) {
              if (typeof em.body?.param_index === "number")
                handler_parameters[em.body.param_index] = c.body;
              if (typeof em.query?.param_index === "number")
                handler_parameters[em.query.param_index] = c.query;
              if (typeof em.param?.param_index === "number")
                handler_parameters[em.param.param_index] =
                  c.params[em.param.key];
              if (typeof em.context?.param_index === "number")
                handler_parameters[em.context.param_index] = c;

              return bind_handler(...handler_parameters);
            };
          }

          app.route(em.method, path, handler, {
            body: em.body?.schema,
            query: em.query?.schema as any,
            tags: apiTag ? [apiTag] : [],
            config: { allowMeta: true },
            detail: em.public
              ? { security: [] }
              : { security: [{ BearerAuth: [] }] },
          });
        }

        return app;
      }

      (target as any)["init"] = init;
    };

    process.nextTick(next_tick);
  };
}
export function ApiTag(tag: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("api_tag", tag, target);
  };
}

export function Get(path = "/"): MethodDecorator {
  return (target, pk, desc: PropertyDescriptor) => {
    process.nextTick(() => {
      const c_metadata =
        Reflect.getMetadata("metadata", target.constructor) ?? [];
      const metadata = Reflect.getMetadata("metadata", desc.value) ?? {};

      metadata["path"] = path;
      metadata["method"] = "get";
      metadata["class_method"] = pk;

      c_metadata.push(metadata);
      Reflect.defineMetadata("metadata", metadata, desc.value);
      Reflect.defineMetadata("metadata", c_metadata, target.constructor);
    });
  };
}
export function Post(path = "/"): MethodDecorator {
  return (target, pk, desc: PropertyDescriptor) => {
    process.nextTick(() => {
      const c_metadata =
        Reflect.getMetadata("metadata", target.constructor) ?? [];
      const metadata = Reflect.getMetadata("metadata", desc.value) ?? {};

      metadata["path"] = path;
      metadata["method"] = "post";
      metadata["class_method"] = pk;

      c_metadata.push(metadata);
      Reflect.defineMetadata("metadata", metadata, desc.value);
      Reflect.defineMetadata("metadata", c_metadata, target.constructor);
    });
  };
}
export function Put(path = "/"): MethodDecorator {
  return (target, pk, desc: PropertyDescriptor) => {
    process.nextTick(() => {
      const c_metadata =
        Reflect.getMetadata("metadata", target.constructor) ?? [];
      const metadata = Reflect.getMetadata("metadata", desc.value) ?? {};

      metadata["path"] = path;
      metadata["method"] = "put";
      metadata["class_method"] = pk;

      c_metadata.push(metadata);
      Reflect.defineMetadata("metadata", metadata, desc.value);
      Reflect.defineMetadata("metadata", c_metadata, target.constructor);
    });
  };
}
export function Patch(path = "/"): MethodDecorator {
  return (target, pk, desc: PropertyDescriptor) => {
    process.nextTick(() => {
      const c_metadata =
        Reflect.getMetadata("metadata", target.constructor) ?? [];
      const metadata = Reflect.getMetadata("metadata", desc.value) ?? {};

      metadata["path"] = path;
      metadata["method"] = "patch";
      metadata["class_method"] = pk;

      c_metadata.push(metadata);
      Reflect.defineMetadata("metadata", metadata, desc.value);
      Reflect.defineMetadata("metadata", c_metadata, target.constructor);
    });
  };
}
export function Delete(path = "/"): MethodDecorator {
  return (target, pk, desc: PropertyDescriptor) => {
    process.nextTick(() => {
      const c_metadata =
        Reflect.getMetadata("metadata", target.constructor) ?? [];
      const metadata = Reflect.getMetadata("metadata", desc.value) ?? {};

      metadata["path"] = path;
      metadata["method"] = "delete";
      metadata["class_method"] = pk;

      c_metadata.push(metadata);
      Reflect.defineMetadata("metadata", metadata, desc.value);
      Reflect.defineMetadata("metadata", c_metadata, target.constructor);
    });
  };
}
export function Public(): MethodDecorator {
  return (target, pk, desc: PropertyDescriptor) => {
    const metadata = Reflect.getMetadata("metadata", desc.value) ?? {};
    metadata["public"] = true;
    Reflect.defineMetadata("metadata", metadata, desc.value);
  };
}

export function Body(schema: TSchema): ParameterDecorator {
  return (target: any, pk: any, pi) => {
    const decorator_metadata =
      Reflect.getMetadata("metadata", target[pk]) ?? {};
    decorator_metadata["body"] = { schema, param_index: pi };
    Reflect.defineMetadata("metadata", decorator_metadata, target[pk]);
  };
}

export function Param(key: string): ParameterDecorator {
  return (target: any, pk: any, pi) => {
    const decorator_metadata =
      Reflect.getMetadata("metadata", target[pk]) ?? {};
    decorator_metadata["param"] = { key, param_index: pi };
    Reflect.defineMetadata("metadata", decorator_metadata, target[pk]);
  };
}

export function Query(schema: TSchema): ParameterDecorator {
  return (target: any, pk: any, pi) => {
    const decorator_metadata =
      Reflect.getMetadata("metadata", target[pk]) ?? {};
    decorator_metadata["query"] = { schema, param_index: pi };
    Reflect.defineMetadata("metadata", decorator_metadata, target[pk]);
  };
}
export function Context(): ParameterDecorator {
  return (target: any, pk: any, pi) => {
    const decorator_metadata =
      Reflect.getMetadata("metadata", target[pk]) ?? {};
    decorator_metadata["context"] = { param_index: pi };
    Reflect.defineMetadata("metadata", decorator_metadata, target[pk]);
  };
}
