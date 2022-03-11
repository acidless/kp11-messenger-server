export function include(object: any, props: Array<string>) {
  const newObj: any = {};

  Object.keys(object._doc).forEach((key) => {
    if (props.includes(key)) {
      newObj[key] = object[key];
    }
  });

  return newObj;
}
