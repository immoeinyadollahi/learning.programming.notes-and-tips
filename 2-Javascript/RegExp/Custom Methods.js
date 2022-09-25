MultiLine

const str = `
>1==asdsd
>>2==aaaaaa
>3==aaaaaa
`;

String.prototype.matchMultiLine = function (regex, global) {
  const strMatch = this.match(regex);
  if (strMatch) {
    return strMatch;
  } else {
    const lines = this.split("\n");
    if (global) {
      const matches = [];
      for (const line of lines) {
        const lineMatch = line.match(regex);
        if (lineMatch) {
          matches.push(lineMatch);
        }
      }
      return matches;
    } else {
      for (const line of lines) {
        const lineMatch = line.match(regex);
        if (lineMatch) {
          return lineMatch;
        }
      }
    }
  }
};
console.log(str.trim().matchMultiLine(/^(?<level>\>+)(?<page_num>\d+)==(?<title>.+)$/, true));
// Same As
console.log(...str.trim().matchAll(/^(?<level>\>+)(?<page_num>\d+)==(?<title>.+)$/gm));

// Globaly
RegExp.prototype.matchAllTest = function (string) {
  const matches = [];
  let result;
  let str = string;
  while ((result = this.exec(str))) {
    const startIndex = result.index + string.length - str.length;
    const endIndex = result[0].length + startIndex;
    matches.push({ match: result[0], startIndex, endIndex });
    str = str.slice(endIndex);
    if (!str) break;
  }
  return matches;
};
RegExp.prototype.execute = function (string) {  global flag does not use slice its wrong instead use  /[\w\W]{lastIndex}(regex)/
  const str = string.slice(this.lastIndex);
  const match = str.match(new RegExp(this));
  if (match) {
    if (this.sticky) {
      if (this.lastIndex !== match.index) {
        this.lastIndex = 0;
        return null;
      }
    }
    const startIndex = match.index + string.length - str.length;
    const endIndex = match[0].length + startIndex;
    const result = { match: match[0], startIndex, endIndex };
    this.lastIndex = endIndex;
    return result;
  }
  this.lastIndex = 0;
  return null;
};
String.prototype.matchAll = function (regex) {
  const re = new RegExp(regex);
  const matches = [];
  let match;
  while ((match = re.execute(this))) {
    matches.push(match);
    if (match.index === re.lastIndex) { // or !match[0].length
    re.lastIndex++;
    }
  }
  return matches;
};