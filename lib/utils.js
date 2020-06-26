const formatLowerFirst = string => `${string[0].toLowerCase()}${string.slice(1)}`;

const getIntegerDigitCount = integer => {
  return integer.toString().length;
};

const addLineNumbers = shaderSource => {
  const lines = shaderSource.split("\n");
  const maxDigitSize = getIntegerDigitCount(lines.length - 1);
  return lines.map((line, index) => {
    const lineNumber = `${index + 1}`.padStart(maxDigitSize, " ");
    return `${lineNumber}: ${line}`;
  }).join("\n");
};

export { formatLowerFirst, getIntegerDigitCount, addLineNumbers };