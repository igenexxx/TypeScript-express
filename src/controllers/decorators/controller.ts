import 'reflect-metadata';
import { NextFunction, RequestHandler, Response, Request } from 'express';
import { AppRouter } from '../../AppRouter';
import { MetadataKeys } from './MetadataKeys';
import { Methods } from './Methods';

function bodyValidator(keys: string[]): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send('Invalid request');
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send(`Missing property ${key}`);
      }
    }

    next();
  }
}

export function controller(routePrefix: string) {
  return function(target: Function) {
    const router = AppRouter.getInstance();

    Object.keys(target.prototype).forEach(key => {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.Path, target.prototype, key);
      const method: Methods = Reflect.getMetadata(MetadataKeys.Method, target.prototype, key);
      const middlewares = Reflect.getMetadata(MetadataKeys.Middleware, target.prototype, key) || [];
      const requiredBodyProps = Reflect.getMetadata(MetadataKeys.Validator, target.prototype, key) || [];
      const validator = bodyValidator(requiredBodyProps);

      if (path) {
        router[method](`${routePrefix}${path}`, ...middlewares, validator, routeHandler);
      }
    })
  }
}