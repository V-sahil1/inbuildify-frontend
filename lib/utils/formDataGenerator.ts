export const formDataGenerator = (
  obj: any,
  form: FormData = new FormData(),
  namespace = ''
): FormData => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const formKey = namespace ? `${namespace}[${key}]` : key;
      const value = obj[key];

      if (value instanceof Date) {
        form.append(formKey, value.toISOString());
      } else if (value instanceof File || value instanceof Blob) {
        form.append(formKey, value);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && (value[0] instanceof File || value[0] instanceof Blob)) {
          value.forEach(file => {
            form.append(`${formKey}`, file);
          });
        } else if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          value.forEach((item, index) => {
            formDataGenerator(item, form, `${formKey}[${index}]`);
          });
        } else {
          value.forEach(val => {
            form.append(`${formKey}[]`, val);
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        formDataGenerator(value, form, formKey);
      } else if (value) {
        form.append(formKey, String(value));
      }
    }
  }
  return form;
};
