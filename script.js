// Caesar Cipher Decryption
function caesarDecrypt(ciphertext) {
    let results = [];
    for (let shift = 0; shift < 26; shift++) {
        let decrypted = "";
        for (let char of ciphertext.toUpperCase()) {
            if (char >= "A" && char <= "Z") {
                let shiftedChar = String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
                decrypted += shiftedChar;
            } else {
                decrypted += char;
            }
        }
        results.push(`Key ${shift}: ${decrypted}`);
    }
    return results.join("\n");
}

// Substitution Cipher Frequency Analysis
function substitutionFrequency(ciphertext) {
    let frequency = {};
    for (let char of ciphertext.toUpperCase()) {
        if (char >= "A" && char <= "Z") {
            frequency[char] = (frequency[char] || 0) + 1;
        }
    }
    let sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    return sorted.map(([char, count]) => `${char}: ${count}`).join("\n");
}

// Vigenère Cipher Decryption Helper
function vigenereDecrypt(ciphertext, key) {
    let decrypted = "";
    let keyIndex = 0;
    key = key.toUpperCase();
    for (let char of ciphertext.toUpperCase()) {
        if (char >= "A" && char <= "Z") {
            let shift = key.charCodeAt(keyIndex % key.length) - 65;
            decrypted += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            keyIndex++;
        } else {
            decrypted += char;
        }
    }
    return decrypted;
}

// Affine Cipher Decryption
function affineDecrypt(ciphertext, a, b) {
    const modInverse = (a, m) => {
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x;
        }
        return -1;
    };

    let aInv = modInverse(a, 26);
    if (aInv === -1) return "Invalid key";

    let decrypted = "";
    for (let char of ciphertext.toUpperCase()) {
        if (char >= "A" && char <= "Z") {
            let decoded = (aInv * (char.charCodeAt(0) - 65 - b + 26)) % 26;
            decrypted += String.fromCharCode(decoded + 65);
        } else {
            decrypted += char;
        }
    }
    return decrypted;
}


// Playfair Cipher Decryption
function playfairDecrypt(ciphertext, key) {
    // Prepare the grid by removing duplicates and filling the alphabet
    key = key.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let grid = [];
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';  // No 'J' in the Playfair grid
    let used = new Set();

    // Add the key's characters first
    for (let char of key) {
        if (!used.has(char)) {
            grid.push(char);
            used.add(char);
        }
    }

    // Add remaining letters of the alphabet to the grid
    for (let char of alphabet) {
        if (!used.has(char)) {
            grid.push(char);
            used.add(char);
        }
    }

    // Generate the Playfair grid (5x5)
    let grid2D = [];
    for (let i = 0; i < 5; i++) {
        grid2D.push(grid.slice(i * 5, i * 5 + 5));
    }

    // Split the ciphertext into digraphs
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    if (ciphertext.length % 2 !== 0) ciphertext += 'X'; // Add X if odd length

    let digraphs = [];
    for (let i = 0; i < ciphertext.length; i += 2) {
        let pair = ciphertext[i] + ciphertext[i + 1];
        if (pair[0] === pair[1]) {
            digraphs.push(pair[0] + 'X'); // Same letter in a pair, add 'X'
            i--; // Don't move forward by 2 characters
        } else {
            digraphs.push(pair);
        }
    }

    // Decrypt each digraph
    let decrypted = '';
    for (let digraph of digraphs) {
        let [a, b] = digraph;
        let aRow, aCol, bRow, bCol;

        // Find positions of the letters in the grid
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (grid2D[i][j] === a) {
                    aRow = i;
                    aCol = j;
                }
                if (grid2D[i][j] === b) {
                    bRow = i;
                    bCol = j;
                }
            }
        }

        // Same row: move left
        if (aRow === bRow) {
            aCol = (aCol - 1 + 5) % 5;
            bCol = (bCol - 1 + 5) % 5;
        }
        // Same column: move up
        else if (aCol === bCol) {
            aRow = (aRow - 1 + 5) % 5;
            bRow = (bRow - 1 + 5) % 5;
        }
        // Rectangle: swap columns
        else {
            [aCol, bCol] = [bCol, aCol];
        }

        // Add decrypted pair to the result
        decrypted += grid2D[aRow][aCol] + grid2D[bRow][bCol];
    }

    return decrypted;
}

// Main Analysis Function
document.getElementById("analyze").addEventListener("click", () => {
    const cipher = document.getElementById("cipher").value;
    const ciphertext = document.getElementById("ciphertext").value;
    const resultsDiv = document.getElementById("results");

    let result = "";
    if (cipher === "caesar") {
        result = caesarDecrypt(ciphertext);
    } else if (cipher === "substitution") {
        result = substitutionFrequency(ciphertext);
    } else if (cipher === "vigenere") {
        const key = prompt("Enter the Vigenère key:");
        result = vigenereDecrypt(ciphertext, key);
    } else if (cipher === "affine") {
        const a = parseInt(prompt("Enter the 'a' value:"));
        const b = parseInt(prompt("Enter the 'b' value:"));
        result = affineDecrypt(ciphertext, a, b);
    } else if (cipher === "playfair") {
       const key = prompt("Enter the Playfair key:");
        result = playfairDecrypt(ciphertext, key);
    }

    resultsDiv.textContent = result;
});
