// Collection of code snippets for different programming languages

// JavaScript snippets
const javascriptSnippets = [
  `function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}`,
  `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}`
];

// Python snippets - Using concatenated strings to avoid TypeScript linter issues
const pythonSnippets = [
  // Snippet 1
  "def calculate_average(numbers):\n" +
  "    total = sum(numbers)\n" +
  "    return total / len(numbers) if numbers else 0\n" +
  "\n" +
  "# Example usage\n" +
  "scores = [85, 90, 78, 92, 88]\n" +
  "average = calculate_average(scores)\n" +
  "print(f\"Average score: {average}\")",
  
  // Snippet 2
  "import requests\n" +
  "\n" +
  "def fetch_data(url):\n" +
  "    try:\n" +
  "        response = requests.get(url)\n" +
  "        response.raise_for_status()\n" +
  "        return response.json()\n" +
  "    except requests.exceptions.RequestException as e:\n" +
  "        print(f\"Error fetching data: {e}\")\n" +
  "        return None"
];

// Java snippets
const javaSnippets = [
  `public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static int subtract(int a, int b) {
        return a - b;
    }
}`
];

// HTML/CSS snippets
const htmlSnippets = [
  `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`
];

// SQL snippets
const sqlSnippets = [
  `SELECT * FROM users WHERE active = TRUE;`,
  
  `CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);`,

  `SELECT 
    c.name AS category,
    COUNT(p.id) AS product_count,
    AVG(p.price) AS avg_price
FROM 
    categories c
LEFT JOIN 
    products p ON c.id = p.category_id
GROUP BY 
    c.id, c.name
HAVING 
    COUNT(p.id) > 5
ORDER BY 
    product_count DESC;`,

  `INSERT INTO orders (user_id, total_amount, status)
VALUES 
    (101, 150.75, 'pending'),
    (202, 89.99, 'completed'),
    (101, 45.25, 'processing');`,

  `UPDATE customers
SET 
    email = 'newemail@example.com',
    last_login = CURRENT_TIMESTAMP
WHERE 
    id = 1045 AND status = 'active';`,

  `DELETE FROM cart_items
WHERE 
    user_id = 2034
    AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);`
];

// Collection of languages and their snippets
const snippetsByLanguage: Record<string, string[]> = {
  'javascript': javascriptSnippets,
  'python': pythonSnippets,
  'java': javaSnippets,
  'html': htmlSnippets,
  'sql': sqlSnippets,
};

// Default language to use if requested language not found
const defaultLanguage = 'javascript';

/**
 * Generates a random code snippet for the specified language
 * @param language The programming language for the snippet
 * @returns A random code snippet
 */
export function generateCodeSnippet(language: string): string {
  // Convert language to lowercase for case-insensitive comparison
  const lang = language.toLowerCase();
  
  // Get snippets for the requested language or use default
  const snippets = snippetsByLanguage[lang] || snippetsByLanguage[defaultLanguage];
  
  // Return a random snippet
  return snippets[Math.floor(Math.random() * snippets.length)];
} 