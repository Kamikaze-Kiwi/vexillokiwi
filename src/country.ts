export interface CountryType {
    code: string;
    name: string;
    altNames: string[];
    capital: string;
    region: string;
    difficulty: number;
    previousGuesses: boolean[] 
}