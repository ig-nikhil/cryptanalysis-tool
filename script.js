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
        result = "Playfair Cipher decryption is not yet implemented.";
    }

    resultsDiv.textContent = result;
});
