import * as rand from "random-seed";

const consonants = ["B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "Z"]; // tslint:disable-line
const vowels = ["A", "E", "I", "O", "U"]; // tslint:disable-line

function heroNamePossibleCharacter(lastCharacter: string) {
    switch (lastCharacter) {
        case "A": return [ ...consonants, "U" ];
        case "B": return [ "R", "L", ...vowels ];
        case "C": return [ "H" ];
        case "D": return [ ...vowels ];
        case "E": return [ "I", ...consonants ];
        case "F": return [ "R", ...vowels ];
        case "G": return [ "R", "L", ...vowels ];
        case "H": return [ ...vowels ];
        case "I": return [ ...consonants ];
        case "J": return [ ...vowels ];
        case "K": return [ "R", "L", ...vowels ];
        case "L": return [ ...vowels ];
        case "M": return [ ...vowels ];
        case "N": return [ ...vowels ];
        case "O": return [ ...consonants, "U" ];
        case "P": return [ "R", ...vowels ];
        case "Q": return [ "U" ];
        case "R": return [ ...vowels ];
        case "S": return [ "C", "P", "T", "M", "N", ...vowels ];
        case "T": return [ "S", "Z", ...vowels ];
        case "U": return [ ...consonants ];
        case "W": return [ ...vowels ];
        case "Z": return [ "Z", ...vowels ];
        case "Ä": return [ ...consonants, "U" ];
        case "Ö": return [ ...consonants ];
        case "Ü": return [ ...consonants ];
        default: throw new Error(`Invalid character: "${lastCharacter}"`);
    }
}

const familyNameSuffix = [
    "tor",
    "tington",
    "tel",
    "ker",
    "ler",
    "ke",
];

export function generateFamilyName(r = rand.create()) {
    let lastName = generateFirstName("", r);
    if (vowels.includes(lastName.toUpperCase()[lastName.length - 1])) {
        lastName = `${lastName}${familyNameSuffix[r(familyNameSuffix.length)]}`;
    }
    return lastName;
}

export function generateFirstName(name = "", r = rand.create()) {
    if (name.length === 0) {
        return generateFirstName(consonants[r(consonants.length)], r);
    }
    if (name.length > 3 + r(4)) { return name; }
    const lastCharacter = name.toUpperCase()[name.length - 1];
    const possibleCharacters = heroNamePossibleCharacter(lastCharacter);
    let newCharacter = possibleCharacters[r(possibleCharacters.length)];
    if (newCharacter === "A" && r(10) < 2) { newCharacter = "Ä"; }
    if (newCharacter === "O" && r(10) < 1) { newCharacter = "Ö"; }
    if (newCharacter === "U" && r(10) < 1) { newCharacter = "Ü"; }
    if (["B", "D", "F", "M", "N", "P", "S", "T"].includes(newCharacter)) {
        newCharacter = `${newCharacter}${newCharacter}`;
    }
    if (newCharacter === "O" && r(10) < 1) { newCharacter = "Ö"; }
    if (newCharacter === "U" && r(10) < 1) { newCharacter = "Ü"; }
    return generateFirstName(`${name}${newCharacter.toLowerCase()}`);
}

export function generateName() {
    return `${generateFirstName()} ${generateFamilyName()}`;
}
