/**
 * Generate a summary from blog content
 * Takes the first 200 characters and adds ellipsis if needed
 */
function generateSummary(content) {
  if (!content) return "";
  
  const maxLength = 200;
  
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength).trim() + "...";
}

module.exports = generateSummary;
