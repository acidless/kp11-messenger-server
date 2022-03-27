import { HttpException, HttpStatus } from '@nestjs/common';

export function include(object: Object, props: Array<string>) {
  const newObj: any = {};

  Object.keys(object).forEach((key) => {
    if (props.includes(key)) {
      newObj[key] = object[key];
    }
  });

  return newObj;
}

export function exclude(object: Object, props: Array<string>) {
  const newObj: any = {};

  Object.keys(object).forEach((key) => {
    if (!props.includes(key)) {
      newObj[key] = object[key];
    }
  });

  return newObj;
}

export function excludeEmpty(object: Object) {
  const newObj: any = {};

  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObj[key] = object[key];
    }
  });

  return newObj;
}

export function IsObjectId(id: string) {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new HttpException('Неверный формат ID', HttpStatus.BAD_REQUEST);
  }
}
