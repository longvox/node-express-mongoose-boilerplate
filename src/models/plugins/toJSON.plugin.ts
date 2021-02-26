import {Schema} from "mongoose";

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
const toJSON = (schema: Schema<any>, _opts?: any): void => {
  let transform:any;
  if ((schema as any).options.toJSON && (schema as any).options.toJSON.transform) {
    transform = (schema as any).options.toJSON.transform;
  }

  (schema as any).options.toJSON = Object.assign((schema as any).options.toJSON || {}, {
    transform(doc: any, ret: any, options: any) {
      Object.keys(schema.paths).forEach((path) => {
        if ((schema.paths[path] as any).options && (schema.paths[path] as any).options.private) {
          delete ret[path];
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
