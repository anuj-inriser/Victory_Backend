function isSuspiciousInput(input) {
  if (!input || typeof input !== "string") return false;

  const suspiciousPatterns = [
    // Common SQL keywords
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC|UNION|CREATE|GRANT|REVOKE|MERGE)\b/g,
    // Boolean/logical operators often abused
    /\b(OR|AND)\b/g,
    // Comments and delimiters
    /(--|#|;)/,
    // Quotes or escape characters
    /['"\\]/,
    // SQL clauses
    /\b(WHERE|FROM|HAVING|INTO|VALUES|SET)\b/g,
    // Wildcards
    /\*/,
    // Pipe operator
    /\|/
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

module.exports = isSuspiciousInput;
