const queryValidation = ({ query, allowedFields }) => {
  const fields = query?.fields?.split(",");

  const validation = fields?.reduce(
    (acc, field) => {
      if (!allowedFields.includes(field)) {
        // .push(`'${field}' is not a valid field`);
        acc.invalidFields.push(`'${field}' is not a valid field`);
      } else {
        acc.validFields[field] = true;
      }
      return acc;
    },
    {
      invalidFields: [],
      validFields: {id: true},
    }
  );

console.log(">>>>>>>.")
  return {
    invalidFields: validation?.invalidFields || [],
    validFields: validation?.validFields || {},
  };
};

module.exports = queryValidation;
