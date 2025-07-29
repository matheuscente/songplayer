//caso mudar o database, mudar a lógica de captura de erro

const databaseErrorTranslator = (error: Error): string | null => {
    console.log(error)
    const msg = error.message
    const field = error.message.slice(error.message.indexOf('failed') + 8).split('.')[1]
    if (msg.includes('NOT NULL')) return `${field} is required`;
    if (msg.includes('UNIQUE')) return `Please send another ${field}`;
    if (msg.includes('FOREIGN KEY')) return 'This action cannot be performed due to linked records.';
    if (msg.includes('CHECK')) return 'Some value entered is outside the permitted limits.';

    return null
}

export default databaseErrorTranslator