// utils/file.utils.js
const fs = require('fs');
const path = require('path');

const uploadRoot = path.join(__dirname, '../uploads');

/**
 * Save a byte array as a file in user-specific folder
 * @param {Array} byteArray - array of numbers from React
 * @param {string} userId - user id (number or string)
 * @param {string} type - 'agreements' or 'documents'
 * @param {string} originalFileName - original file name from frontend
 * @param {number} index - order number of file for unique naming
 * @returns {string} relative file path for DB storage
 */
const saveUserFile = (byteArray, userId, type, originalFileName, index) => {
    if (!byteArray || !Array.isArray(byteArray)) {
        throw new Error('Invalid byte array');
    }

    // Create user-specific folder
    const userFolder = path.join(uploadRoot, `U${userId}`, type);
    if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
    }

    // File name: U{userId}-A01-{filename} or U{userId}-D03-{filename}
    const prefix = type === 'agreements' ? 'A' : 'D';
    const fileIndex = String(index + 1).padStart(2, '0'); // 01, 02, etc.
    const fileName = `U${userId}-${prefix}${fileIndex}-${originalFileName}`;

    // Full path
    const filePath = path.join(userFolder, fileName);

    // Save file
    const buffer = Buffer.from(byteArray);
    fs.writeFileSync(filePath, buffer);

    // Return relative path (for DB)
    return path.join(`U${userId}`, type, fileName);
};

module.exports = { saveUserFile };
