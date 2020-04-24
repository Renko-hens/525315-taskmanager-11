const filterNames = [
  `all`, `overdue`, `today`, `favorites`, `repeating`, `archive`
];

const generateFilters = () => {
  return filterNames.map((name) => {
    return {
      title: name,
      count: Math.floor(Math.random() * 20),
    };
  });
};

export {generateFilters};
